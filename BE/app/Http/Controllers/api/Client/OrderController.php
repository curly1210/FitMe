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
        $cartItems = CartItem::with('productItem.product')
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {

            $items = 'Giỏ hàng trống.';
        }

        $total = 0;


        foreach ($cartItems as $item) {
            $productItem = $item->productItem;

            if (!$productItem || !$productItem->product) {
                continue;
            }

            $price = $productItem->price;
            $subtotal = $price * $item->quantity;
            $total += $subtotal;

            $items[] = [
                'product_name' => $productItem->product->name,
                'sku' => $productItem->sku,
                'quantity' => $item->quantity,
                'price' => $price,
                'sale_price' => $productItem->sale_price,
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
                ->where('time_start', '<=', now())
                ->where('time_end', '>=', now())
                ->first();

            if ($coupon && $total >= $coupon->min_amount) {
                $discount = min($coupon->value, $coupon->max_amount);
            }
        }

        $finalTotal = ceil($total - ($total * ($discount / 100)));

        $defaultAddress = $user->addresses()->where('is_default', true)->first();
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
            $addressInfo = 'Bạn chưa có địa chỉ giao hàng mặc định.';
        }


        return response()->json([
            'default_address' => $addressInfo,
            'items' => $items,
            'total' => $total,
            'discount' => $discount,
            'final_total' => $finalTotal,
            'coupon' => $coupon ? $coupon->code : null,
        ]);


    }




    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:shipping_address,id',
            'payment_method' => 'required|string',
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
            $total = 0;
            $discount = 0;
            $orderDetails = [];

            foreach ($cartItems as $item) {
                $productItem = $item->productItem;

                if ($productItem->stock < $item->quantity) {
                    throw new \Exception("Sản phẩm {$productItem->sku} không đủ hàng.");
                }

                $price = $productItem->sale_price ?? $productItem->price;
                $subtotal = $price * $item->quantity;
                $total += $subtotal;

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

            // Xử lý mã giảm giá
            if ($request->has('coupon_code')) {
                $coupon = Coupon::where('code', $request->coupon_code)
                    ->where('is_active', true)
                    ->where('time_start', '<=', now())
                    ->where('time_end', '>=', now())
                    ->first();

                if ($coupon && $total >= $coupon->min_amount) {
                    $discount = min($coupon->value, $coupon->max_amount);
                }
            }

            $finalAmount = ceil($total - ($total * ($discount / 100)));

            $address = $user->addresses()->find($request->address_id);
            $fullAddress = implode(', ', array_filter([
                $address->detail_address,
                $address->ward,
                $address->district,
                $address->city,
            ]));

            $datePart = now()->format('ymd');
            $productIds = implode('', collect($orderDetails)->pluck('product_item_id')->toArray());
            $randomPart = strtoupper(Str::random(5));
            $orderCode = $datePart . $productIds . $randomPart;

            $order = Order::create([
                'orders_code' => $orderCode,
                'total_amount' => $finalAmount,
                'status_payment' => 0,
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

            CartItem::where('user_id', $user->id)->delete();


            
                Mail::to('trinhhbaoo0510@gmail.com')->send(new OrderConfirmationMail($order, $orderDetails));
            
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