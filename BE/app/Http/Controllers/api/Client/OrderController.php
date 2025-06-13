<?php
namespace App\Http\Controllers\Api\Client;



use Carbon\Carbon;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\CartItem;
use App\Models\ProductItem;
use Illuminate\Support\Str;
use App\Models\OrdersDetail;
use Illuminate\Http\Request;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Mail\OrderConfirmationMail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{

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

        // Tìm mã giảm giá
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
            'total_price_cart' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $user = JWTAuth::parseToken()->authenticate();
        $items = $request->input('cartItems');
        $productItemIds = [];
        $orderItems = [];
        $totalPriceItem = 0;

        foreach ($items as $item) {
            $productItem = ProductItem::with('product', 'color', 'size')->find($item['idProduct_item']);

            if (!$productItem || !$productItem->product) {
                return response()->json(['message' => "Không tìm thấy sản phẩm với ID {$item['idProduct_item']}."], 400);
            }

            if ($productItem->stock < $item['quantity']) {
                return response()->json(['message' => "Sản phẩm {$productItem->sku} không đủ hàng."], 400);
            }

            $price = $productItem->sale_percent > 0
                ? $productItem->price * (1 - ($productItem->sale_percent / 100))
                : $productItem->price;

            $subtotal = $price * $item['quantity'];
            $totalPriceItem += $subtotal;
            $productItemIds[] = $productItem->id;

            $orderItems[] = [
                'product_item_id' => $productItem->id,
                'quantity' => $item['quantity'],
                'price' => $price,
                'subtotal' => $subtotal,
                'name_product' => $productItem->product->name,
                'color' => optional($productItem->color)->name,
                'size' => optional($productItem->size)->name,
            ];
        }

        $coupon = null;
        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', $request->coupon_code)
                ->where('is_active', true)
                ->where('limit_use', '>', 0)
                ->where('time_start', '<=', now())
                ->where('time_end', '>=', now())
                ->first();

            if (!$coupon) {
                return response()->json(['message' => 'Mã giảm giá không hợp lệ hoặc đã hết hạn.'], 400);
            }

            if ($totalPriceItem < $coupon->min_price_order) {
                return response()->json([
                    'message' => "Đơn hàng phải có giá trị tối thiểu {$coupon->min_price_order} để áp dụng mã giảm giá."
                ], 400);
            }
        }

        $shippingPrice = (int) $request->shipping_price;
        $discount = (int) $request->discount ?? 0;
        $totalAmount = ceil($totalPriceItem - $discount + $shippingPrice);

        // if ($totalAmount != $request->total_amount) {
        //     return response()->json(['message' => 'Tổng thanh toán không hợp lệ.'], 400);
        // }

        $address = $user->addresses()->find($request->shipping_address_id);
        if (!$address) {
            return response()->json(['message' => 'Địa chỉ giao hàng không hợp lệ.'], 400);
        }

        $fullAddress = implode(', ', array_filter([
            $address->detail_address,
            $address->ward,
            $address->district,
            $address->city,
        ]));

        DB::beginTransaction();
        try {
            $order = Order::create([
                'orders_code' => now()->format('ymd') . implode('', $productItemIds) . strtoupper(Str::random(5)),
                'total_price_item' => $totalPriceItem,
                'shipping_price' => $shippingPrice,
                'discount' => $discount,
                'total_amount' => $totalAmount,
                'status_payment' => 1,
                'payment_method' => $request->payment_method,
                'status_order_id' => 1,
                'user_id' => $user->id,
                'receiving_address' => $fullAddress,
                'recipient_name' => $address->name_receive,
                'recipient_phone' => $address->phone,
            ]);

            foreach ($orderItems as $item) {
                OrdersDetail::create(array_merge(['order_id' => $order->id], $item));
                ProductItem::where('id', $item['product_item_id'])->decrement('stock', $item['quantity']);
            }

            if ($coupon) {
                $coupon->decrement('limit_use');
            }

            Mail::to($user->email)->send(new OrderConfirmationMail($order, $orderItems));

            DB::commit();

            return response()->json([
                'message' => 'Tạo đơn hàng thành công.',
                'order_code' => $order->orders_code,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }





}