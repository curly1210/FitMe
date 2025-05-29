<?php

namespace Database\Factories;

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

        $data = [
            [
                'title' => 'Khuyến mãi hè rực rỡ',
                'direct_link' => 'https://example.com/summer-sale',
                'url_image' => 'uploads/banners/banner1.jpg',

            ],
            [
                'title' => 'Siêu sale cuối tuần',
                'direct_link' => 'https://example.com/weekend-deal',
                'url_image' => 'uploads/banners/banner2.jpg',

            ],
            [
                'title' => 'Mở bán bộ sưu tập mới',
                'direct_link' => 'https://example.com/new-collection',
                'url_image' => 'uploads/banners/banner3.jpg',

            ],
        ];

        $banner = $this->faker->randomElement($data);

        return [
            'title' => $banner['title'],
            'direct_link' => $banner['direct_link'],
            'url_image' => $banner['url_image'],

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
