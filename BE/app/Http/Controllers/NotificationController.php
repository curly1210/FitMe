<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Lấy tất cả thông báo của user hiện tại
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'unread_count' => $user->unreadNotifications->count(), // số thông báo chưa đọc
            'notifications' => $user->notifications // tất cả thông báo
        ]);
    }
    // đánh dấu đã đọc
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Thông báo đã được đánh dấu là đã đọc']);
        }

        return response()->json(['message' => 'Không tìm thấy thông báo'], 404);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Tất cả thông báo đã được đánh dấu là đã đọc']);
    }

}
