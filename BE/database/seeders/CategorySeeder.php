<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public static array $categoryTree = [
        'Đồ nam' => [
            'Áo khoác nam',
            'Áo nam',
            'Quần nam',
            'Bộ quần áo nam',
            'Đồ thể thao nam',


        ],
        'Đồ nữ' => [
            'Áo khoác nữ',
            'Áo nữ',
            'Quần nữ',
            'Bộ quần áo nữ',
            'Đồ thể thao nữ',


        ],

        'Bộ sưu tập' => [
            'Bộ sưu tập xuân',
            'Bộ sưu tập hạ',
            'Bộ sưu tập thu',
            'Bộ sưu tập đông',
        ],
    ];

    public static array $categoryIds = []; // để lưu ID đã tạo

    public function run()
    {
        foreach (self::$categoryTree as $parent => $children) {
            $parentModel = Category::factory()->create(['name' => $parent, 'slug' =>  Str::slug($parent)]);

            foreach ($children as $child) {
                $childModel = Category::factory()->child($parentModel->id)->create(['name' => $child, 'slug' => Str::slug($child)]);

                self::$categoryIds[$child] = $childModel->id;
            }
        }
    }
}
