<?php

namespace App\Http\Resources\Admin;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerStatisticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'monthly' => $this['monthly'],
            'recent' => $this['recent'],
            'top_customers_spending' => $this['top_customers_by_spending']->map(function ($row) {
                return [
                    'id' => $row->user->id,
                    'name' => $row->user->name,
                    'email' => $row->user->email,
                    'total_spent' => $row->total_spent,
                ];
            }),
            'active_accounts' => $this['active_accounts'],
            'banned_accounts' => $this['banned_accounts'],
            'returning_rate' => $this['returning_rate_percent'],
        ];
    }
}
