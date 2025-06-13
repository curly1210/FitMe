<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponCodeUsageResource extends JsonResource
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
            'email' => $this->user->email,
            'order_code' => $this->order->code,
            'coupon_code' => $this->coupon->code,
            "used_at" => $this->created_at->timezone('Asia/Ho_Chi_Minh')->format('d-m-Y H:i:s'),
        ];
    }
}
