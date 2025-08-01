<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackingRule extends Model
{
    use HasFactory;
    protected $fillable = [
        "box_code",
        "min_quantity",
        "max_quantity",
        "max_weight",
        "box_weight",

        "box_length",

        "box_width",

        "box_height",
    ];
    public function shippingOrders()
    {
        return $this->belongsTo(ShippingOrder::class);
    }
}
