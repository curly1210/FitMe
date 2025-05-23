<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_configurations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_item_id'); // Khóa ngoại liên kết với product_items
            $table->unsignedBigInteger('variation_option_id'); // Khóa ngoại liên kết với variation_options
            $table->tinyInteger('is_active')->default(1); // Trường is_active để xác định trạng thái hoạt động
            $table->timestamps();
            $table->softDeletes(); // Thêm trường deleted_at cho xóa mềm

            // Thiết lập khóa ngoại
            $table->foreign('product_item_id')->references('id')->on('product_items')->onDelete('cascade');
            $table->foreign('variation_option_id')->references('id')->on('variation_options')->onDelete('cascade');
            // Thiết lập ràng buộc unique cho cặp variation_option_id và product_item_id
            $table->unique(['variation_option_id', 'product_item_id'], 'product_configurations_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_configurations', function (Blueprint $table) {
            // Xóa các khóa ngoại
            $table->dropForeign(['product_item_id']);
            $table->dropForeign(['variation_option_id']);
            // Xóa ràng buộc unique
            $table->dropUnique('product_configurations_unique');
        });
        Schema::dropIfExists('product_configurations');
    }
};
