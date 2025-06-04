<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductItem;
use Database\Factories\ProductImageFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('product_images')->truncate(); // Xoá sạch cũ (nếu muốn)

        $products = Product::with('productItems')->get();

        foreach ($products as $product) {
            // Lấy danh sách các color_id của sản phẩm này từ product_items
            $colorIds = $product->productItems->pluck('color_id')->unique();

            foreach ($colorIds as $colorId) {
                // Gán 3 ảnh cho mỗi color
                for ($i = 1; $i <= 3; $i++) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'color_id' => $colorId,
                        'url' => fake()->imageUrl(600, 600, 'products', true, "Product {$product->id} Color {$colorId} Image {$i}"),
                        'is_active' => 1,
                    ]);
                }
            }
        }
    }
}
