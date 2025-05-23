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
    public function up()
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS trg_update_order_total_after_insert;
            CREATE TRIGGER trg_update_order_total_after_insert
            AFTER INSERT ON orders_detail
            FOR EACH ROW
            BEGIN
                UPDATE orders
                SET total_amount = (
                    SELECT IFNULL(SUM(price * quantity), 0)
                    FROM orders_detail
                    WHERE order_id = NEW.order_id
                )
                WHERE id = NEW.order_id;
            END
        ");
    }

    public function down()
    {
        DB::unprepared("DROP TRIGGER IF EXISTS trg_update_order_total_after_insert;");
    }
};
