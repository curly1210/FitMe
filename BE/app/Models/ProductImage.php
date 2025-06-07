<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    /** @use HasFactory<\Database\Factories\ProductImagesFactory> */
    use HasFactory;

    protected $table = "product_images";

    protected $fillable = [
        'url',
        'is_active',
        'product_id',
        'color_id',
    ];
    // public function product_item()
    // {
    //     return $this->belongsTo(ProductItem::class, 'product_item_id', 'id');
    // }

    // Ảnh thuộc về sản phẩm
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Ảnh thuộc về màu sắc cụ thể
    public function color()
    {
        return $this->belongsTo(Color::class);
    }
}
