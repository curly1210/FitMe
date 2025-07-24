<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'value' => $this->value,
            'type' => $this->type,
            'max_price_discount' => $this->max_price_discount,
            'min_price_order' => $this->min_price_order,
            'time_start' => $this->time_start ? $this->time_start->toDateTimeString() : null,
            'time_end' => $this->time_end ? $this->time_end->toDateTimeString() : null,
        ];
    }
}
