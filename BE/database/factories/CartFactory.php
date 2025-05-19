<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
          $user = User::inRandomOrder()->first(); // Lấy ngẫu nhiên một User
        $product = Product::inRandomOrder()->first(); // Lấy ngẫu nhiên một Product

        return [
            'quantity_cart' => rand(1, 5), // Giả sử số lượng cart là ngẫu nhiên từ 1 đến 5
            'user_id' => $user->id, // Gán user_id cho cart
            'product_item_id' => $product->productItems->first()->id, // Gán product_item_id cho cart
        ];
    }
}
