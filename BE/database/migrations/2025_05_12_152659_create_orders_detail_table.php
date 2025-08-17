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
        Schema::create('orders_detail', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('price');
            // $table->foreignId('product_item_id')->constrained('product_items')->onDelete('cascade');
            $table->foreignId('product_item_id')
                ->nullable() // bắt buộc
                ->constrained('product_items')
                ->onDelete('set null');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->tinyInteger('restocked')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders_detail', function (Blueprint $table) {
            $table->dropForeign(['product_item_id']);
            $table->dropForeign(['order_id']);
        });
        Schema::dropIfExists('orders_detail');
    }
};
