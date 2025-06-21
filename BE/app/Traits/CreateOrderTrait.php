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
    public function createOrder($request, $payment_status = 0)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $items = $request->input('cartItems');
        $productItemIds = [];
        $cartItemIds = [];
        $orderItems = [];

        foreach ($items as $item) {
            $productItem = ProductItem::with('product', 'color', 'size')->find($item['idProduct_item']);

            if (!$productItem || !$productItem->product) {
                return response()->json(['message' => "Không tìm thấy sản phẩm với ID {$item['idProduct_item']}."], 400);
            }

            if ($productItem->stock < $item['quantity']) {
                return response()->json(['message' => "Sản phẩm {$productItem->sku} không đủ hàng."], 400);
            }

            $productItemIds[] = $productItem->id;
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

        DB::beginTransaction();
        try {
            $order = Order::create([
                'orders_code' => now()->format('ymd') . implode('', $productItemIds) . strtoupper(Str::random(5)),
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
