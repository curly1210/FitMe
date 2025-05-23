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
        Schema::table('images', function (Blueprint $table) {
            // Xóa các khóa ngoại
            $table->dropForeign(['variation_option_id']);
        });
        Schema::dropIfExists('variation_options');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('variation_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variation_id');
            $table->string('value', 20);
            $table->tinyInteger('is_active')->default(1);
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('variation_id')->references('id')->on('variations')->onDelete('cascade');
        });

        Schema::table('images', function (Blueprint $table) {
            $table->foreign('variation_option_id')
                  ->references('id')
                  ->on('variation_options')
                  ->onDelete('cascade');
        });
    }
};
