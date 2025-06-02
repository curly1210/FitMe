<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $slugCategory = Category::inRandomOrder()->whereNotNull('parent_id')->value('slug');
        $slugProduct = Product::inRandomOrder()->value('slug');
        $slugPost = Post::inRandomOrder()->value('slug');
        $slugParentCategory = Category::query()->whereNull('parent_id')->inRandomOrder()->value('slug');


        $titles = [
            'Khuyến mãi lớn',
            'Sản phẩm mới',
            'Tin tức mới nhất',
            'Khám phá danh mục',
            'Ưu đãi đặc biệt',
        ];
        $directLinks = [
            '/danh-muc/' . $slugCategory,
            '/san-pham/' . $slugProduct,
            '/tin-tuc/' . $slugPost,
            '/danh-muc/' . $slugParentCategory,
        ];
        return [
            'title' => fake()->unique()->randomElement($titles),
            'direct_link' => fake()->unique()->randomElement($directLinks),
            // 'direct_type' => $banner['direct_type'],
            'url_image' => fake()->imageUrl(), # https://via.placeholder.com/640x480.png?text=Banner+Image

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
