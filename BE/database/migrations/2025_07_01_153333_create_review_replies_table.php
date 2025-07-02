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
        Schema::create('review_replies', function (Blueprint $table) {
            $table->id();
            $table->string('content');
            $table->unsignedBigInteger('review_id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('review_id')->references('id')->on('reviews')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('review_replies', function (Blueprint $table) {
            $table->dropForeign(['review_id']);
            $table->dropForeign(['user_id']);
        });
        Schema::dropIfExists('review_replies');
    }
};
