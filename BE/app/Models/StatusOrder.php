<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusOrder extends Model
{
    /** @use HasFactory<\Database\Factories\StatusOrderFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'color',
        "public_status_code",
        "code",
        "description",
        "public_status_id",
    ];
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
