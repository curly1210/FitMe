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
        DB::unprepared('
            CREATE EVENT IF NOT EXISTS auto_update_order_status
            ON SCHEDULE EVERY 1 DAY
            DO
                UPDATE orders
                SET status_order_id = 6,
                    success_at = NOW()
                WHERE status_order_id = 4
                  AND updated_at <= NOW() - INTERVAL 7 DAY;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP EVENT IF EXISTS auto_update_order_status');
    }
};
