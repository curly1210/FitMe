<?php

namespace Database\Factories;

use GuzzleHttp\Promise\Create;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReviewReply>
 */
class ReviewReplyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            "content" => $this->faker->text(200),
            "created_at" => now(),
            "updated_at" => now(),
        ];
    }
}
