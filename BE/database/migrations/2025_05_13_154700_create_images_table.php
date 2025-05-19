<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('url', 255);
            $table->tinyInteger('is_active')->default(1);
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('variation_option_id');
            $table->timestamps();
            $table->softDeletes();

            // Thiết lập khóa ngoại
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('variation_option_id')->references('id')->on('variation_options')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            // Xóa các khóa ngoại
            $table->dropForeign(['product_id']);
            $table->dropForeign(['variation_option_id']);
        });
        Schema::dropIfExists('images');
    }
};
