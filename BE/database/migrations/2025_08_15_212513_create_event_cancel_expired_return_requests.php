<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE EVENT IF NOT EXISTS cancel_expired_return_requests
            ON SCHEDULE EVERY 1 DAY
            DO
                UPDATE return_requests
                SET status = 'cancel'
                WHERE status = 'accept'
                AND accepted_at < DATE_SUB(NOW(), INTERVAL 3 DAY);
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_cancel_expired_return_requests');
    }
};
