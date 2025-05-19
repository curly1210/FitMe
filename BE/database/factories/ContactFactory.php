<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $data = [
            [
                'name' => 'Trịnh Văn A',
                'title' => 'Hỏi về sản phẩm',
                'content' => 'Tôi muốn biết thêm chi tiết về sản phẩm A.'
            ],
            [
                'name' => 'Trịnh Đăng Bảo',
                'title' => 'Vấn đề giao hàng',
                'content' => 'Đơn hàng của tôi chưa được giao sau 5 ngày.'
            ],
            [
                'name' => 'Hoàng Thái Giám',
                'title' => 'Góp ý dịch vụ',
                'content' => 'Tôi hài lòng với dịch vụ, nhưng có thể cải thiện thêm ở bước thanh toán.'
            ],
        ];

        $contact = $this->faker->randomElement($data);

        return [
            //
            'name' => $contact['name'],
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('0#########'), 
             'title' => $contact['title'],
            'content' => $contact['content'],
            'created_at' => now(),
        ];
    }
}
