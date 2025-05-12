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
        // Lấy tất cả các đơn hàng có sẵn
        $orders = Order::all();
        $productItems = ProductItem::all(); // Lấy tất cả sản phẩm có sẵn

        foreach ($orders as $order) {
            $totalAmount = 0; // Khởi tạo tổng số tiền cho đơn hàng
            $orderDetails = [];

            // Lấy ngẫu nhiên các sản phẩm từ bảng ProductItem và gán vào đơn hàng
            $productItemsToAdd = $productItems->random(rand(1, 3)); // Lấy từ 1 đến 3 sản phẩm ngẫu nhiên

            foreach ($productItemsToAdd as $productItem) {
                $quantity = rand(1, 5); // Số lượng ngẫu nhiên

                // Tính tiền của từng sản phẩm và cộng vào tổng tiền của đơn hàng
                $totalAmount += $productItem->sale_price_variation * $quantity;

                // Thêm bản ghi OrderDetail
                $orderDetails[] = [
                    'order_id' => $order->id,
                    'product_item_id' => $productItem->id,
                    'quantity' => $quantity,
                    'price' => $productItem->sale_price_variation,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Tạo tất cả OrderDetail trước
            OrdersDetail::insert($orderDetails);

            // Cập nhật tổng số tiền của đơn hàng
            $order->update([
                'total_amount' => $totalAmount,
            ]);
        }
    }
}

