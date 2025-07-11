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
        Schema::table('orders', function (Blueprint $table) {
            //
            $table->dropForeign(['shipping_address_id']);
            $table->dropColumn('shipping_address_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('shipping_address_id')->nullable();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('shipping_address_id')
                ->references('id')
                ->on('shipping_address')
                ->onDelete('cascade');
        });
    }
};
