<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared("
            CREATE TRIGGER trg_update_order_when_return_cancel
            AFTER UPDATE ON return_requests
            FOR EACH ROW
            BEGIN
                -- Nếu phiếu hoàn hàng bị hủy
                IF NEW.status = 'canceled' AND OLD.status <> 'canceled' THEN
                    UPDATE orders
                    SET status_order_id = 6   
                    WHERE id = NEW.order_id;
                END IF;
            END
        ");
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_update_order_when_return_cancel');
    }
};
