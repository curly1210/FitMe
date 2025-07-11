<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    /** @use HasFactory<\Database\Factories\CouponFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'type',
        'value',
        'time_start',
        'time_end',
        'min_price_order',
        'max_price_discount',
        'limit_use',
        'is_active',
    ];

    protected $casts = [
        'time_start' => 'datetime',
        'time_end' => 'datetime',
        'is_active' => 'boolean',
    ];
}
