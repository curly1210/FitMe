<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImageFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'url',
        'product_id',
        'variation_option_id',
        'is_active'
    ];

    public function variation()
    {
        return $this->belongsTo(VariationOption::class, 'variation_option_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
