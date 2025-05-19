<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Lưu ý rằng ngoài những seeder được thêm vào sẵn để tiện thao tác các bảng khác, CHƯA CẦN đưa các seeder mới vào file này để tránh xung đột code 
        $this->call([
            UserSeeder::class,
            ShippingAddressSeeder::class,
            CategorySeeder::class,
            StatusOrderSeeder::class,
            ProductSeeder::class,
            ProductItemSeeder::class,
            
        ]);
    }
}
