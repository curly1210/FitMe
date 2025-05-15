<?php

namespace Database\Factories;

use App\Models\ProductItem;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdersDetailFactory extends Factory
{
    public function definition(): array
    {
        // Lấy dữ liệu có sẵn từ bảng orders và product_items
         $orderId = Order::inRandomOrder()->value('id');
        $productItemId = ProductItem::inRandomOrder()->value('id');
        $quantity = rand(1, 5); // Số lượng ngẫu nhiên

        return [
            'order_id' => $orderId,
            'product_item_id' => $productItemId,
            'quantity' => $quantity,
            'price' => ProductItem::find($productItemId)->sale_price_variation, // Giá của sản phẩm
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

