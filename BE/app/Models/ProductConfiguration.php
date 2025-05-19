<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductConfiguration extends Model
{
    /** @use HasFactory<\Database\Factories\ProductConfigurationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['product_item_id', 'variation_option_id', 'is_active'];

    public function productItem()
    {
        return $this->belongsTo(ProductItem::class, 'product_item_id');
    }

    public function variationOption()
    {
        return $this->belongsTo(VariationOption::class, 'variation_option_id');
    }
}
