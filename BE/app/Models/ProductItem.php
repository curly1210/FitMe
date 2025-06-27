<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductItem extends Model
{
    /** @use HasFactory<\Database\Factories\ProductItemFactory> */
    use HasFactory;
    protected $fillable = [
        'import_price',
        'price',
        'sale_price',
        'sale_percent',
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
    // Một product item có thể nằm trong nhiều cart item
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function ordersDetail()
    {
        return $this->hasMany(OrdersDetail::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function imageByColor()
    {
        return $this->hasOne(ProductImage::class, 'product_id', 'product_id')
            ->whereColumn('color_id', 'color_id');
    }
}
