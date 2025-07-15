<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrdersDetail;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run()
    {
        Order::factory()
            ->count(6)
            ->has(
                // Tạo 1-3 OrderDetail cho mỗi Order
                OrdersDetail::factory()
                    ->count(rand(1, 3))
                    ->state(function (array $attributes, Order $order) {
                        return [
                            'order_id' => $order->id,
                        ];
                    }),
                'orderDetails'
            )
            ->create();
    }
}
