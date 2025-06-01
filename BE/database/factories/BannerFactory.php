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
        $data = [
            [

                'direct_link' => '/danh-muc/' . $slugCategory,
                // 'direct_type' => 'danh-muc',
                'url_image' => 'uploads/banners/banner2.jpg',

            ],
            [

                'direct_link' => '/san-pham/' . $slugProduct,
                // 'direct_type' => 'san-pham',
                'url_image' => 'uploads/banners/banner3.jpg',

            ],
            [

                'direct_link' => '/tin-tuc/' . $slugPost,
                // 'direct_type' => 'tin-tuc',
                'url_image' => 'uploads/banners/banner4.jpg',



            ],
            [
                'direct_link' => '/danh-muc/' . $slugParentCategory,
                // 'direct_type' => 'danh-muc',
                'url_image' => 'uploads/banners/banner5.jpg',
            ],
        ];

        $banner = $this->faker->unique()->randomElement($data);
        $titles = [
            'Khuyến mãi lớn',
            'Sản phẩm mới',
            'Tin tức mới nhất',
            'Khám phá danh mục',
            'Ưu đãi đặc biệt',
        ];
        return [
            'title' => fake()->unique()->randomElement($titles),
            'direct_link' => $banner['direct_link'],
            // 'direct_type' => $banner['direct_type'],
            'url_image' => $banner['url_image'],

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
