<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShippingAddress extends Model
{

    use HasFactory;
    protected $table = 'shipping_address';
    protected $fillable = [
        'name_receive',
        'phone',
        // 'email',
        // 'country',
        "province",
        "province_id",
        "district",
        "district_id",
        "ward",
        "ward_code",

        'detail_address',
        'is_default',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // public function orders()
    // {
    //     return $this->hasMany(Order::class);
    // }
}
