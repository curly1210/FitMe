<?php

namespace Database\Factories;

use App\Models\Variation;
use App\Models\VariationOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VariationOption>
 */
class VariationOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Lấy một variation ngẫu nhiên (hoặc sẽ được ghi đè trong seeder)
        $variation = Variation::inRandomOrder()->first();

        return [
            'variation_id' => $variation ? $variation->id : Variation::factory(),
            'value' => $this->faker->word(),
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    // Tạo tất cả giá trị cho một variation
    public function withAllValues($variation)
    {
        return $this->afterCreating(function (VariationOption $option) use ($variation) {
            // Xác định danh sách giá trị dựa trên tên của variation
            $values = $variation->name === 'Size'
                ? ['S', 'M', 'L', 'XL']
                : ($variation->name === 'Color' ? ['Đỏ', 'Xanh', 'Đen', 'Trắng'] : []);

            // Tạo các bản ghi còn lại với tất cả giá trị
            foreach ($values as $value) {
                if ($value !== $option->value) { // Tránh trùng với bản ghi đã tạo
                    VariationOption::create([
                        'variation_id' => $variation->id,
                        'value' => $value,
                        'is_active' => 1,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        })->state(function (array $attributes) use ($variation) {
            // Tạo bản ghi đầu tiên với giá trị đầu tiên trong danh sách
            $values = $variation->name === 'Size'
                ? ['S', 'M', 'L', 'XL']
                : ($variation->name === 'Color' ? ['Đỏ', 'Xanh', 'Đen', 'Trắng'] : []);

            return [
                'variation_id' => $variation->id,
                'value' => $values[0], // Lấy giá trị đầu tiên (S hoặc Đỏ)
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });
    }
}
