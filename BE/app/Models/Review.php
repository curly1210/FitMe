<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    //
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'rate',
        'content',
        // 'updated_content',
        'is_update',
        'user_id',
        'product_item_id',
        'order_detail_id',
    ];

    // Quan hệ với bảng User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ với bảng Product
    public function productItem()
    {
        return $this->belongsTo(ProductItem::class);
    }
    public function reviewImages()
    {
        return $this->hasMany(ReviewImage::class, 'review_id', 'id');
    }
    public function orderDetail()
    {
        return $this->belongsTo(OrdersDetail::class);
    }
    public function reviewReplies()
    {
        return $this->hasMany(ReviewReply::class, 'review_id', 'id');
    }
}
