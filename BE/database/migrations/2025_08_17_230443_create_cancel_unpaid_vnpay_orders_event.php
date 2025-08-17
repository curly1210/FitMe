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
        DB::unprepared("
            CREATE EVENT IF NOT EXISTS cancel_unpaid_vnpay_orders
            ON SCHEDULE EVERY 1 HOUR
            STARTS CURRENT_TIMESTAMP
            DO
            BEGIN
                UPDATE orders
                SET status_order_id = 7, updated_at = NOW()
                WHERE status_order_id = 1
                  AND status_payment = 0
                  AND payment_method = 'vnpay'
                  AND created_at <= NOW() - INTERVAL 24 HOUR;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP EVENT IF EXISTS cancel_unpaid_vnpay_orders');
    }
};
