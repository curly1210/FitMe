<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\ProductItem;
use App\Models\OrdersDetail;
use Illuminate\Database\Seeder;

class OrdersDetailSeeder extends Seeder
{
    public function run()
    {
        // Tạo 3 đơn hàng mẫu (nếu bạn chưa có sẵn đơn hàng, tạo ở đây)
        $orders = Order::factory()->count(3)->create();

        // Lấy danh sách sản phẩm hiện có
        $productItems = ProductItem::all();


        foreach ($orders as $order) {
            $totalAmount = 0;
            $orderDetails = [];

            
            // Ngẫu nhiên từ 1 đến 3 sản phẩm
            $productItemsToAdd = $productItems->random(rand(1, 3));

            foreach ($productItemsToAdd as $productItem) {
                $quantity = rand(1, 5);
                $price = $productItem->sale_price_variation;
                $totalAmount += $quantity * $price;

                $orderDetails[] = [
                    'order_id' => $order->id,
                    'product_item_id' => $productItem->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Lưu chi tiết đơn hàng
            OrdersDetail::insert($orderDetails);

            // Cập nhật tổng số tiền đơn hàng
            $order->update([
                'total_amount' => $totalAmount,
            ]);
        }
    }
}
