<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
            'name_receive' => $this->name_receive,
            'phone' => $this->phone,
            // 'email' => $this->email,
            'ward' => $this->ward,
            'ward_code' => $this->ward_code,

            'district' => $this->district,
            'district_id' => $this->district_id,

            'province' => $this->province,
            'province_id' => $this->province_id,

            'full_address' => implode(', ', array_filter([
                // $this->detail_address,
                $this->ward,
                $this->district,
                $this->city,
                $this->country,
            ])),
            'detail_address' => $this->detail_address,
            'is_default' => $this->is_default,
            // 'created_at' => $this->created_at,
            // 'updated_at' => $this->updated_at,
        ];
    }
}
