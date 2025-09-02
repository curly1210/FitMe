<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::unprepared("
        CREATE TRIGGER after_update_return_request_status
        AFTER UPDATE ON return_requests
        FOR EACH ROW
        BEGIN
            DECLARE order_point INT DEFAULT 0;
            DECLARE kept_point INT DEFAULT 0;
            DECLARE new_point INT DEFAULT 0;

            -- Chỉ xử lý nếu cập nhật sang trạng thái completed và loại là partial
            IF NEW.status = 'return_completed' AND NEW.type = 'partial' THEN
                
                -- Tính điểm ban đầu của đơn hàng
                SELECT FLOOR((o.total_amount - o.shipping_price) / 10000)
                INTO order_point
                FROM orders o
                WHERE o.id = NEW.order_id;

                -- Tính điểm hoàn hàng
                SELECT FLOOR(SUM(ri.price * ri.quantity) / 10000)
                INTO kept_point
                FROM return_items ri
                WHERE ri.return_request_id = NEW.id;

                -- Tính lại điểm mới
                SELECT mp.point + order_point - kept_point
                INTO new_point
                FROM member_points mp
                WHERE mp.user_id = (
                    SELECT o.user_id FROM orders o WHERE o.id = NEW.order_id
                )
                LIMIT 1;

                -- Cập nhật lại điểm của khách hàng
                UPDATE member_points
                SET 
                    point = new_point,
                    last_order_date = NEW.created_at,
                    `rank` = 
                        CASE
                            WHEN new_point >= 1000 THEN 'diamond'
                            WHEN new_point >= 500 THEN 'gold'
                            WHEN new_point >= 200 THEN 'silver'
                            ELSE 'bronze'
                        END,
                    value = 
                        CASE
                            WHEN new_point >= 1000 THEN 10
                            WHEN new_point >= 500 THEN 5
                            WHEN new_point >= 200 THEN 3
                            ELSE 0
                        END
                WHERE user_id = (
                    SELECT o.user_id FROM orders o WHERE o.id = NEW.order_id
                );
            END IF;
        END
    ");
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_update_return_request_status;');
    }
};
