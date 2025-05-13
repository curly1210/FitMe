<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VariationOption extends Model
{
    /** @use HasFactory<\Database\Factories\VariationOptionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = ['variation_id', 'value', 'is_active'];

    // Mối quan hệ Many-to-One với Variation
    public function variation()
    {
        return $this->belongsTo(Variation::class, 'variation_id');
    }
}
