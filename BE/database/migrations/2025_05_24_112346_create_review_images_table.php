<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('review_images', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255);
            $table->unsignedBigInteger('review_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('review_id')->references('id')->on('reviews')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('review_images', function (Blueprint $table) {
            $table->dropForeign(['review_id']);
        });
        Schema::dropIfExists('review_images');
    }
};
