<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use App\Traits\CloudinaryTrait;
use Illuminate\Http\Resources\Json\JsonResource;

class ReturnRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    use CloudinaryTrait;
    public function toArray(Request $request): array
    {
        return [
            "order" => [
                "id" => $this->order->id,
                "orders_code" => $this->order->orders_code,
            ],
            "id" => $this->id,
            "type" => $this->type,
            "shipping_label_image" => $this->buildImageUrl($this->shipping_label_image) ?? null,
            "reason" => $this->reason ?? null,
            "status" => $this->status,
            "admin_note" => $this->admin_note ?? null,
        ];
    }
}
