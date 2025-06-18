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

        $salePercent = $this->faker->numberBetween(5, 30);
        $salePrice = (int) ($productItem->price - ($productItem->price * $salePercent / 100));
        $image = $productItem->image ?? $this->faker->imageUrl(300, 300, 'product', true);

        return [
            'order_id' => null,
            'product_item_id' => $productItem->id,
            'quantity' => $this->faker->numberBetween(1, 5),
            'price' => $productItem->price,
            'sale_price' => $salePrice,
            'sale_percent' => $salePercent,
            'image_product' => $image,
            'color' => $colorName,
            'size' => $sizeName,
            'name_product' => $productName,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

}
