<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\ProductItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\CloudinaryTrait;

class CartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use ApiResponse;
    use CloudinaryTrait;

    public function index()
    {
        try {
            $user = auth('api')->user();
            // return response()->json([
            //     'user' => $user
            // ], 501);
            $cartItems = CartItem::with([
                // Load quan hệ với điều kiện is_active = 1 cho tất cả các bảng
                'productItem' => function ($query) {
                    $query->where('is_active', 1)
                        ->with([
                            'product' => fn($q) => $q->where('is_active', 1),
                            'color' => fn($q) => $q->where('is_active', 1),
                            'size' => fn($q) => $q->where('is_active', 1),
                            'product.productImages' => fn($q) => $q->where('is_active', 1)
                        ]);
                }
            ])
                ->where('user_id', $user->id)
                ->orderBy('id', 'desc')->get();

            // Lọc các cart item có dữ liệu hợp lệ
            $validCartItems = $cartItems->filter(function ($cartItem) {
                return $cartItem->productItem
                    && $cartItem->productItem->product
                    && $cartItem->productItem->color
                    && $cartItem->productItem->size;
            });


            $formattedCartItems = $validCartItems->map(function ($cartItem) {
                $productItem = $cartItem->productItem;
                $product = $productItem->product;
                // Lấy ảnh đầu tiên khớp với color_id của productItem
                $image = $product->productImages->where('color_id', $productItem->color_id)->first()?->url;
                $image = $this->buildImageUrl($image) ?? null;

                return [
                    'id' => $cartItem->id,
                    'idProduct_item' => $productItem->id,
                    'name' => $product->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $productItem->price,
                    'sale_percent' => $productItem->sale_percent,
                    'sale_price' => $productItem->sale_price,
                    'slug' => $product->slug,
                    'sku' => $productItem->sku,
                    'image' => $image,
                    'subtotal' => $cartItem->quantity * $productItem->sale_price,
                    'color' => optional($productItem->color)->name,
                    'size' => optional($productItem->size)->name,
                    // 'color' => [
                    //     'id' => $productItem->color->id,
                    //     'name' => $productItem->color->name,
                    // ],
                    // 'size' => [
                    //     'id' => $productItem->size->id,
                    //     'name' => $productItem->size->name,
                    // ],
                ];
            })->values();

            $totalItem = $formattedCartItems->count();
            $totalPrice = $formattedCartItems->sum('subtotal');

            $result = [
                'cartItems' => $formattedCartItems,
                'idUser' => $user->id,
                'totalItem' => $totalItem,
                'totalPriceCart' => $totalPrice,
            ];

            //             return response()->json($formattedCartItems);
            return response()->json($result);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy danh sách sản phẩm trong giỏ hàng', [$th->getMessage()], 403);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $user = auth('api')->user();

            $validated = $request->validate([
                'quantity' => 'required|integer|min:1',
                'product_item_id' => 'required|integer'
            ]);

            $productItemId = $validated['product_item_id'];
            $requestedQuantity = $validated['quantity'];

            DB::beginTransaction();

            try {
                // Lấy thông tin product item
                $productItem = ProductItem::find($productItemId);
                if (!$productItem) {
                    return $this->error('Không tìm thấy sản phẩm', [], 404);
                }

                // Kiểm tra số lượng cart item hiện tại của user
                $cartItemCount = CartItem::where('user_id', $user->id)->count();

                if ($cartItemCount >= 99) {
                    return $this->error('Giỏ hàng đã đạt giới hạn 99 sản phẩm', [], 400);
                }

                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                $cartItem = CartItem::where('user_id', $user->id)
                    ->where('product_item_id', $productItemId)
                    ->first();

                // Nếu có, kiểm tra xem số lượng yêu cầu có hợp lệ không
                if ($cartItem) {
                    // Nếu đã có sản phẩm trong giỏ hàng
                    $newQuantity = $cartItem->quantity + $requestedQuantity;
                    // Kiểm tra stock sau khi cộng dồn
                    if ($productItem->stock < $newQuantity) {
                        return $this->error(
                            'Số lượng yêu cầu vượt quá số lượng có sẵn',
                            [
                                'available_stock' => $productItem->stock,
                                'requested_quantity' => $requestedQuantity,
                                'current_quantity' => $cartItem->quantity,
                                'product_name' => $productItem->product->name
                            ],
                            400
                        );
                    }
                    // Cộng dồn số lượng
                    $cartItem->increment('quantity', $requestedQuantity);
                } else {
                    // Nếu chưa có sản phẩm trong giỏ hàng
                    // Kiểm tra stock trước khi tạo mới
                    if ($productItem->stock < $requestedQuantity) {
                        return $this->error(
                            'Số lượng yêu cầu vượt quá số lượng có sẵn',
                            [
                                'available_stock' => $productItem->stock,
                                'requested_quantity' => $requestedQuantity,
                                'product_name' => $productItem->product->name
                            ],
                            400
                        );
                    }
                    // Tạo mới cart item
                    $cartItem = CartItem::create([
                        'user_id' => $user->id,
                        'product_item_id' => $productItemId,
                        'quantity' => $requestedQuantity
                    ]);
                }

                DB::commit();

                return $this->success($cartItem, 'Thêm sản phẩm vào giỏ hàng thành công', 201);
            } catch (\Throwable $th) {
                // Rollback transaction nếu có lỗi
                DB::rollback();
                return $this->error('Lỗi thêm sản phẩm vào giỏ hàng', [$th->getMessage()], 403);
            }
        } catch (\Throwable $th) {
            return $this->error('Lỗi thêm sản phẩm vào giỏ hàng', [$th->getMessage()], 403);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = auth('api')->user();

            $cartItem = CartItem::where('user_id', $user->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $productItem = $cartItem->productItem;
            $requestedQuantity = $validated['quantity'];
            if (!$productItem) {
                return $this->error('Không tìm thấy sản phẩm', [], 404);
            }

            DB::beginTransaction();

            try {
                // Kiểm tra stock
                if ($productItem->stock < $requestedQuantity) {
                    return $this->error(
                        'Số lượng yêu cầu vượt quá số lượng có sẵn',
                        [
                            'available_stock' => $productItem->stock,
                            'requested_quantity' => $requestedQuantity,
                            'product_name' => $productItem->product->name
                        ],
                        400
                    );
                }

                $cartItem->update(attributes: [
                    'quantity' => $requestedQuantity
                ]);

                DB::commit();

                return $this->success($cartItem, 'Cập nhật giỏ hàng thành công', 200);
            } catch (\Throwable $th) {
                DB::rollBack();
                return $this->error('Lỗi cập nhật sản phẩm trong giỏ hàng', [$th->getMessage()], 402);
            }
        } catch (\Throwable $th) {
            return $this->error('Lỗi cập nhật sản phẩm trong giỏ hàng', [$th->getMessage()], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = auth('api')->user();

            $cartItem = CartItem::where('user_id', $user->id)
                ->findOrFail($id);

            $cartItem->delete();

            return $this->success($cartItem, 'Xóa sản phẩm khỏi giỏ hàng thành công', 200);
        } catch (\Throwable $th) {
            return $this->error('Lỗi xóa sản phẩm trong giỏ hàng', [$th->getMessage()], 403);
        }
    }
}
