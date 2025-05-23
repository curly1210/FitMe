<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use InvalidArgumentException;

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
        static $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        static $index = 0;

        $name = $sizes[$index++];

        return [
            'name' => $name, // Tạo kích cỡ lần lượt
            'is_active' => $this->faker->boolean(90), // 90% khả năng là true
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
