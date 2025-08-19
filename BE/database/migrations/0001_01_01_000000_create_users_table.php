<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('email', 50)->unique();
            $table->string('password');
            $table->string('avatar')->nullable();
            $table->date('birthday')->nullable();
            $table->string('phone', 10);
            $table->enum('gender', ['Nam', 'Nữ'])->nullable();

            $table->enum('role', ['Customer', 'Admin'])->default('Customer');

            $table->tinyInteger('is_ban')->default(0);
            $table->tinyInteger('is_active')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
