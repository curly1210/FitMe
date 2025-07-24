<?php

namespace App\Traits;

use App\Models\Order;
use App\Models\Coupon;
use App\Models\ProductItem;
use Illuminate\Support\Str;
use App\Models\OrdersDetail;
use App\Mail\NotifyAdminOrderMail;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;

trait CreateOrderTrait
{
    use ApiResponse;
    public function createOrder($request, $payment_status = 0)
    {
        // return response()->json(['vnp_TxnRef' => $request->vnp_TxnRef]);
        $user = JWTAuth::parseToken()->authenticate();
        $items = $request->input('cartItems');

        $cartItemIds = [];
        $orderItems = [];

        // Lọc chỉ các cart item có is_choose = 1
        $items = array_filter($items, function ($item) {
            return isset($item['is_choose']) && $item['is_choose'] == true;
        });

        if (empty($items)) {
            return response()->json(['message' => 'Không có sản phẩm nào được chọn để tạo đơn hàng.'], 400);
        }

        foreach ($items as $item) {
            $productItem = ProductItem::with('product', 'color', 'size')->find($item['idProduct_item']);

            if (!$productItem || !$productItem->product) {
                return response()->json(['message' => "Không tìm thấy sản phẩm với ID {$item['idProduct_item']}."], 400);
            }

            if ($productItem->stock < $item['quantity']) {
                return response()->json(['message' => "Sản phẩm {$productItem->sku} không đủ hàng."], 400);
            }


            $cartItemIds[] = $item['idItem'];

            $orderItems[] = [
                'product_item_id' => $productItem->id,
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'sale_price' => $item['sale_price'],
                'sale_percent' => $item['sale_percent'],
                'image_product' => $item['image_product'],
                'subtotal' => $item['sale_price'] * $item['quantity'], // Tổng phụ theo giá sale
                'name_product' => $productItem->product->name,
                'color' => optional($productItem->color)->name,
                'size' => optional($productItem->size)->name,
            ];
        }


        // Xử lý mã giảm giá (nếu có)
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

            if ($request->total_price_cart < $coupon->min_price_order) {
                return response()->json([
                    'message' => "Đơn hàng phải có giá trị tối thiểu {$coupon->min_price_order} để áp dụng mã giảm giá."
                ], 400);
            }
        }


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
        do {
            $uniqueCode = 'OD' . now()->format('ymd') . strtoupper(Str::random(6));
        } while (Order::where('orders_code', $uniqueCode)->exists());


        // return response()->json(['bank_code' => $request->bank_code, 'transaction_at' => $request->transaction_at]);


        DB::beginTransaction();
        try {
            if ($request->payment_method == "cod" && $request->total_amount > 10000000) {
                return $this->error("Đơn hàng vượt quá 10 triệu vui lòng thanh toán online hoặc chia nhỏ đơn hàng", ["payment_method" => 'cod ko hỗ trợ thanh toán đơn hàng trên 10tr', 'total_amount' => "Đơn hàng vượt quá 10 triệu"], 422);
            }
            $order = Order::create([
                'orders_code' => $request->orders_code ?? $uniqueCode,
                'total_price_item' => $request->total_price_cart,
                'shipping_price' => $request->shipping_price,
                'discount' => $request->discount ?? 0,
                'total_amount' => $request->total_amount,
                'status_payment' => $payment_status,
                'payment_method' => $request->payment_method,
                'status_order_id' => 1,
                'user_id' => $user->id,
                'receiving_address' => $fullAddress,
                'recipient_name' => $address->name_receive,
                'recipient_phone' => $address->phone,
                'transaction_at' => $request->transaction_at ?? null,
                "bank_code" => $request->bank_code ?? null,

            ]);






            foreach ($orderItems as $item) {
                OrdersDetail::create(array_merge(['order_id' => $order->id], $item));
                ProductItem::where('id', $item['product_item_id'])->decrement('stock', $item['quantity']);
            }

            if ($coupon) {
                $coupon->decrement('limit_use');
            }

            $user->cart_items()->whereIn('id', $cartItemIds)->delete();

            Mail::to($user->email)->send(new OrderConfirmationMail($order, $orderItems));
            Mail::to(config('mail.admin_email'))->send(new NotifyAdminOrderMail($order, $orderItems));


            DB::commit();

            // return response()->json(['vnp_TxnRef' => $request->vnp_TxnRef, 'orders_code' => $request->orders_code, "db_ordercode" => $order->orders_code, 'bank_code' => $request->bank_code, 'transaction_at' => $request->transaction_at]);


            // return response()->json(['order' => $order]);


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
