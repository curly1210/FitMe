<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\ReviewImage;
use App\Models\ReviewReply;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Review::factory(10)->create()->each(function ($review) {
            ReviewImage::factory(rand(1, 3))->create([
                'review_id' => $review->id,
            ]);
            ReviewReply::factory(1)->create([
                'review_id' => $review->id,
                'user_id' => 1,

            ]);
        });
    }
}
