<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\ProductItem;
use App\Models\StatusOrder;
use Illuminate\Support\Str;
use App\Models\OrdersDetail;
use App\Models\ShippingAddress;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          // Lấy tất cả các đơn hàng có sẵn
        Order::factory(5)->create();
    }
}
