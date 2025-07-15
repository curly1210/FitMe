<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DistrictResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "DistrictID" => $this['DistrictID'],
            "ProvinceID" => $this['ProvinceID'],
            "DistrictName" => $this['DistrictName'],
            "Code" => $this['Code'],

        ];
    }
}
