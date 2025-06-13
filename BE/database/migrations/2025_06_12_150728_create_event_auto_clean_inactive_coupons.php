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
        # Xóa mềm những mã đã hết hạn
        DB::unprepared("
        CREATE EVENT IF NOT EXISTS soft_delete_expired_coupons
        ON SCHEDULE EVERY 7 DAY
        STARTS CURRENT_TIMESTAMP
        DO
        UPDATE coupons
        SET  deleted_at = NOW()
        WHERE is_active = 0
        AND deleted_at IS NULL
        AND time_end IS NOT NULL
        AND time_end < NOW() - INTERVAL 7 DAY;
    ");
        # Xóa cứng những mã đã bị xóa mềm trong vòng 6 tháng
        DB::unprepared("
        CREATE EVENT IF NOT EXISTS hard_delete_old_soft_deleted_coupons
        ON SCHEDULE EVERY 7 DAY
        STARTS CURRENT_TIMESTAMP
        DO
        DELETE FROM coupons
        WHERE is_active = 0
        AND deleted_at IS NOT NULL
        AND deleted_at <= NOW() - INTERVAL 6 MONTH;
    ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP EVENT IF EXISTS soft_delete_expired_coupons;");
        DB::unprepared("DROP EVENT IF EXISTS hard_delete_old_soft_deleted_coupons;");
    }
};
