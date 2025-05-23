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
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200); // Tên màu, varchar(200)
            $table->string('code', 10); // Mã màu, varchar(10)
            $table->tinyInteger('is_active')->default(1); // Trạng thái, mặc định là 1
            $table->timestamps();
            $table->softDeletes(); // deleted_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colors');
    }
};
