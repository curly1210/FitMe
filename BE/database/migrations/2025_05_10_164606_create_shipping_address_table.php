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
        Schema::create('shipping_address', function (Blueprint $table) {
            $table->id();
            $table->string('name_receive', 50);
            $table->string('phone', 10);
            $table->string('country', 50)->default('Vietnam');
            $table->string('province', 50);
            $table->unsignedInteger('province_id');
            $table->string('district', 50);
            $table->unsignedInteger('district_id');
            $table->string('ward', 50);
            $table->string('ward_code', 50);
            $table->string('detail_address', 50);
            $table->tinyInteger('is_default')->default(0);
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_address', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::dropIfExists('shipping_address');
    }
};
