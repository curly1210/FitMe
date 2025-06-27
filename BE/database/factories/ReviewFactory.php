<?php

namespace Database\Factories;

use App\Models\OrdersDetail;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rate' => $this->faker->randomElement([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]),
            'content' => $this->faker->sentence,
            // 'updated_content' => $this->faker->sentence(),
            'is_update' => $this->faker->boolean(),
            'user_id' => User::inRandomOrder()->value('id'),
            'product_item_id' => ProductItem::inRandomOrder()->value('id'),
            'order_detail_id' => OrdersDetail::inRandomOrder()->value('id'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
