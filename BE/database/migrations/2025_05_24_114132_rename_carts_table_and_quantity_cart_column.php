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
        //
        Schema::rename('carts', 'cart_items');

        Schema::table('cart_items', function (Blueprint $table) {
            $table->renameColumn('quantity_cart', 'quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('cart_items', function (Blueprint $table) {
            $table->renameColumn('quantity', 'quantity_cart');
        });

        Schema::rename('cart_items', 'carts');
    }
};
