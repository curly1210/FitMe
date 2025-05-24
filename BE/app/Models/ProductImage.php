<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    /** @use HasFactory<\Database\Factories\ProductImagesFactory> */
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'url',
        'is_active',
        'product_item_id',
    ];
    public function product_item()
    {
        return $this->belongsTo(ProductItem::class, 'product_item_id', 'id');
    }
}
