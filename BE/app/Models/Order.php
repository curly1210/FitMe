<?php

namespace App\Models;

use Database\Seeders\CouponCodeUsageSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'orders_code',
        'total_price_item',
        'shipping_price',
        'discount',
        'total_amount',
        'status_payment',
        'payment_method',
        'status_order_id',
        'user_id',
        'receiving_address',
        'recipient_name',
        'recipient_phone',
    ];

    // Quan hệ với User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với ShippingAddress
    // public function shippingAddress()
    // {
    //     return $this->belongsTo(ShippingAddress::class);
    // }

    // Quan hệ với StatusOrder
    public function statusOrder()
    {
        return $this->belongsTo(StatusOrder::class);
    }

    // Quan hệ với OrdersDetail
    public function orderDetails()
    {
        return $this->hasMany(OrdersDetail::class);
    }
}
