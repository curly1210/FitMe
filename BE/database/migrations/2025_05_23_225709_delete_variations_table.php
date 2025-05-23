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
        Schema::dropIfExists('variations');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('variations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->tinyInteger('is_active')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }
};
