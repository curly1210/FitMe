<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\StatusOrder;
use Illuminate\Support\Str;
use App\Models\ShippingAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userId = User::inRandomOrder()->value('id') ?? User::factory();
        $statusOrderId = StatusOrder::inRandomOrder()->value('id');
        $shippingAddressId = ShippingAddress::where('user_id', $userId)->inRandomOrder()->value('id') ?? ShippingAddress::factory();

        return [
            'orders_code' => 'OD-' . strtoupper(Str::random(8)),
            'total_amount' => 0, // Tạm thời set 0, sẽ cập nhật sau
            'status_payment' => fake()->boolean(),
            'payment_method' => fake()->randomElement(['cod', 'banking', 'vnpay']),
            'status_order_id' => $statusOrderId,
            'user_id' => $userId,
            'shipping_address_id' => $shippingAddressId,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
