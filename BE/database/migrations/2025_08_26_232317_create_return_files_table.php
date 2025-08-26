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
        Schema::create('return_files', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->unsignedBigInteger('return_request_id');
            $table->enum('media_type', ['video', 'image']);
            $table->enum('upload_by', ['Customer', 'Admin']);
            $table->timestamps();
            $table->foreign('return_request_id')->references('id')->on('return_requests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('return_requests', function (Blueprint $table) {
            $table->dropForeign(['return_request_id']);
        });
        Schema::dropIfExists('return_files');
    }
};
