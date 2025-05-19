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
            // Sử dụng factory để tạo tất cả giá trị cho variation
            VariationOption::factory()
                ->withAllValues($variation)
                ->create();
        }
    }
}
