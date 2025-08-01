<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingOrder extends Model
{
    use HasFactory;
    protected $fillable = [
        "shipping_code",
        "order_id",
        "packing_rule_id",
        "status_shipping",
        "expected_delivery_time",
        "is_resolve",
    ];
    public function packingRule()
    {
        return $this->hasOne(PackingRule::class);
    }
    public function orders()
    {
        return $this->belongsTo(order::class);
    }
}
