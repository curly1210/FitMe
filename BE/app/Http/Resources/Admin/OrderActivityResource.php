<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstDetail = $this->orderDetails->first();

        return [
            'id' => $this->id,
            'orders_code' => $this->orders_code,
            'customer_name' => $this->user?->name ?? 'Khách hàng',
            'total_amount' => number_format($this->total_amount, 0, ',', '.') . '₫',
            'created_at' => $this->created_at->diffForHumans(),
            'product_image' => $firstDetail?->image_product,
           
        ];
    }
}
