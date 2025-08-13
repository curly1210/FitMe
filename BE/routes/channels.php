<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Đây là nơi bạn đăng ký các kênh broadcast cho ứng dụng của mình.
| Callback xác định quyền nghe kênh.
|
*/

// Private channel cho từng user
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('admin.notifications', function ($user) {
    // chỉ admin mới được vào kênh này
    return $user->role === 'Admin';
});

Broadcast::channel('orders.{orderId}', function ($user, $orderId) {
    // Chỉ cho phép user là chủ đơn hàng hoặc admin mới nghe được
    return (int) $user->id === (int) \App\Models\Order::find($orderId)->user_id
        || $user->is_admin;
});
