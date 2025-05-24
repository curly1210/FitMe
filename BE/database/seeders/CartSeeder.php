<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\CartItem;
use App\Models\ProductItem;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
         $users = User::inRandomOrder()->limit(10)->get();

        // Lấy ngẫu nhiên 10 product_item đã có
        $productItems = ProductItem::inRandomOrder()->limit(10)->get();

        foreach ($users as $user) {
            foreach ($productItems->random(rand(1, 3)) as $productItem) {
                CartItem::factory()->create();
            }
        }
    }
}
