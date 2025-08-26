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
        Schema::create('return_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('reason');
            $table->string('shipping_label_image')->nullable();
            $table->enum('type', ['full', 'partial']);
            $table->enum('status', ['pending', 'reject', 'accept', 'cancel', 'returning', 'return_fail', 'return_complete'])->default('pending');
            $table->string('admin_note')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('return_requests', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });
        Schema::dropIfExists('return_requests');
    }
};
