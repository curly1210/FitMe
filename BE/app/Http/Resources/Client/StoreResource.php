<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
            [
                "_id" => $this['_id'],
                "name" => $this['name'],
                "phone" => $this['phone'],
                "address" => $this['address'],
                "ward_code" => $this['ward_code'],
                "district_id" => $this['district_id'],
            ];
    }
}
