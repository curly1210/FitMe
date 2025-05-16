<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Product;
use App\Models\Wishlist;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //lay 10 nguoi dau tien
        $users = User::limit(10)->get();
        $products = Product::pluck('id');

        foreach( $users as $user) 
        {
            $favoriteProducts = $products->random(rand(1,2));

            foreach ($favoriteProducts as $productId)
            {
                Wishlist::factory()->create([
                    'user_id' => $user->id,
                    'product_id'=> $productId,
                ]);
            }
        }
    }
}

