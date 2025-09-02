<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE EVENT IF NOT EXISTS auto_update_failed_return_orders
            ON SCHEDULE EVERY 1 DAY
            DO
            BEGIN
                UPDATE orders
                SET status_order_id = 6
                WHERE status_order_id = 12
                  AND updated_at <= NOW() - INTERVAL 7 DAY;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP EVENT IF EXISTS auto_update_failed_return_orders');
    }
};
