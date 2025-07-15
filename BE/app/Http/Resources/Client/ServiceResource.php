<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "service_id" => $this['service_id'],
            "short_name" => $this['short_name'],
            "service_type_id" => $this['service_type_id'],
        ];
    }
}
