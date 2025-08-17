<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Event 1: Hủy đơn chưa thanh toán quá 24h
        DB::unprepared("
            CREATE EVENT IF NOT EXISTS auto_cancel_orders
            ON SCHEDULE EVERY 1 MINUTE
            DO
                UPDATE orders
                SET status_order_id = 7
                WHERE status_order_id = 1
                  AND status_payment = 0
                  AND payment_method = 'vnpay'
                  AND created_at < NOW() - INTERVAL 24 HOUR;
        ");

        // Event 2: Restock sản phẩm
        DB::unprepared("
            CREATE EVENT IF NOT EXISTS auto_restock_orders
            ON SCHEDULE EVERY 1 MINUTE
            DO
                UPDATE product_items pi
                JOIN orders_detail od ON od.product_item_id = pi.id
                JOIN orders o ON od.order_id = o.id
                SET pi.stock = pi.stock + od.quantity
                WHERE o.status_order_id = 7
                  AND od.restocked = 0;
        ");

        // Event 3: Đánh dấu order_details đã restocked
        DB::unprepared("
            CREATE EVENT IF NOT EXISTS auto_mark_restocked
            ON SCHEDULE EVERY 1 MINUTE
            DO
                UPDATE orders_detail od
                JOIN orders o ON od.order_id = o.id
                SET od.restocked = 1
                WHERE o.status_order_id = 7
                  AND od.restocked = 0;
        ");
    }

    public function down(): void
    {
        DB::unprepared("DROP EVENT IF EXISTS auto_cancel_orders");
    }
};
