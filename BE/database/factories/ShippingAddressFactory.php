<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ShippingAddress;
use Illuminate\Database\Eloquent\Factories\Factory;



class ShippingAddressFactory extends Factory
{

    public function definition(): array
    {

        $phonePrefixes = ['032', '033', '034', '035', '036', '037', '038', '039'];
        $users = User::query()->get()->pluck('id')->toArray();
        return [
            'name_receive' => fake()->name(),
            'phone' => fake()->randomElement($phonePrefixes) . fake()->numerify('######'),
            'country' => 'Việt Nam',
            'province' => "Hà Nội",
            'province_id' => 201,
            'district' => "Nam Từ Liêm",
            'district_id' => 3440,
            'ward' => "Phường Xuân Phương",
            'ward_code' => "13010",
            'detail_address' => "6a Hòe Thị",
            'is_default' => 0,
            'user_id' => fake()->randomElement($users),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
