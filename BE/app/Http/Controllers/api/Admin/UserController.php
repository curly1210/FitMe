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
            ->where('role', '!=', 'admin');

        if ($request->filled('search')) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%');
            });
        }

        if (!is_null($request->is_ban)) {
            $query->where('is_ban', $request->is_ban);
        }

        $users = $query->get();

        return UserResource::collection($users);
    }

    public function show($id)
    {
        $user = User::with('orders')->findOrFail($id);

        return new UserResource($user);
    }


    public function lock($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->is_ban = $user->is_ban == 1 ? 0 : 1;
            $user->save();

            return $this->success(null, $user->is_ban ? 'Đã khóa người dùng' : 'Đã mở khóa người dùng');
        } catch (\Exception $e) {
            return $this->error('Không thể cập nhật trạng thái người dùng', [$e->getMessage()], 500);
        }
    }

}
