<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOrderDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'image_product' => $this->image_product,
            'product_name' => $this->name_product,
            'color' => $this->color,
            'size' => $this->size,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'sale_percent' => $this->sale_percent,
            'subtotal' => $this->sale_price * $this->quantity,
        ];
    }
}
