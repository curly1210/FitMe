<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {

        return [

            'parent_id' => 0,
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
    public function child($parentId)
    {
        return $this->state(fn(array $attributes) => [
            'parent_id' => $parentId,
        ]);
    }
}
