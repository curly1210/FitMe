<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'orders_code' => $this->orders_code,
            'customer_name' => $this->user->name ?? 'N/A',
            'customer_email' => $this->user->email ?? 'N/A',
            'created_at' => $this->created_at->format('Y-m-d H:i'),
            'status_order' => [
                'id' => $this->status_order_id,
                'label' => $this->statusOrder->name ?? 'Không rõ',
                'color' => $this->statusOrder->color ?? '#000000',
            ],
            'total_amount' => $this->total_amount,
            'payment_method' => $this->payment_method,
            'status_payment' => $this->status_payment,
        ];
    }
}
