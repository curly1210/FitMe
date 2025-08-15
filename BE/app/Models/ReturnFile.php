<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnFile extends Model
{
    protected $fillable = [
        'url',
        'return_request_id',

        "media_type",
        'upload_by',
    ];
    public function returnRequest()
    {
        return $this->belongsTo(ReturnRequest::class);
    }
}
