<?php

namespace App\Http\Resources\Admin;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
          return [
            'orders_code' => $this->orders_code,
            'total_amount' => $this->total_amount,
            'status_payment' => $this->status_payment,
            'payment_method' => $this->payment_method,
            'status_order_id' => $this->status_order_id,
            'receiving_address' => $this->receiving_address,
            'recipient_name' => $this->recipient_name,
            'recipient_phone' => $this->recipient_phone,
            // thêm các trường bạn cần
        ];
    }
}
