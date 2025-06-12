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
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('total_price_item')->default(0)->after('orders_code');
            $table->unsignedInteger('shipping_price')->default(0)->after('total_price_item');
            $table->unsignedInteger('discount')->default(0)->after('shipping_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['total_price_item', 'shipping_price', 'discount']);
        });
    }
};
