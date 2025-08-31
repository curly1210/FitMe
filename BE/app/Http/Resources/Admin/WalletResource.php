<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    use CloudinaryTrait;
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'balance' => $this->balance,
            'account_number' => $this->account_number == null ? null : Crypt::decryptString($this->account_number),
            'account_holder' => $this->account_holder ?? null,
            'bank_name' => $this->bank_name,
            'user_name' => $this->user->name,
            'user_avatar' => $this->buildImageUrl($this->user->avatar),
            'user_email' => $this->user->email,
            'user_phone' => $this->user->phone,
            'user_is_ban' => $this->user->is_ban,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('d/m/Y H:i:s'),
        ];
    }
}
