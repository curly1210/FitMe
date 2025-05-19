<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdersDetailFactory extends Factory
{
    public function definition(): array
    {
        $productItem = ProductItem::inRandomOrder()->first();

        return [
            // Order sẽ được gắn bằng ->has() trong OrderSeeder nên có thể để null hoặc bỏ nếu không cần
            'order_id' => null,
            'product_item_id' => $productItem->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'price' => $productItem->sale_price_variation,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
