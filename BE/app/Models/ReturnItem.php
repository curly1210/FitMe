<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnItem extends Model
{
    protected $fillable = [
        'return_request_id',
        'order_detail_id',
        'quantity',
        'price',

    ];
    public function orderDetail()
    {
        return $this->belongsTo(OrdersDetail::class);
    }
    public function returnRequest()
    {
        return $this->belongsTo(ReturnRequest::class);
    }
}
