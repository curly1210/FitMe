<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\StatusOrder;
use App\Models\ShippingAddress;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        // Chọn 1 user ngẫu nhiên
        $user = User::inRandomOrder()->first();

        // Kiểm tra xem user đã có địa chỉ giao hàng chưa
        $shippingAddress = ShippingAddress::where('user_id', $user->id)->inRandomOrder()->first();

        // Nếu chưa có, tạo mới
        if (!$shippingAddress) {
            $shippingAddress = ShippingAddress::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        return [
            'orders_code' => 'OD-' . strtoupper(Str::random(8)),
            'total_amount' => 0,
            'status_payment' => fake()->boolean(),
            'payment_method' => fake()->randomElement(['cod', 'banking', 'vnpay']),
            'status_order_id' => StatusOrder::inRandomOrder()->value('id'),
            'user_id' => $user->id,
            'shipping_address_id' => $shippingAddress->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
