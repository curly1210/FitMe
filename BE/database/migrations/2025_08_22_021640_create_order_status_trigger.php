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
            CREATE TRIGGER after_update_order_status
            AFTER UPDATE ON orders
            FOR EACH ROW
            BEGIN
                -- chỉ chạy khi status_order_id đổi sang 6
                IF NEW.status_order_id = 6 AND OLD.status_order_id <> 6 THEN
                    UPDATE member_points mp
                    SET 
                        mp.point = mp.point + FLOOR(NEW.total_amount / 10000),
                        mp.last_order_date = NEW.created_at,
                        mp.rank = CASE
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 1000 THEN "diamond"
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 500 THEN "gold"
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 200 THEN "silver"
                            ELSE "bronze"
                        END,
                        mp.value = CASE
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 1000 THEN 10
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 500 THEN 5
                            WHEN mp.point + FLOOR(NEW.total_amount / 10000) >= 200 THEN 3
                            ELSE 0
                        END
                    WHERE mp.user_id = NEW.user_id;
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_status_trigger');
    }
};
