<?php

namespace App\Http\Controllers\Api\Client;

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
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    use ApiResponse;
    use CreateOrderTrait;
    use CloudinaryTrait;
    public function redem(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'coupon_code' => 'required|string',
            'total_price_item' => 'required|numeric|min:0',
        ]);

        $total = $request->input('total_price_item');
        $code = $request->input('coupon_code');
        $discount = 0;

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json([
                'discount' => 0,
                'coupon' => null,
                'message' => 'Mã giảm giá không tồn tại.',
            ], 400);
        }

        if (!$coupon->is_active) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã bị vô hiệu hóa.',
            ], 400);
        }

        if ($coupon->limit_use <= 0) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã hết lượt sử dụng.',
            ], 400);
        }

        $now = now();
        if ($coupon->time_start && $coupon->time_start > $now) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá chưa được áp dụng.',
            ], 400);
        }

        if ($coupon->time_end && $coupon->time_end < $now) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Mã giảm giá đã hết hạn.',
            ], 400);
        }

        if ($total < $coupon->min_price_order) {
            return response()->json([
                'discount' => 0,
                'coupon' => $coupon->code,
                'message' => 'Giá trị đơn hàng chưa đủ để áp dụng mã giảm giá. Yêu cầu tối thiểu: ' . number_format($coupon->min_price_order) . '₫',
            ], 400);
        }

        $discount = ceil(min(
            $total * ($coupon->value / 100),
            $coupon->max_price_discount
        ));

        return response()->json([
            'discount' => $discount,
            'coupon' => $coupon->code,
            'message' => 'Áp dụng mã giảm giá thành công.',
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
                // $query->where('created_at', '>=', $from . ' 00:00:00');
                $query->whereDate('created_at', '>=', $dateFrom);
            }
            if ($dateTo) {
                // $query->where('created_at', '<', $to . ' 23:59:59');
                $query->whereDate('created_at', '<=', $dateTo);
            }

            // Tìm kiếm tương đối chỉ theo orders_code
            $search = $request->input('search');
            if ($search) {
                $query->where('orders_code', 'like', "%{$search}%");
            }

            // Lấy danh sách và định dạng
            $orders = $query->orderBy('id', 'desc')
                ->get()
                ->map(function ($order) {
                    // Tính tổng quantity từ order_details
                    $totalAmountItems = $order->orderDetails->sum('quantity');

                    return [
                        'id' => $order->id,
                        'orders_code' => $order->orders_code,
                        'created_at' => $order->created_at,
                        'total_amount_items' => $totalAmountItems, // Tổng số lượng sản phẩm
                        'total_amount' => $order->total_amount,
                        'receiving_address' => $order->receiving_address,
                        'status_order_id' => $order->status_order_id,
                        'status_name' => $order->statusOrder->name ?? 'Không xác định', // Lấy name từ status_orders
                    ];
                });

            return response()->json($orders);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy danh sách đơn hàng', [$th->getMessage()], 403);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            $user = auth('api')->user();

            // Kiểm tra quyền sở hữu đơn hàng
            if ($order->user_id !== $user->id) {
                return $this->error('Bạn không có quyền chỉnh sửa đơn hàng này.', [], 403);
            }

            $currentStatus = $order->status_order_id;
            // $newStatus = $request->input('status_order_id');

            // Xử lý logic cập nhật trạng thái
            if ($currentStatus == 1) {
                // Chuyển từ "Chưa xác nhận" (1) sang "Đã hủy" (7)
                $order->update(['status_order_id' => 7]);
                $message = 'Đơn hàng đã được hủy thành công.';
            } elseif ($currentStatus == 4) {
                // Chuyển từ "Đã giao hàng" (4) sang "Hoàn thành" (6)
                $order->update(['status_order_id' => 6]);
                $message = 'Đơn hàng đã được hoàn thành.';
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
                }
            ])->where('user_id', $user->id)
                ->findOrFail($id);

            // Định dạng order_items
            $orderItems = $order->orderDetails->map(function ($detail) {
                $productItem = $detail->productItem;
                $product = $productItem->product;
                $color = $productItem->color;
                $size = $productItem->size;
                // Lấy ảnh đầu tiên khớp với color_id của productItem
                $image = $product->productImages->where('color_id', $productItem->color_id)->first()?->url;
                $image = $this->buildImageUrl($image) ?? null;

                return [
                    'id' => $detail->id,
                    'idProduct_item' => $productItem->id,
                    'name' => $product->name,
                    'quantity' => $detail->quantity,
                    'price' => $detail->price,
                    'sale_percent' => $detail->sale_percent,
                    'sale_price' => $detail->sale_price,
                    'sku' => $productItem->sku,
                    'image' => $image,
                    'subtotal' => $detail->quantity * $detail->sale_price,
                    'color' => $color->name ?? null,
                    'size' => $size->name ?? null,
                ];
            })->values();

            // Định dạng response
            $response = [
                'orderItems' => $orderItems,
                'payment_method' => $order->payment_method,
                'receiving_address' => $order->receiving_address,
                'total_price_item' => $order->total_price_item,
                'shipping_price' => $order->shipping_price,
                'discount' => $order->discount,
                'total_amount' => $order->total_amount,
                'status_payment' => $order->status_payment,
                'status_order_id' => $order->status_order_id,
                "created_at" => $order->created_at,
                "order_code" => $order->orders_code,
                "recipient_name" => $order->recipient_name,
                "recipient_phone" => $order->recipient_phone
            ];

            return response()->json($response);
        } catch (\Throwable $th) {
            return $this->error('Lỗi khi lấy chi tiết đơn hàng', [$th->getMessage()], 403);
        }
    }
}
