<?php

namespace Database\Factories;

use App\Models\PackingRule;
use Illuminate\Database\Eloquent\Factories\Factory;


class PackingRuleFactory extends Factory
{
    protected $model = PackingRule::class;

    protected static $data = [
        [
            'box_code' => 'BOX_SMALL',
            'min_quantity' => 1,
            'max_quantity' => 3,
            'max_weight' => 3000,
            'box_weight' => 300,
            'box_length' => 30,
            'box_width' => 20,
            'box_height' => 10,
        ],
        [
            'box_code' => 'BOX_MEDIUM',
            'min_quantity' => 4,
            'max_quantity' => 6,
            'max_weight' => 6000,
            'box_weight' => 500,
            'box_length' => 45,
            'box_width' => 30,
            'box_height' => 15,
        ],
        [
            'box_code' => 'BOX_LARGE',
            'min_quantity' => 7,
            'max_quantity' => 10,
            'max_weight' => 8000,
            'box_weight' => 700,
            'box_length' => 50,
            'box_width' => 35,
            'box_height' => 20,
        ],
        [
            'box_code' => 'BOX_XL',
            'min_quantity' => 11,
            'max_quantity' => 15,
            'max_weight' => 15000,
            'box_weight' => 900,
            'box_length' => 60,
            'box_width' => 40,
            'box_height' => 30,
        ],
        [
            'box_code' => 'BOX_XXL',
            'min_quantity' => 16,
            'max_quantity' => 20,
            'max_weight' => 19000,
            'box_weight' => 1100,
            'box_length' => 65,
            'box_width' => 45,
            'box_height' => 35,
        ],
    ];

    public function definition(): array
    {
        static $index = 0;

        return self::$data[$index++];
    }
}
