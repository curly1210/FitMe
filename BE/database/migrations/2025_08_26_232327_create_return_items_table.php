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
        Schema::create('return_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('return_request_id');
            $table->unsignedBigInteger('order_detail_id');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('price');
            $table->timestamps();
            $table->foreign('return_request_id')->references('id')->on('return_requests')->onDelete('cascade');
            $table->foreign('order_detail_id')->references('id')->on('orders_detail')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('return_requests', function (Blueprint $table) {
            $table->dropForeign(['return_request_id', 'order_detail_id']);
        });
        Schema::dropIfExists('return_items');
    }
};
