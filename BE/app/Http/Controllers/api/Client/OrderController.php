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
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;

class OrderController extends Controller
{

    public function preview(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $items = [];
        $cartItems = CartItem::with('productItem.product', 'productItem.color', 'productItem.size')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['items' => 'Giỏ hàng trống.']);
        }

        $total = 0;

        foreach ($cartItems as $item) {
            $productItem = $item->productItem;
            if (!$productItem || !$productItem->product) {
                continue;
            }

            $price = $productItem->sale_percent > 0
                ? $productItem->price * (1 - ($productItem->sale_percent / 100))
                : $productItem->price;

            $subtotal = $price * $item->quantity;
            $total += $subtotal;

            $items[] = [
                'product_name' => $productItem->product->name,
                'sku' => $productItem->sku,
                'quantity' => $item->quantity,
                'price' => $productItem->price,
                'sale_price' => $price,
                'sale_percent' => $productItem->sale_percent,
                'total' => $subtotal,
                'color' => optional($productItem->color)->name,
                'size' => optional($productItem->size)->name,
            ];
        }

        $discount = 0;
        $coupon = null;

        if ($request->has('coupon_code')) {
            $code = $request->input('coupon_code');

            $coupon = Coupon::where('code', $code)
                ->where('is_active', true)
                ->where('limit_use', '>', 0)
                ->where('time_start', '<=', now())
                ->where('time_end', '>=', now())
                ->first();

            if ($coupon && $total >= $coupon->min_price_order) {
                $discount = ceil(min(
                    ($total * ($coupon->value / 100)),
                    $coupon->max_price_discount
                ));
            }
        }

        $shippingPrice = $request->has('shipping_price') ? (int) $request->input('shipping_price') : 0;
        $finalTotal = ceil($total - $discount + $shippingPrice);

        $defaultAddress = $user->addresses()->where('is_default', true)->first();
        if (!$defaultAddress) {
            $defaultAddress = $user->addresses()->first();
        }

        $addressInfo = null;

        if ($defaultAddress) {
            $fullAddress = implode(', ', array_filter([
                $defaultAddress->detail_address,
                $defaultAddress->ward,
                $defaultAddress->district,
                $defaultAddress->city,
            ]));

            $addressInfo = [
                'name' => $defaultAddress->name_receive,
                'phone' => $defaultAddress->phone,
                'full_address' => $fullAddress,
                'email' => $defaultAddress->email,
            ];
        } else {
            $addressInfo = 'Bạn chưa có địa chỉ giao hàng.';
        }

        return response()->json([
            // 'default_address' => $addressInfo,
            'items' => $items,
            'total_price' => $total,
            'discount' => $discount,
            'shipping_price' => $shippingPrice,
            'total_amount' => $finalTotal,
            'coupon' => $coupon ? $coupon->code : null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|string',
            'shipping_price' => 'required|in:20000,40000',
            'coupon_code' => 'nullable|string',
        ]);

        $user = JWTAuth::parseToken()->authenticate();
        $cartItems = CartItem::with('productItem.product', 'productItem.color', 'productItem.size')
            ->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng trống.'], 400);
        }

        DB::beginTransaction();

        try {
            $totalPriceItem = 0;
            $discount = 0;
            $orderDetails = [];
            $productItemIds = [];

            foreach ($cartItems as $item) {
                $productItem = $item->productItem;

                if ($productItem->stock < $item->quantity) {
                    throw new \Exception("Sản phẩm {$productItem->sku} không đủ hàng.");
                }

                $price = $productItem->sale_percent > 0
                    ? $productItem->price * (1 - ($productItem->sale_percent / 100))
                    : $productItem->price;

                $subtotal = $price * $item->quantity;
                $totalPriceItem += $subtotal;
                $productItemIds[] = $productItem->id;

                $orderDetails[] = [
                    'product_item_id' => $productItem->id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                    'name_product' => $productItem->product->name,
                    'color' => optional($productItem->color)->name,
                    'size' => optional($productItem->size)->name,
                ];

                $productItem->decrement('stock', $item->quantity);
            }

            $coupon = null;
            if ($request->has('coupon_code')) {
                $coupon = Coupon::where('code', $request->coupon_code)
                    ->where('is_active', true)
                    ->where('limit_use', '>', 0)
                    ->where('time_start', '<=', now())
                    ->where('time_end', '>=', now())
                    ->first();

                if ($coupon && $totalPriceItem >= $coupon->min_price_order) {
                    $discount = ceil(min(
                        ($totalPriceItem * ($coupon->value / 100)),
                        $coupon->max_price_discount
                    ));
                }
            }

            $shippingPrice = (int) $request->shipping_price;
            $totalAmount = ceil($totalPriceItem - $discount + $shippingPrice);

            if ($request->filled('address_id')) {
                $address = $user->addresses()->find($request->address_id);

                if (!$address) {
                    return response()->json(['message' => 'Địa chỉ không hợp lệ.'], 400);
                }
            } else {
                $address = $user->addresses()->where('is_default', true)->first();

                if (!$address) {
                    $address = $user->addresses()->first();
                }

                if (!$address) {
                    return response()->json(['message' => 'Bạn không có địa chỉ nào, vui lòng tạo địa chỉ giao hàng.'], 400);
                }
            }

            $fullAddress = implode(', ', array_filter([
                $address->detail_address,
                $address->ward,
                $address->district,
                $address->city,
            ]));

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

            foreach ($orderDetails as $detail) {
                OrdersDetail::create(array_merge(['order_id' => $order->id], $detail));
            }

            if ($coupon) {
                $coupon->decrement('limit_use');
            }

            CartItem::where('user_id', $user->id)->delete();

            Mail::to($user->email)->send(new OrderConfirmationMail($order, $orderDetails));

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