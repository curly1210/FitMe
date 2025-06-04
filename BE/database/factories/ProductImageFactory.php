<?php

namespace Database\Factories;

use App\Models\Color;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'url' => fake()->imageUrl(640, 480, 'products'),
        'is_active' => 1,
        'product_id' => Product::inRandomOrder()->value('id') ?? Product::factory(), // chọn ngẫu nhiên hoặc tạo mới
        'color_id' => Color::inRandomOrder()->value('id') ?? Color::factory(),
        'created_at' => now(),
        'updated_at' => now(),
        'deleted_at' => null,
    ];
    }
}
