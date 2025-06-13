<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
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
            'time_start' => Carbon::parse($this->time_start)->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y'),
            'time_end' => Carbon::parse($this->time_end)->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y'),
            'min_price_order' => number_format($this->min_price_order),
            'max_price_discount' => number_format($this->max_price_discount),
            'limit_use' => (int) number_format($this->limit_use),
            'is_active' => $this->is_active ? 1 : 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
