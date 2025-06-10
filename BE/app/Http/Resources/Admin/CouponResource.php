<?php

namespace App\Http\Resources\Admin;

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
            'time_start' => $this->time_start,
            'time_end' => $this->time_end,
            'min_amount' => $this->min_amount,
            'max_amount' => $this->max_amount,
            'limit_use' => $this->limit_use,
            'is_active' =>$this->is_active ? 1:0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
