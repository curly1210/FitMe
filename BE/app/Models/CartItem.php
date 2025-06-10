<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'quantity',
        'user_id',
        'product_item_id',
    ];

    // Quan hệ: Mỗi cart thuộc về 1 user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ: Mỗi cart item chỉ liên kết với một product item
    public function productItem()
    {
        return $this->belongsTo(ProductItem::class);
    }
}
