<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Variation extends Model
{
    /** @use HasFactory<\Database\Factories\VariationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable=[
        'name',
        'is_active',
    ];

    protected $dates = ['deleted_at'];

    // Mối quan hệ One-to-Many với VariationOption
    public function variationOptions()
    {
        return $this->hasMany(VariationOption::class, 'variation_id');
    }
}
