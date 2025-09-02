<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'amount',
        'type',
        'status',
        'receive_bank_name',
        'receive_account_number',
        'receive_account_holder',
        'reject_reason',
        'bill_url',
        "from_order_code"
    ];
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}
