<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "WardCode" => $this['WardCode'],
            "DistrictID" => $this['DistrictID'],
            "WardName" => $this['WardName'],

        ];
    }
}
