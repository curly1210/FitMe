<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variation>
 */
class VariationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Tạo 2 variation cố định
        static $names = ['Color', 'Size'];
        static $index = 0;

        // Lấy name theo thứ tự và reset lại khi hết mảng
        $name = $names[$index];
        $index = ($index + 1) % count($names);

        return [
            'name' => $name,
            'is_active' => true,
        ];
    }
}
