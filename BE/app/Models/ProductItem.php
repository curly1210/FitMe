<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductItem extends Model
{
    /** @use HasFactory<\Database\Factories\ProductItemFactory> */
    use HasFactory;
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
}
