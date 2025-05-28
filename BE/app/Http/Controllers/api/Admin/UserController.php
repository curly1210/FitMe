<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\UserResource;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;
    //Hàm sử lý hiển thị danh sách người dùng
    public function index(Request $request)
    {
        $query = User::query()
            ->where('role', '!=', 'admin'); // Ẩn tài khoản admin

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('is_ban')) {
            $query->where('is_ban', $request->is_ban);
        }

        $users = $query->paginate(10);

        return UserResource::collection($users);
    }

    // Xem chi tiết người dùng + đơn hàng
    public function show($id)
    {
        $user = User::with('orders')->findOrFail($id);

        return new UserResource($user);
    }


    // Cập nhật thông tin người dùng
    public function lock(Request $request, $id)
    {
        $request->validate([
            'is_ban' => 'required|in:0,1',
        ]);

        $user = User::findOrFail($id);

        if ((int) $user->is_ban) {
            $message = $request->is_ban == 1 ? 'Tài khoản đã bị khóa trước đó' : 'Tài khoản đang hoạt động, không cần mở khóa';
            return $this->error($message, [], 409);
        }

        $user->is_ban = $request->is_ban;
        $user->save();

        $message = $request->is_ban == 1 ? 'Tài khoản đã bị khóa' : 'Tài khoản đã được mở khóa';
        return $this->success(null, $message);
    }
}
