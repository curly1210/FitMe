<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Resources\Json\JsonResource;

class WithdrawRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    use CloudinaryTrait;
    public function toArray(Request $request): array
    {

        $user = $this->wallet->user;
        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $this->buildImageUrl($user->avatar),
                'email' => $user->email,
                'phone' => $user->phone,
                'walet_id' => $user->wallet->id
            ],
            'id' => $this->id,
            'amount' => $this->amount,
            'status' => $this->status,
            'type' => $this->type,
            'bill_url' => $this->bill_url,
            'reject_reason' => $this->reject_reason,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('d/m/Y H:i:s'),

        ];
    }
}
