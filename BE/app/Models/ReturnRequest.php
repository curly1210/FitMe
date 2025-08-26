<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnRequest extends Model
{
    protected $fillable = [
        'order_id',
        'reason',
        'shipping_label_image',
        'type',
        'status',
        'admin_note',
        'accepted_at',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function returnFiles()
    {
        return $this->hasMany(ReturnFile::class);
    }
    public function returnItems()
    {
        return $this->hasMany(ReturnItem::class);
    }
}
