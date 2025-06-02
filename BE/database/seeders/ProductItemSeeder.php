<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductItem;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Database\Factories\ProductImageFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();

        foreach ($products as $product) {
            // Tạo 3 biến thể mỗi sản phẩm (bạn có thể chỉnh số này)
            ProductItem::factory()->count(3)->forProduct($product->id)->create();
        }
    }
}
