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

            $table->unsignedBigInteger('product_item_id');
            $table->unsignedBigInteger('order_detail_id');


            $table->foreign('product_item_id')->references('id')->on('product_items')->onDelete('cascade');
            $table->foreign('order_detail_id')->references('id')->on('orders_detail')->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['product_item_id']);
            $table->dropForeign(['order_detail_id']);

            $table->dropColumn('product_item_id');
            $table->dropColumn('order_detail_id');
        });
        Schema::table('reviews', function (Blueprint $table) {
            

            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('order_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

        });
    }
};
