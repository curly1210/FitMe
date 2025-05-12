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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('orders_code', 20)->unique();
            $table->unsignedInteger('total_amount');
            $table->tinyInteger('status_payment')->default(0); // 0: chưa thanh toán, 1: đã thanh toán
            $table->enum('payment_method', ['cod', 'banking', 'vnpay']);
            $table->unsignedInteger('status_order_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('shipping_address_id');
            $table->timestamps();

            // Foreign keys (nếu muốn ràng buộc luôn)
            $table->foreign('status_order_id')->references('id')->on('status_orders');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('shipping_address_id')->references('id')->on('shipping_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
