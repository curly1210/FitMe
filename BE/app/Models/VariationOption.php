<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariationOption extends Model
{
    /** @use HasFactory<\Database\Factories\VariationOptionFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['variation_id', 'value', 'is_active'];

    // Mối quan hệ Many-to-One với Variation
    public function variation()
    {
        return $this->belongsTo(Variation::class, 'variation_id');
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'variation_option_id');
    }

    public function productConfigurations()
    {
        return $this->hasMany(ProductConfiguration::class, 'variation_option_id');
    }
}
