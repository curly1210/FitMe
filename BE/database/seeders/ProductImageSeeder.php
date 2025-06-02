<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use App\Models\ProductItem;
use Database\Factories\ProductImageFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Duyệt qua từng ProductItem
        ProductItem::all()->each(function ($productItem) {
            // Tạo ngẫu nhiên từ 2 đến 4 ảnh cho mỗi sản phẩm
            $imageCount = rand(2, 4);

            for ($i = 0; $i < $imageCount; $i++) {
                ProductImage::factory()->create([
                    'product_item_id' => $productItem->id
                ]);
            }
        });
    }
}
