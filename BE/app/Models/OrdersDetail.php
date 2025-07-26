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
        'sale_price',
        'sale_percent',
        'image_product',
        'product_item_id',
        'order_id',
        'color',
        'size',
        'name_product',
        "width",
        "height",
        "length",
        "weight",

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
        return $this->hasOne(Review::class, 'order_detail_id', 'id');
    }
}
