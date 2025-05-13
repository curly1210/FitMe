<?php

namespace Database\Seeders;

use App\Models\Variation;
use App\Models\VariationOption;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariationOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy tất cả variations
        $variations = Variation::all();

        foreach ($variations as $variation) {
            // Xác định danh sách giá trị dựa trên tên của variation
            $values = $variation->name === 'Size'
                ? ['S', 'M', 'L', 'XL']
                : ($variation->name === 'Color' ? ['Đỏ', 'Xanh', 'Đen', 'Trắng'] : []);

            // Tạo VariationOption cho mỗi giá trị
            foreach ($values as $value) {
                VariationOption::create([
                    'variation_id' => $variation->id,
                    'value' => $value,
                    'is_active' => 1,
                ]);
            }
        }
    }
}
