<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductItem;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    { {
            $products = Product::query()->get('id');

            foreach ($products as $product) {
                ProductItem::factory()
                    ->count(2)
                    ->forProduct($product->id)
                    ->create();
            }
        }
    }
}
