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
        Schema::create('shipping_orders', function (Blueprint $table) {
            $table->id();
            $table->string('shipping_code', 20)->unique();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('packing_rule_id');
            $table->string('status_shipping', 100);
            $table->timestamp('expected_delivery_time');
            $table->tinyInteger('is_resolve')->nullable();
            $table->timestamps();
            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('packing_rule_id')->references('id')->on('packing_rules');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_orders', function (Blueprint $table) {
            $table->dropForeign(['order_id', 'packing_rule_id']);
        });
        Schema::dropIfExists('shipping_orders');
    }
};
