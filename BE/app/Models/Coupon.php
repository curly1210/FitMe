<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    /** @use HasFactory<\Database\Factories\CouponFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'value',
        'time_start',
        'time_end',
        'min_amount',
        'max_amount',
        'limit_use',
        'is_active',
    ];

    protected $casts = [
        'time_start' => 'datetime',
        'time_end' => 'datetime',
        'is_active' => 'boolean',
    ];

}
