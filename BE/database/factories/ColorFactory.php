<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Color>
 */
class ColorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->colorName(), // Tạo tên màu ngẫu nhiên
            'code' => $this->faker->hexColor(), // Tạo mã màu hex (ví dụ: #RRGGBB)
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
