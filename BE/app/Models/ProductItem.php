<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductItem extends Model
{
    /** @use HasFactory<\Database\Factories\ProductItemFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'import_price',
        'price',
        'sale_price',
        'stock',
        'sku',
        'is_active',
        'product_id',
        'color_id',
        'size_id',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    // public function cart()
    // {
    //     return $this->belongsTo(Cart::class);
    // }
    // public function productConfigurations()
    // {
    //     return $this->hasMany(ProductConfiguration::class);
    // }
    public function ordersDetail()
    {
        return $this->hasMany(OrdersDetail::class);
    }
    // public function productImages()
    // {
    //     return $this->hasMany(ProductImage::class);
    // }
    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }
    // Quan hệ ảnh
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_item_id');
    }
      public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
