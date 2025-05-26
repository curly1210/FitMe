<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
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
            'Đồ mặc trong & đồ lót nam',
            'Phụ kiện nam',
        ],
        'Đồ nữ' => [
            'Áo khoác nữ',
            'Áo nữ',
            'Quần nữ',
            'Bộ quần áo nữ',
            'Đồ thể thao nữ',
            'Đồ mặc trong & Đồ lót nữ',
            'Phụ kiện nữ',
        ],
        'Đồ trẻ em' => [
            'Áo thun trẻ em',
            'Áo polo trẻ em',
            'Quần trẻ em',
            'Đồ mặc trong trẻ em',
            'Phụ kiện trẻ em',
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
            $parentModel = Category::factory()->create(['name' => $parent]);

            foreach ($children as $child) {
                $childModel = Category::factory()->child($parentModel->id)->create(['name' => $child]);

                self::$categoryIds[$child] = $childModel->id;
            }
        }
    }
}
