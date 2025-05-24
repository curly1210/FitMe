<?php

namespace Database\Factories;

use App\Models\Size;
use App\Models\Color;
use App\Models\Order;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdersDetailFactory extends Factory
{
    public function definition(): array
    {
        $productItem = ProductItem::inRandomOrder()->first();

        $colorName = Color::where('id', $productItem->color_id)->value('name');
        $sizeName = Size::where('id', $productItem->size_id)->value('name');
        $productName = $productItem->product->name;


        return [
            'order_id' => null,
            'product_item_id' => $productItem->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'price' => $productItem->sale_price,
            'color' => $colorName,
            'size' => $sizeName,
            'name_product' => $productName,
            'created_at' => now(),
            'updated_at' => now(),
        ];

    }
}
