<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\VariationOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'url' => $this->faker->imageUrl(640, 480, 'products'), // URL giả lập cho hình ảnh
            'product_id' => Product::inRandomOrder()->first()->id, // Chọn ngẫu nhiên product
            'variation_option_id' => VariationOption::where('variation_id', 1)->inRandomOrder()->first()->id, // Chỉ lấy Color
            'is_active' => 1, // Mặc định là hình ảnh đang hoạt động
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null, // Mặc định không bị xóa mềm
        ];
    }

    // tùy chỉnh product và variation_option
    public function forProductAndVariationOption($product, $variationOption)
    {
        return $this->state(function (array $attributes) use ($product, $variationOption) {
            return [
                'product_id' => $product->id,
                'variation_option_id' => $variationOption->id,
            ];
        });
    }
}
