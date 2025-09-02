<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Crypt;

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
                'walet_id' => $user->wallet->id,

                'bank_account' => $this->receive_account_number ?  [
                    'bank_name'      => $this->receive_bank_name ?? null,
                    'account_number' =>  $this->receive_account_number == null ? null : Crypt::decryptString($this->receive_account_number),
                    'account_holder' => $this->receive_account_holder ?? null,
                ] : null,
            ],
            'id' => $this->id,
            'amount' => $this->amount,
            'status' => $this->status,
            'type' => $this->type,
            'bill_url' => $this->bill_url ? $this->buildImageUrl($this->bill_url) : null,
            'reject_reason' => $this->reject_reason,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('d/m/Y H:i:s'),

        ];
    }
}
