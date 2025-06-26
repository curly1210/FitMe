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
        CREATE TRIGGER update_success_at_on_status_change
        BEFORE UPDATE ON orders
        FOR EACH ROW
        BEGIN
            IF OLD.status_order_id = 4 AND NEW.status_order_id = 6 THEN
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
        DB::unprepared('DROP TRIGGER IF EXISTS update_success_at_on_status_change');
    }
};
