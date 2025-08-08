<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'bank_name',
        'account_number',
        'account_holder',
        'balance',
    ];
    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }
    public function withdrawRequests()
    {
        return $this->hasMany(WithdrawRequest::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
