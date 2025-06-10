<?php

namespace App\Http\Controllers\api\Client;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use ApiResponse;

    public function index()
    {
        try {
            $user = auth('api')->user();
            $cartItems = CartItem::with([
            // Load quan hệ với điều kiện is_active = 1 cho tất cả các bảng
            'productItem' => function ($query) {
                $query->where('is_active', 1)
                    ->with([
                        'product' => fn ($q) => $q->where('is_active', 1),
                        'color' => fn ($q) => $q->where('is_active', 1),
                        'size' => fn ($q) => $q->where('is_active', 1),
                        'product.productImages' => fn ($q) => $q->where('is_active', 1)
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

                return [
                    'id' => $cartItem->id,
                    'quantity' => $cartItem->quantity,
                    'product_name' => $product->name,
                    'price' => $productItem->price,
                    'sale_price' => $productItem->sale_price,
                    'color' => $productItem->color->name,
                    'size' => $productItem->size->name,
                    'image_url' => $product->productImages->first()?->url
                ];
            });

            return response()->json($formattedCartItems);

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

            // Kiểm tra số lượng cart item hiện tại của user
            $cartItemCount = CartItem::where('user_id', $user->id)->count();

            if ($cartItemCount >= 99) {
                return $this->error('Giỏ hàng đã đạt giới hạn 99 sản phẩm', [], 400);
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            $cartItem = CartItem::where('user_id', $user->id)
                ->where('product_item_id', $validated['product_item_id'])
                ->first();

            if ($cartItem) {
                // Nếu đã có, cộng dồn số lượng
                $cartItem->increment('quantity', $validated['quantity']);
            } else {
                // Nếu chưa, tạo mới
                $cartItem = CartItem::create([
                    'user_id' => $user->id,
                    'product_item_id' => $validated['product_item_id'],
                    'quantity' => $validated['quantity']
                ]);
            }

            return $this->success($cartItem, 'Thêm sản phẩm vào giỏ hàng thành công', 201);
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
                'quantity' => 'required|integer',
            ]);

            $productItem = $cartItem->productItem;
            $requestedQuantity = $validated['quantity'];

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

            return $this->success($cartItem, 'Cập nhật giỏ hàng thành công', 200);
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
