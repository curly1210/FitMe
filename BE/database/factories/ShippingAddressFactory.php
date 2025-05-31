<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ShippingAddress;
use Illuminate\Database\Eloquent\Factories\Factory;



class ShippingAddressFactory extends Factory
{

    public function definition(): array
    {
        $data = [
            "Hà Nội" => [
                "Ba Đình" => ["Phúc Xá", "Trúc Bạch", "Vĩnh Phúc"],
                "Hoàn Kiếm" => ["Hàng Trống", "Cửa Nam"]
            ],
            "Hồ Chí Minh" => [
                "Quận 1" => ["Bến Nghé", "Nguyễn Thái Bình"],
                "Bình Thạnh" => ["Phường 1", "Phường 2"]
            ]
        ];
        $phonePrefixes = ['032', '033', '034', '035', '036', '037', '038', '039'];
        $city = $this->faker->randomElement(array_keys($data));
        $district = $this->faker->randomElement(array_keys($data[$city]));
        $ward = $this->faker->randomElement($data[$city][$district]);
        $users = User::query()->get()->pluck('id')->toArray();
        return [
            'name_receive' => fake()->name(),
            'phone' => fake()->randomElement($phonePrefixes) . fake()->numerify('######'),
            'email' => fake()->email(),
            'country' => 'Việt Nam',
            'city' => $city,
            'district' => $district,
            'ward' => $ward,
            'detail_address' => $district . '-' . $ward,
            'is_default' => 0,
            'user_id' => fake()->randomElement($users),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
