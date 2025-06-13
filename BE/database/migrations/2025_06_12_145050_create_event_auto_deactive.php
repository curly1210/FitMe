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
        CREATE EVENT IF NOT EXISTS auto_deactivate_expired_coupons
        ON SCHEDULE EVERY 1 HOUR
        DO
            UPDATE coupons
            SET is_active = 0 
            WHERE 
                time_end IS NOT NULL 
                AND time_end < NOW()
                AND deleted_at IS NULL
                AND is_active = 1;
    ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP EVENT IF EXISTS auto_deactivate_expired_coupons;");
    }
};
