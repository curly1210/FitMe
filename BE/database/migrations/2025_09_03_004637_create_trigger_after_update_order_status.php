<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Drop trigger cũ trước nếu tồn tại
        DB::unprepared('DROP TRIGGER IF EXISTS after_update_order_status;');

        // Tạo trigger mới
        DB::unprepared('
            CREATE TRIGGER after_update_order_status
            AFTER UPDATE ON orders
            FOR EACH ROW
            BEGIN
                DECLARE earned_point INT DEFAULT 0;

                -- Chỉ cộng điểm khi đơn hàng chuyển sang trạng thái hoàn tất (6) 
                IF (NEW.status_order_id = 6 AND OLD.status_order_id <> NEW.status_order_id) THEN
                    SET earned_point =  FLOOR((NEW.total_amount - NEW.shipping_price) / 10000);

                    UPDATE member_points mp
                    SET 
                        mp.point = @new_point := mp.point + earned_point,
                        mp.last_order_date = NEW.created_at,
                        mp.rank = CASE
                            WHEN @new_point >= 1000 THEN "diamond"
                            WHEN @new_point >= 500 THEN "gold"
                            WHEN @new_point >= 200 THEN "silver"
                            ELSE "bronze"
                        END,
                        mp.value = CASE
                            WHEN @new_point >= 1000 THEN 10
                            WHEN @new_point >= 500 THEN 5
                            WHEN @new_point >= 200 THEN 3
                            ELSE 0
                        END
                    WHERE mp.user_id = NEW.user_id;
                END IF;
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_update_order_status;');
    }
};
