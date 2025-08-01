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
        Schema::create('packing_rules', function (Blueprint $table) {
            $table->id();
            $table->string('box_code', 50)->unique();
            $table->unsignedInteger('min_quantity');
            $table->unsignedInteger('max_quantity');
            $table->unsignedInteger('max_weight'); // gram
            $table->unsignedInteger('box_weight'); // gram
            $table->unsignedInteger('box_length'); // cm
            $table->unsignedInteger('box_width');  // cm
            $table->unsignedInteger('box_height'); // cm
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packing_rules');
    }
};
