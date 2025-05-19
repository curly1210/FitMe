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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 50); // varchar(50)
            $table->longText('content'); // longtext
            $table->string('thumbnail', 255); // varchar(255)
            $table->tinyInteger('is_active')->default(1); // tinyint(1)
            $table->string('img', 255); // varchar(255)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
