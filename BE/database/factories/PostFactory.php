<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(1);
        return [
            'title' => $title, // Câu ngẫu nhiên, tối đa 50 ký tự
            'slug' => Str::slug($title), // Tạo slug từ tiêu đề
            'content' => $this->faker->paragraphs(3, true), // 3 đoạn văn
            'thumbnail' => $this->faker->imageUrl(640, 480, 'news'), // URL hình ảnh ngẫu nhiên
            'is_active' => $this->faker->boolean(90), // 90% là active
            // 'img' => $this->faker->imageUrl(640, 480, 'news'), // URL hình ảnh ngẫu nhiên
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
