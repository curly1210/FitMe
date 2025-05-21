<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use App\Models\Wishlist;
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
            OrderSeeder::class,
            CartSeeder::class,
            OrderSeeder::class, //bao gồm order_detail
            CommentSeeder::class,
            ReviewSeeder::class,
            VariationSeeder::class,
            VariationOptionSeeder::class,
            ImageSeeder::class,
            ProductConfigurationSeeder::class,
            PostSeeder::class,
            WishlistSeeder::class,
            CouponSeeder::class,
            BannerSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
