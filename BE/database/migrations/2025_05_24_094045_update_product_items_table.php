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
        Schema::table('product_items', function (Blueprint $table) {
            $table->unsignedBigInteger('color_id')->after('is_active');
            $table->unsignedBigInteger('size_id')->after('color_id');
            ;
            $table->foreign('color_id')->references('id')->on('colors')->onDelete('cascade');
            $table->foreign('size_id')->references('id')->on('sizes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_items', function (Blueprint $table) {
            // Xóa ràng buộc foreign key trước
            $table->dropForeign(['color_id']);
            $table->dropForeign(['size_id']);

            // Sau đó mới xóa cột
            $table->dropColumn(['color_id', 'size_id']);
        });
    }
};
