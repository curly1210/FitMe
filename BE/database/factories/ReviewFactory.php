<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Order;
use App\Models\Review;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\OrdersDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $usedOrderDetailIds = [];

        // Lấy orderDetail chưa dùng
        $orderDetail = OrdersDetail::whereNotIn('id', $usedOrderDetailIds)
            ->inRandomOrder()
            ->first();

        if (!$orderDetail) {
            // HẾT orderDetail, không tạo thêm review nữa!
            throw new \Exception('Đã hết order_detail để tạo review duy nhất!');
            // hoặc return null; (nếu bạn muốn)
        }

        $usedOrderDetailIds[] = $orderDetail->id;
        $order = $orderDetail->order;

        return [
            'rate' => $this->faker->randomElement([1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]),
            'content' => $this->faker->sentence,
            'is_update' => $this->faker->boolean(),
            'user_id'         => $order->user_id,
            'product_item_id' => $orderDetail->product_item_id,
            'order_detail_id' => $orderDetail->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
