<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\Wishlist;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class WishlistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Wishlist::class;

    public function definition(): array
    {

        return [
            'user_id' => $user= User::inRandomOrder()->first()->id,
        ];
    }
}