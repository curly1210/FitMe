<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    //
    protected $table = 'password_resets'; 

    protected $fillable = [
        'user_id',
        'email', 
        'token',
        'created_at',
        'expires_at',
        'used',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
