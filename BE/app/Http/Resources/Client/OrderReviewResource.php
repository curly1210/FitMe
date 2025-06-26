<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "orders_code" => $this->orders_code,
            "total_amount" => $this->total_amount,
            "payment_method" => $this->payment_method,
            "status_order_id" => $this->status_order_id,
            "user" => [
                "id" => $this->user->id,
                "name" => $this->user->name,
                "email" => $this->user->email,
                "phone" => $this->user->phone,
            ],
            "created_at" => $this->created_at ? Carbon::parse($this->created_at)->format('d/m/Y H:i:s') : null,
            "success_at" => $this->success_at ? Carbon::parse($this->success_at)->format('d/m/Y H:i:s') : null,
            "order_details" => $this->orderDetails->map(function ($detail) {
                return [
                    "order_detail_id" => $detail->id,
                    "name" => $detail->name_product,
                    "quantity" => $detail->quantity,
                    "price" => $detail->price,
                    "sale_price" => $detail->sale_price,
                    "sale_percent" => $detail->sale_percent,
                    "size" => $detail->size,
                    "color" => $detail->color,
                    "image" => $detail->image_product ?? null,
                    "product_item_id" => $detail->product_item_id,
                ];
            }),
        ];
    }
}
