<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProvinceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "ProvinceID" => $this['ProvinceID'],
            "ProvinceName" => $this['ProvinceName'],
            "Code" => $this["Code"],
        ];
    }
}
