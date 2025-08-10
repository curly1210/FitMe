<?php

namespace App\Http\Resources\Admin;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Validator;

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
            'reject_reason' => $this->reject_reason,

        ];
    }
}
