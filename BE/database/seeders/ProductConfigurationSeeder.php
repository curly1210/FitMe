<?php

namespace Database\Seeders;

use App\Models\ProductConfiguration;
use App\Models\ProductItem;
use App\Models\VariationOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả sản phẩm
        $product_items = ProductItem::all();

        // Lấy tất cả biến thể
        $variationOptions = VariationOption::all();

        foreach ($product_items as $product_item) {
            // Số lượng biến thể ngẫu nhiên cho mỗi sản phẩm (từ 1 đến 4)
            $numberOfVariations = rand(1, min(4, $variationOptions->count()));

            // Lấy ngẫu nhiên một tập hợp các variation_option_id
            $selectedVariationOptionIds = $variationOptions->random($numberOfVariations)->pluck('id')->unique()->all();

            // Tạo bản ghi cho mỗi biến thể được chọn
            foreach ($selectedVariationOptionIds as $variationOptionId) {
                ProductConfiguration::create([
                    'product_item_id' => $product_item->id,
                    'variation_option_id' => $variationOptionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
