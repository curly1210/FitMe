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
            'type' => $this->faker->randomElement(['percentage','fixed']), //thêm trường type
            'value' => $this->faker->numberBetween(1, 5) * 10,
            'time_start' => Carbon::parse($start)->timezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s'),
            'time_end' => Carbon::parse($end)->timezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s'),
            'min_price_order' => $this->faker->numberBetween(0, 5) * 100000,
            'max_price_discount' => $this->faker->numberBetween(1, 5) * 100000,
            'limit_use' => $this->faker->numberBetween(10, 100),
        ];
    }
}
