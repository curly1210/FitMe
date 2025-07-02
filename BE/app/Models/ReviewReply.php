<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewReply extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewReplyFactory> */
    use HasFactory;
    protected $fillable = [
        'content',
        'review_id',
        'user_id',
    ];
    public function review()
    {
        return $this->belongsTo(Review::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
