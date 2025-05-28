<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Auth\UserResource;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10); // Số lượng user mỗi trang, mặc định 10
        $users = User::paginate($perPage);

        return $this->success([
            'users' => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'total_pages' => $users->lastPage(),
                'total_users' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ], 'Lấy danh sách users thành công', 200);
    }
}
