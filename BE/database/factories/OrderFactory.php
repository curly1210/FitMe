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
         $shippingAddress = ShippingAddress::inRandomOrder()->first();

        // Nếu không có địa chỉ thì không thể tạo order hợp lệ => bạn có thể xử lý tùy tình huống
        if (!$shippingAddress) {
            throw new \Exception('Không có địa chỉ giao hàng nào để tạo đơn hàng.');
        }

        return [
            'orders_code' => 'OD-' . strtoupper(Str::random(8)),
            'total_amount' => 0,
            'status_payment' => $this->faker->boolean(),
            'payment_method' => $this->faker->randomElement(['cod', 'banking', 'vnpay']),
            'status_order_id' => StatusOrder::inRandomOrder()->value('id'),
            'user_id' => $shippingAddress->user_id,
            'receiving_address' => "{$shippingAddress->detail_address}, {$shippingAddress->ward}, {$shippingAddress->district}, {$shippingAddress->city}, {$shippingAddress->country}",
            'recipient_name' => $shippingAddress->name_receive,
            'recipient_phone' => $shippingAddress->phone,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
