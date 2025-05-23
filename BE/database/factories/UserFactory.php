<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // prefixes số đầu sốsố
        $phonePrefixes = ['032', '033', '034', '035', '036', '037', '038', '039'];
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->email(),
            'password' => Hash::make('password'),
            'avatar' => fake()->imageUrl(640, 480, 'people', true),
            'birthday' => fake()->date(),
            'phone' => fake()->randomElement($phonePrefixes) . fake()->numerify('######'),
            'gender' => fake()->randomElement(['Nam', 'Nữ']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
