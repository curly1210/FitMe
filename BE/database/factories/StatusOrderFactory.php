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
            [
                'name' => 'Chờ lấy hàng',
                'code' => 'ready_to_pick',
                'public_status_id' => null,
                'color' => '#3498db',
                'description' => 'Đơn hàng vừa được tạo',
            ],
            [
                'name' => 'Đang lấy hàng',
                'code' => 'picking',
                'public_status_id' => null,
                'color' => '#3498db',
                'description' => 'Nhân viên đang đến lấy hàng',
            ],
            [
                'name' => 'Đã huỷ',
                'code' => 'cancel',
                'public_status_id' => null,
                'color' => '#e74c3c',
                'description' => 'Đơn hàng đã bị huỷ',
            ],
            [
                'name' => 'Đang thu tiền khi lấy hàng',
                'code' => 'money_collect_picking',
                'public_status_id' => 2,
                'color' => '#3498db',
                'description' => 'Nhân viên đang thu tiền khi lấy hàng',
            ],
            [
                'name' => 'Đã lấy hàng',
                'code' => 'picked',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng đã được lấy thành công',
            ],
            [
                'name' => 'Đang lưu kho',
                'code' => 'storing',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng đã nhập kho GHN',
            ],
            [
                'name' => 'Đang luân chuyển',
                'code' => 'transporting',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng đang luân chuyển giữa các kho',
            ],
            [
                'name' => 'Đang phân loại',
                'code' => 'sorting',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng đang được phân loại tại kho',
            ],
            [
                'name' => 'Đang giao hàng',
                'code' => 'delivering',
                'public_status_id' => null,
                'color' => '#2ecc71',
                'description' => 'Shipper đang giao hàng',
            ],
            [
                'name' => 'Đang thu tiền khi giao hàng',
                'code' => 'money_collect_delivering',
                'public_status_id' => 9,
                'color' => '#2ecc71',
                'description' => 'Shipper đang thu tiền khi giao hàng',
            ],
            [
                'name' => 'Đã giao thành công',
                'code' => 'delivered',
                'public_status_id' => null,
                'color' => '#27ae60',
                'description' => 'Hàng đã được giao thành công',
            ],
            [
                'name' => 'Giao thất bại',
                'code' => 'delivery_fail',
                'public_status_id' => null,
                'color' => '#e74c3c',
                'description' => 'Giao hàng không thành công',
            ],
            [
                'name' => 'Chờ trả hàng',
                'code' => 'waiting_to_return',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng chờ trả lại',
            ],
            [
                'name' => 'Trả hàng',
                'code' => 'return',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng chờ trả về shop',
            ],
            [
                'name' => 'Đang luân chuyển trả hàng',
                'code' => 'return_transporting',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng trả đang luân chuyển',
            ],
            [
                'name' => 'Đang phân loại trả hàng',
                'code' => 'return_sorting',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Hàng trả đang phân loại',
            ],
            [
                'name' => 'Đang trả hàng',
                'code' => 'returning',
                'public_status_id' => null,
                'color' => '#39c12',
                'description' => 'Shipper đang trả hàng về shop',
            ],
            [
                'name' => 'Trả hàng thất bại',
                'code' => 'return_fail',
                'public_status_id' => null,
                'color' => '#e74c3c',
                'description' => 'Trả hàng không thành công',
            ],
            [
                'name' => 'Đã trả hàng',
                'code' => 'returned',
                'public_status_id' => null,
                'color' => '#27ae60',
                'description' => 'Hàng đã trả lại về shop',
            ],
            [
                'name' => 'Ngoại lệ',
                'code' => 'exception',
                'public_status_id' => null,
                'color' => '#9b59b6',
                'description' => 'Trạng thái xử lý ngoại lệ',
            ],
            [
                'name' => 'Hàng hư hỏng',
                'code' => 'damage',
                'public_status_id' => null,
                'color' => '#f78d8d',
                'description' => 'Hàng bị hư hỏng',
            ],
            [
                'name' => 'Hàng thất lạc',
                'code' => 'lost',
                'public_status_id' => null,
                'color' => '#f78d8d',
                'description' => 'Hàng bị thất lạc',
            ],
        ];

        $index = self::$index % count($data);
        $row = $data[$index];
        self::$index++;

        return [
            'name' => $row['name'],
            'code' => $row['code'],
            'public_status_id' => $row['public_status_id'],
            'color' => $row['color'],
            'description' => $row['description'],
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
