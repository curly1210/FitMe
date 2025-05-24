<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrdersDetail extends Model
{
    //
    use HasFactory;

    protected $table = 'orders_detail';

    // Các thuộc tính có thể được gán đại trà (mass assignable)
    protected $fillable = [
        'quantity',
        'price',
        'product_item_id',
        'order_id',
         'color',
        'size',
        'name_product',
    ];

    /**
     * Quan hệ với bảng Order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Quan hệ với bảng ProductItem.
     */
    public function productItem()
    {
        return $this->belongsTo(ProductItem::class, 'product_item_id');
    }
    public function review()
    {
        return $this->belongsTo(OrdersDetail::class);
    }
}
