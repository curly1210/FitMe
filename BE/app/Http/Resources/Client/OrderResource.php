<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;

use Illuminate\Support\Carbon;

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
            'id' => $this->id,
            'orders_code' => $this->orders_code,
            'created_at' => $this->created_at,
            'total_amount_items' => $this->orderDetails->sum('quantity'), // Tổng số lượng sản phẩm
            'total_amount' => $this->total_amount,
            'receiving_address' => $this->receiving_address,
            'status_order_id' => $this->status_order_id,
            'status_name' => $this->statusOrder->name ?? 'Không xác định', // Lấy name từ status_orders

            "is_reviewed_order" => $this->orderDetails->contains(function ($detail) {
                return $detail->review !== null;
            }) ? 1 : 0,
            "reviewed_count" => $this->orderDetails->filter(function ($detail) {
                return $detail->review !== null;
            })->count(),

            // "success_at" =>   Carbon::parse($this->updated_at)->format('Y-m-d H:i:s') ?? null,
            "success_at" =>   $this->success_at ? Carbon::parse($this->success_at)->format('Y-m-d H:i:s') : null,


        ];
    }
}
