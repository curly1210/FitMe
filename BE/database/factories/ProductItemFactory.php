<?php

namespace Database\Factories;


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
        $sizes = ['S', 'M', 'L', 'XL'];
        $colors = ['Đỏ', 'Xanh', 'Đen', 'Trắng'];

        $size = fake()->randomElement($sizes);
        $color = fake()->randomElement($colors);

        $price = fake()->numberBetween(200000, 300000);
        $salePrice = fake()->numberBetween(100000, 199999);

        return [
            'price_variation' => $price,
            'sale_price_variation' => $salePrice,
            'stock_variation' => $this->faker->numberBetween(5, 50),
            'sku' => 'SKU-' . strtoupper(Str::random(4)) . '-' . $size . '-' . Str::slug($color),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    public function forProduct($productId)
    {
        return $this->state(fn() => [
            'product_id' => $productId
        ]);
    }
}
