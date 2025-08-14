<?php

namespace App\Http\Controllers\Api\Client;

use App\Events\OrderStatusUpdated;
use App\Notifications\OrderStatusNotification;
use Log;
use Carbon\Carbon;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\CartItem;
use App\Models\ProductItem;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use App\Models\OrdersDetail;
use Illuminate\Http\Request;
use App\Models\ShippingAddress;
use App\Traits\CreateOrderTrait;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Mail\OrderConfirmationMail;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\OrderResource;
use App\Models\User;
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\Client\CouponResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Notification;

class OrderController extends Controller
{
    use ApiResponse;
    use CreateOrderTrait;
    use CloudinaryTrait;
    public function redem(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'coupon_code' => 'nullable|string',
            'total_price_item' => 'nullable|numeric|min:0',
        ]);

        $is_ship = 0;
        $total = $request->input('total_price_item');
        $code = $request->input('coupon_code');
        $discount = 0;
        $now = now();

        // Danh sách voucher đủ điều kiện nếu có truyền tổng tiền
        $vouchers = [];
        if ($total !== null) {
            $vouchers = Coupon::where('is_active', true)
                ->where('limit_use', '>', 0)
                ->where('time_start', '<=', $now)
                ->where('time_end', '>=', $now)
                ->where('min_price_order', '<=', $total)
                ->get();
        }

        // Nếu không truyền mã hoặc rỗng → xem như hủy mã
        if (empty($code)) {
            return response()->json([
                'discount' => 0,
                'coupon' => null,
                'message' => 'Đã hủy áp dụng mã giảm giá.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ]);
        }

        $coupon = Coupon::where('code', $code)->first();

        // Các kiểm tra hợp lệ
        if (!$coupon) {
            return response()->json([
                'discount' => 0,
                'coupon' => null,
                'message' => 'Mã giảm giá không tồn tại.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        if (!$coupon->is_active) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã bị vô hiệu hóa.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        if ($coupon->limit_use <= 0) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã hết lượt sử dụng.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        if ($coupon->time_start && $coupon->time_start > $now) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá chưa được áp dụng.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        if ($coupon->time_end && $coupon->time_end < $now) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã hết hạn.',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        if ($total === null || $total < $coupon->min_price_order) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Giá trị đơn hàng chưa đủ để áp dụng mã giảm giá. Yêu cầu tối thiểu: ' . number_format($coupon->min_price_order) . '₫',
                'available_vouchers' => CouponResource::collection($vouchers)
            ], 400);
        }

        // === Tính giảm giá theo type ===
        if ($coupon->type === 'percentage') {
            $discount = ceil(min(
                $total * ($coupon->value / 100),
                $coupon->max_price_discount
            ));
        } elseif ($coupon->type === 'fixed') {
            $discount = min($coupon->value, $coupon->max_price_discount);
        } elseif ($coupon->type === 'free_shipping') {
            $is_ship = 1;
            $discount = 0;
        };
        // Loại bỏ mã đã áp dụng ra khỏi danh sách voucher còn lại
        $vouchers = $vouchers->filter(fn($v) => $v->id !== $coupon->id)->values();

        return response()->json([
            'discount' => $discount,
            'coupon' => $coupon->code,
            'is_ship' => $is_ship,
            'message' => 'Áp dụng mã giảm giá thành công.',
            'available_vouchers' => CouponResource::collection($vouchers)
        ]);
    }


    public function store(Request $request)
    {

        $request->validate([

            'payment_method' => 'required|string',
            'shipping_address_id' => 'required|exists:shipping_address,id',
            'shipping_price' => 'required|integer|min:0',
            'coupon_code' => 'nullable|string',
            'cartItems' => 'required|array|min:1',
            'cartItems.*.idProduct_item' => 'required|exists:product_items,id',
            'cartItems.*.quantity' => 'required|integer|min:1',
            'cartItems.*.idItem' => 'required|exists:cart_items,id',
            'cartItems.*.price' => 'required|numeric|min:0',

            'cartItems.*.sale_price' => 'required|numeric|min:0',
            'cartItems.*.sale_percent' => 'required|numeric|min:0',
            'cartItems.*.image_product' => 'required|string',
            'total_price_cart' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        return $this->createOrder($request);
    }

    public function index(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();

            // Khởi tạo query builder
            $query = Order::with(['statusOrder', 'orderDetails'])
                ->where('user_id', $user->id);

            // Lọc theo status_order_id (dựa trên request)
            $statusOrderId = $request->input('status_order_id');
            if ($statusOrderId && in_array($statusOrderId, [1, 2, 3, 4, 5, 6, 7])) {
                $query->where('status_order_id', $statusOrderId);
            }

            // Lọc theo khoảng ngày (date_from và date_to)
            $dateFrom = $request->input('date_from');
            $dateTo = $request->input('date_to');
            if ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            }

            // Tìm kiếm tương đối chỉ theo orders_code
            $search = $request->input('search');
            if ($search) {
                $query->where('orders_code', 'like', "%{$search}%");
            }

            // Phân trang
            $perPage = $request->input('per_page', 10); // Số mục trên mỗi trang, mặc định 10
            $orders = $query->orderBy('id', 'desc')
                ->paginate($perPage);

            // Chuyển đổi dữ liệu sang OrderResource
            $orders->getCollection()->transform(function ($order) {
                return new OrderResource($order);
            });

            return response()->json($orders);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy danh sách đơn hàng', [$th->getMessage()], 403);
        }
    }

    public function update(Request $request, $id)
    {
        // return response()->json([
        //     'id' => $id
        // ], 501);
        try {
            $order = Order::findOrFail($id);
            /** @var \App\Models\User $user */
            $user = auth('api')->user();
            // return response()->json([
            //     'user' => $user
            // ], 501);

            // Kiểm tra quyền sở hữu đơn hàng
            if ($order->user_id !== $user->id) {
                return $this->error('Bạn không có quyền chỉnh sửa đơn hàng này.', [], 403);
            }


            $currentStatus = $order->status_order_id;
            // $newStatus = $request->input('status_order_id');

            // Xử lý logic cập nhật trạng thái
            if ($currentStatus == 1 || $currentStatus == 2) {
                DB::transaction(function () use ($order) {
                    // Chuyển từ "Chưa xác nhận" (1) hoặc "đang chuẩn bị" (2) sang "Đã hủy" (7)
                    $order->update(['status_order_id' => 7]);
                    if ($order->payment_method == "vnpay") {
                        $order->update(['status_payment' => 2]); # Chờ hoàn tiền
                    }
                    foreach ($order->orderDetails as $orderDetail) {
                        $productItem = $orderDetail->productItem;
                        if ($productItem) {
                            // Restore stock biến thể của sản phẩm
                            $productItem->increment('stock', $orderDetail->quantity);
                        };
                    };
                });
                $message = 'Đơn hàng đã được hủy thành công.';
                // Notify owner (user) — optional (he is the one who canceled)
                $user->notify(new OrderStatusNotification($user->id, $order->orders_code, 7, $message));

                // Notify admins (tùy project: chọn admin bằng cột is_admin hoặc role)
                $admins = User::where('role', 'Admin')->get();
                // Notification::send($admins, new OrderStatusNotification($user->id, $order->orders_code, 7, "Khách hàng {$user->name} đã hủy đơn #{$order->orders_code}"));
                Notification::send($admins, new OrderStatusNotification($user->id, $order->orders_code, 7, '<span>
                            Khách hàng
                            <span style="color:red;font-weight:bold;">' .
                    $user->name . '
                            </span>
                            đã hủy đơn
                            <span style="color:red;font-weight:bold;">
                              #' . $order->orders_code . '
                            </span>
                          </span>', 1));
            } elseif ($currentStatus == 4) {
                // Chuyển từ "Đã giao hàng" (4) sang "Hoàn thành" (6)
                $order->update(['status_order_id' => 6]);

                $message = 'Đơn hàng đã được hoàn thành.';
                $user->notify(new OrderStatusNotification($user->id, $order->orders_code, 6, $message));

                // Notify admins
                $admins = User::where('role', 'Admin')->get();
                Notification::send($admins, new OrderStatusNotification($user->id, $order->orders_code, 6, "Khách hàng {$user->name} đã hoàn thành đơn #{$order->orders_code}", 1));
            } else {
                return $this->error('Thao tác không hợp lệ hoặc trạng thái không cho phép thay đổi.', [], 400);
            }

            return $this->success([
                'order_code' => $order->orders_code
            ], $message, 200);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi cập nhật trạng thái đơn hàng', [$th->getMessage()], 500);
        }
    }

    public function show($id)
    {
        // return response()->json([
        //     'message' => (int) $id,
        // ], 403);

        try {
            $user = auth('api')->user();

            $order = Order::with([
                'orderDetails' => function ($query) {
                    $query->with([
                        'productItem' => function ($q) {
                            $q->with(['product', 'color', 'size']);
                        },
                        'productItem.product.productImages'
                    ]);
                },
                'statusOrder'
            ])->where('user_id', $user->id)
                ->where('orders_code', $id)->first();

            // return response()->json([
            //     'order' => $order,
            // ], 403);

            if (!$order) {
                return response()->json(['message' => 'Không có sản phẩm nào được chọn để tạo đơn hàng.'], 404);
            }

            // Định dạng order_items
            $orderItems = $order->orderDetails->map(function ($detail) {
                // $productItem = $detail->productItem;
                // $product = $productItem->product;
                // $color = $productItem->color;
                // $size = $productItem->size;
                // // Lấy ảnh đầu tiên khớp với color_id của productItem
                // $image = $product->productImages->where('color_id', $productItem->color_id)->first()?->url;
                // $image = $this->buildImageUrl($image) ?? null;

                return [
                    'id' => $detail->id,
                    'idProduct_item' => $detail->product_item_id,
                    'name' => $detail->name_product,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                    'sale_percent' => $detail->sale_percent,
                    'sale_price' => $detail->sale_price,
                    // 'sku' => $detail->sku,
                    'image' => $this->buildImageUrl($detail->image_product) ?? null,
                    'subtotal' => $detail->quantity * $detail->sale_price,
                    'color' => $detail->color ?? null,
                    'size' => $detail->size ?? null,


                ];
            })->values();

            // Định dạng response
            $response = [
                'id' => $order->id,
                'orderItems' => $orderItems,
                'payment_method' => $order->payment_method,
                'receiving_address' => $order->receiving_address,
                'total_price_item' => $order->total_price_item,
                'shipping_price' => $order->shipping_price,
                'discount' => $order->discount,
                'total_amount' => $order->total_amount,
                'status_payment' => $order->status_payment,
                'status_order_id' => $order->status_order_id,
                'status_name' => $order->statusOrder->name,
                "created_at" => $order->created_at,
                "order_code" => $order->orders_code,
                "recipient_name" => $order->recipient_name,
                "recipient_phone" => $order->recipient_phone
            ];

            return response()->json($response);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy chi tiết đơn hàng', [$th->getMessage()], 403);
        }
    }
}
