<?php

namespace Database\Factories;

use App\Models\ProductItem;
use App\Models\VariationOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductConfiguration>
 */
class ProductConfigurationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_item_id' => ProductItem::inRandomOrder()->first()->id,
            'variation_option_id' => VariationOption::inRandomOrder()->first()->id,
            'is_active' => 1,
        ];
    }
}
