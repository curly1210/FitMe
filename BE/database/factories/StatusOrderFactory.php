<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StatusOrder>
 */
class StatusOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected static $index = 0;
    public function definition(): array
    {

        $data = [
            'Chưa xác nhận' => "#6c757d",
            'Đã xác nhận' => '#0d6efd',
            'Đang giao hàng' => '#ffc107',
            'Đã giao hàng' => '#0dcaf0',
            'Giao hàng thành công' => '#198754',
            'Đã hủy' => '#dc3545'
        ];
        // Chuyển associative array thành indexed array
        $statusOrders = array_keys($data);

        // Lấy tuần tự từng phần tử
        $index = self::$index % count($statusOrders);
        $name = $statusOrders[$index];
        $color = $data[$name];
        self::$index++;
        return [
            'name' => $name,
            'color' => $color,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
