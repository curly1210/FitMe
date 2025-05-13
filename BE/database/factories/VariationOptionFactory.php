<?php

namespace Database\Factories;

use App\Models\Variation;
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
        // Lấy ngẫu nhiên một variation từ bảng variations
        $variation = Variation::inRandomOrder()->first();

        // Nếu không có variation, trả về giá trị mặc định
        if (!$variation) {
            return [
                'variation_id' => 1,
                'value' => $this->faker->word,
                'is_active' => 1,
            ];
        }

        // Xác định danh sách giá trị dựa trên tên của variation
        $values = $variation->name === 'Size'
            ? ['S', 'M', 'L', 'XL']
            : ($variation->name === 'Color' ? ['Đỏ', 'Xanh', 'Đen', 'Trắng'] : [$this->faker->word]);

        return [
            'variation_id' => $variation->id,
            'value' => $this->faker->randomElement($values),
            'is_active' => 1,
        ];
    }
}
