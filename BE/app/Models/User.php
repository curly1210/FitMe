<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use function Psy\sh;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;


    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'birthday',
        'phone',
        'gender',
        'is_ban',

    ];
    public function shippingAddress()
    {
        return $this->hasMany(shippingAddress::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
}
