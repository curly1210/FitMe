<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CouponFactory extends Factory
{
    public function definition(): array
    {
        $start = Carbon::now()->addDays(rand(0, 5));
        $end = (clone $start)->addDays(rand(7, 30));

        return [
            'name' => 'Giảm giá ' . $this->faker->word(),
            'code' => strtoupper(Str::random(8)),
            'value' => $this->faker->numberBetween(5, 50),
            'time_start' => $start,
            'time_end' => $end,
            'min_price_order' => $this->faker->numberBetween(100000, 500000),
            'max_price_discount' => $this->faker->numberBetween(600000, 1000000),
            'limit_use' => $this->faker->numberBetween(10, 100),
        ];
    }
}
