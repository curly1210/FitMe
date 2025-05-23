<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Size>
 */
class SizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['S', 'M', 'L', 'XL', 'XXL']), // Tạo kích cỡ ngẫu nhiên
            'is_active' => 1, // 90% khả năng là true
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
