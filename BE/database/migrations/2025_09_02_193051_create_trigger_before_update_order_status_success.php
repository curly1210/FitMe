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
            CREATE TRIGGER before_update_order_status_success
            BEFORE UPDATE ON orders
            FOR EACH ROW
            BEGIN
                IF NEW.status_order_id = 6 AND OLD.status_order_id <> 6 THEN
                    SET NEW.success_at = NOW();
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS before_update_order_status_success');
    }
};
