<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Database\Seeders\CategorySeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    public function run()
    {
        foreach (CategorySeeder::$categoryIds as $categoryName => $categoryId) {
            // Gán tên sản phẩm phù hợp theo danh mục
            $productNames = match ($categoryName) {
                // Nam
                'Áo khoác nam' => ['Áo khoác gió nam', 'Áo bomber nam'],
                'Áo nam' => ['Áo sơ mi nam', 'Áo thun nam'],
                'Quần nam' => ['Quần jeans nam', 'Quần kaki nam'],
                'Bộ quần áo nam' => ['Bộ vest nam', 'Bộ thể thao nam'],
                'Đồ thể thao nam' => ['Áo thể thao nam', 'Quần thể thao nam'],

                // Nữ
                'Áo khoác nữ' => ['Áo khoác dạ nữ', 'Áo blazer nữ'],
                'Áo nữ' => ['Áo kiểu nữ', 'Áo sơ mi nữ'],
                'Quần nữ' => ['Quần jean nữ', 'Quần ống rộng nữ'],
                'Bộ quần áo nữ' => ['Bộ đồ công sở', 'Bộ thể thao nữ'],
                'Đồ thể thao nữ' => ['Áo thể thao nữ', 'Quần thể thao nữ'],
                // Bo suu tap
                'Bộ sưu tập xuân' => ['Áo khoác mỏng xuân', 'Váy nhẹ mùa xuân'],
                'Bộ sưu tập hạ' => ['Áo thun mát mùa hè', 'Quần short đi biển'],
                'Bộ sưu tập thu' => ['Áo dài tay thu', 'Váy tay dài thu'],
                'Bộ sưu tập đông' => ['Áo dạ đông', 'Áo lông cừu'],
            };

            foreach ($productNames as $name) {
                Product::factory()->create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'category_id' => $categoryId
                ]);
            }
        }
    }
}
