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
        'price_variation',
        'sale_price_variation',
        'stock_variation',
        'sku',
        'is_active',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productConfigurations()
    {
        return $this->hasMany(ProductConfiguration::class);
    }
}
