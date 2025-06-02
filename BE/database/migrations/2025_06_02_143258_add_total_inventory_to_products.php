<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('total_inventory')->default(0)->after('name');
        });

        // Trigger cho INSERT trên product_items
        DB::unprepared('
            CREATE TRIGGER product_items_insert_trigger
            AFTER INSERT ON product_items
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET total_inventory = (
                    SELECT SUM(stock)
                    FROM product_items
                    WHERE product_id = NEW.product_id
                )
                WHERE id = NEW.product_id;
            END
        ');

        // Trigger cho UPDATE trên product_items
        DB::unprepared('
            CREATE TRIGGER product_items_update_trigger
            AFTER UPDATE ON product_items
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET total_inventory = (
                    SELECT SUM(stock)
                    FROM product_items
                    WHERE product_id = NEW.product_id
                )
                WHERE id = NEW.product_id;
            END
        ');

        // Trigger cho DELETE trên product_items
        DB::unprepared('
            CREATE TRIGGER product_items_delete_trigger
            AFTER DELETE ON product_items
            FOR EACH ROW
            BEGIN
                UPDATE products
                SET total_inventory = (
                    SELECT COALESCE(SUM(stock), 0)
                    FROM product_items
                    WHERE product_id = OLD.product_id
                )
                WHERE id = OLD.product_id;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('total_inventory');
        });

        // Xóa các Trigger
        DB::unprepared('DROP TRIGGER IF EXISTS product_items_insert_trigger');
        DB::unprepared('DROP TRIGGER IF EXISTS product_items_update_trigger');
        DB::unprepared('DROP TRIGGER IF EXISTS product_items_delete_trigger');
    }
};
