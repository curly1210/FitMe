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
        Schema::table('orders_detail', function (Blueprint $table) {
            $table->unsignedInteger('sale_price')->after('price');
            $table->unsignedTinyInteger('sale_percent')->after('sale_price');
            $table->string('image_product', 255)->after('sale_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders_detail', function (Blueprint $table) {
            $table->dropColumn(['sale_price', 'sale_percent', 'image_product']);
        });
    }
};
