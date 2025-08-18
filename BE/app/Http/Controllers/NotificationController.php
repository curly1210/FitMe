<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $user = $request->user();

            $notificationsQuery = $user->notifications()->latest();

            $notifications = $notificationsQuery->paginate($perPage);


            // Paginate
            return response()->json([
                'notifications' => $notifications->items(),       // danh sách notifications
                'current_page' => $notifications->currentPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'last_page' => $notifications->lastPage(),
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Token hết hạn'], 403);
        }

    }
    // Lấy tất cả thông báo của user hiện tại
    public function listUnread(Request $request)
    {
        try {
            $user = $request->user();
            // return response()->json($user);
            return response()->json([
                'unread_count' => $user->unreadNotifications->count(), // số thông báo chưa đọc
                'notifications' => $user->unreadNotifications // tất cả thông báo
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Token hết hạn'], 403);
        }

    }
    // đánh dấu đã đọc
    public function markAsRead(Request $request, $id)
    {
        try {
            $user = $request->user();

            $notification = $user->notifications()->where('id', $id)->first();

            if ($notification) {
                $notification->markAsRead();
                return response()->json(['message' => 'Thông báo đã được đánh dấu là đã đọc']);
            }

            return response()->json(['message' => 'Không tìm thấy thông báo'], 404);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Token hết hạn'], 403);
        }

    }

    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();

            $user->unreadNotifications->markAsRead();

            return response()->json(['message' => 'Tất cả thông báo đã được đánh dấu là đã đọc']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Token hết hạn'], 403);
        }

    }
}
