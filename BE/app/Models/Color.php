<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Color extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'is_active',
    ];

    public function productItems()
    {
        return $this->hasMany(ProductItem::class);
    }

    // Một màu có thể có nhiều ảnh sản phẩm (theo từng sản phẩm)
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }
}
