<?php

namespace App\Http\Resources\Admin;



use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RevenueStatisticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'yearly' => $this['yearly'],
            'monthly' => $this['monthly'],
            'recent' => [
                '7_days' => $this['recent'][7] ?? [],
                '14_days' => $this['recent'][14] ?? [],
                '30_days' => $this['recent'][30] ?? [],
            ],
        ];
    }
}
