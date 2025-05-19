<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Product;
use App\Models\VariationOption;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả sản phẩm
        $products = Product::all();

        // Lấy tất cả biến thể (variation_options)
        $colorVariationOptions = VariationOption::where('variation_id', 1)->get();

        foreach ($products as $product) {
            foreach ($colorVariationOptions as $variationOption) {
                // Tạo 5 hình ảnh cho mỗi biến thể Color của sản phẩm
                Image::factory()
                    ->count(1)
                    ->forProductAndVariationOption($product, $variationOption)
                    ->create();
            }
        }
    }
}
