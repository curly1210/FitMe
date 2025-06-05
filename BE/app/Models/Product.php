<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name',
        'total_inventory',
        'short_description',
        'description',
        'slug',
        'category_id',
        'is_active'
    ];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function productItems()
    {
        return $this->hasMany(ProductItem::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
    public function reviews()
    {
        return $this->hasManyThrough(
            Review::class,
            ProductItem::class,
            'product_id',      
            'product_item_id', 
            'id',              
            'id'               
        );
    }

    public function images()
{
    return $this->hasMany(ProductImage::class);
}

}
