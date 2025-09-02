<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Traits\CloudinaryTrait;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Resources\Json\JsonResource;

class WalletTransactionResource extends JsonResource
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
            'amount' => $this->amount,
            'wallet_id' => $this->wallet_id,
            'type' => $this->type,
            'reject_reason' => $this->reject_reason ?? null,
            // 'bill_url' => $this->bill_url ?? null,
            'bill_url' => $this->bill_url ? $this->buildImageUrl($this->bill_url) : null,
            'status' => $this->status,
            'receive_account_number' => $this->receive_account_number == null ? null : Crypt::decryptString($this->receive_account_number),
            'receive_account_holder' => $this->receive_account_holder,
            'receive_bank_name' => $this->receive_bank_name,
            'created_at' => Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
            'updated_at' => Carbon::parse($this->updated_at)->format('d/m/Y H:i:s'),
        ];
    }
}
