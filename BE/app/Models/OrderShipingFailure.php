<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderShipingFailure extends Model
{
    //
      use HasFactory;

    protected $table = 'order_delivery_failures';

    protected $fillable = [
        'order_id',
        'attempt',
        'reason',
    ];

    /**
     * Mỗi lần giao hàng thất bại thuộc về một đơn hàng
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
