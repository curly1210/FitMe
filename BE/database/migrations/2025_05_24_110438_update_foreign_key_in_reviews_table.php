<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            //
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);

            $table->dropColumn('product_id');
            $table->dropColumn('order_id');

            $table->unsignedBigInteger('product_item_id')->nullable();
            $table->unsignedBigInteger('order_detail_id');


            $table->foreign('product_item_id')->references('id')->on('product_items')->onDelete('set null');
            $table->foreign('order_detail_id')->references('id')->on('orders_detail')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Xóa khóa ngoại và cột mới
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['product_item_id']);
            $table->dropForeign(['order_detail_id']);
            $table->dropColumn('product_item_id');
            $table->dropColumn('order_detail_id');
        });

        // Thêm lại 2 cột cũ, có nullable để tránh lỗi dữ liệu
        Schema::table('reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('product_id')->nullable()->after('id'); // hoặc after cột phù hợp
            $table->unsignedBigInteger('order_id')->nullable()->after('product_id');

            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onDelete('cascade');
        });
    }
};
