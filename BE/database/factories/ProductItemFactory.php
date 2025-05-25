<?php

namespace Database\Factories;


use App\Models\Size;
use App\Models\Color;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductItem>
 */
class ProductItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $sizes = ['S', 'M', 'L', 'XL'];
        // $colors = ['Đỏ', 'Xanh', 'Đen', 'Trắng'];

        $size = Size::inRandomOrder()->first();
        $color = Color::inRandomOrder()->first();

        $price = fake()->numberBetween(200000, 300000);
        $salePrice = fake()->numberBetween(100000, 199999);

        return [
            'price' => $price,
            'sale_price' => $salePrice,
            'stock' => $this->faker->numberBetween(5, 50),
            'sku' => 'SKU-' . strtoupper(Str::random(5)) . '-' . $size->name . '-' . Str::slug($color->name),
            'created_at' => now(),
            'updated_at' => now(),
            'color_id' => $color->id,
            'size_id' => $size->id,

        ];
    }
    public function forProduct($productId)
    {
        return $this->state(fn() => [
            'product_id' => $productId
        ]);
    }
}
