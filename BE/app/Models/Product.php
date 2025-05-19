<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'short_description',
        'description',
        'slug',
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
    public function images()
    {
        return $this->hasMany(Image::class);
    }
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
}
