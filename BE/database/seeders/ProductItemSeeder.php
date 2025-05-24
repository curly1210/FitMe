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
    { {
            $products = Product::query()->get('id');
            // tạo mỗi product sẽ bao gồm 2 productItem
            foreach ($products as $product) {
                ProductItem::factory()
                    ->count(2)
                    ->forProduct($product->id)
                    ->has(ProductImage::factory()->count('5')->state(function (array $atributes, ProductItem $productItem) {
                        return [
                            'product_item_id' => $productItem->id,
                        ];
                    }))
                    ->create();
            }
        }
    }
}
