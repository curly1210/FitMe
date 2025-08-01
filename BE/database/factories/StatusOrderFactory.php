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
            'Chờ xác nhận' => "#6c757d",
            'Đang chuẩn bị hàng' => '#0d6efd',
            'Đang giao hàng' => '#ffc107',
            'Đã giao hàng' => '#ffc107',
            'Giao hàng thất bại' => '#198754',
            'Hoàn thành' => '#0dcaf0',
            'Đã hủy' => '#dc3545',
            'Đã giao một phần' => '#0d6efd',
            'Giao thiếu hàng' => '#fd7e14',
            'Đang xử lý giao thiếu' => '#ffc107',
            "Đang giao lại" => '#ffc107',
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
