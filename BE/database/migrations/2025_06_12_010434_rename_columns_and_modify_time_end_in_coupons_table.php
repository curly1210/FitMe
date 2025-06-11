<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            // Đổi tên cột min_amount thành min_price_order
            $table->renameColumn('min_amount', 'min_price_order');
            // Đổi tên cột max_amount thành max_price_discount
            $table->renameColumn('max_amount', 'max_price_discount');
            // Cho phép cột time_end nhận NULL
            $table->dateTime('time_end')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            // Hoàn nguyên đổi tên cột
            $table->renameColumn('min_price_order', 'min_amount');
            $table->renameColumn('max_price_discount', 'max_amount');
            // Đặt lại cột time_end không cho phép NULL (giả định ban đầu không NULL, cần điều chỉnh nếu khác)
            $table->dateTime('time_end')->nullable(false)->change();
        });
    }
};
