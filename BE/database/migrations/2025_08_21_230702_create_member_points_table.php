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
        Schema::create('member_points', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('point')->default(0);
            $table->enum('rank', ['bronze', 'silver', 'gold', 'diamond'])->default('bronze');
            $table->unsignedBigInteger('user_id');
            $table->tinyInteger('value')->default(0);
            $table->timestamp('last_order_date')->nullable();
            $table->timestamp("last_rank_deduction_at")->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_points');
    }
};
