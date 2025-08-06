<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WithdrawRequest extends Model
{
    protected $fillable = [
        'wallet_id',
        'amount',
        'status',
        'reject_reason',
    ];
    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }
}
