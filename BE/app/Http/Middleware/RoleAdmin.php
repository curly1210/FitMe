<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class RoleAdmin
{
    use ApiResponse;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return $this->error('Không tìm thấy người dùng', [], 401);
            }

            if ($user->is_ban) {
                return $this->error('Tài khoản của bạn đã bị cấm', [], 403);
            }

            if ($user->role !== 'Admin') {
                return $this->error('Bạn không có quyền truy cập (chỉ dành cho admin)', [], 403);
            }

            return $next($request);
        } catch (\Exception $e) {
            return $this->error('Token không hợp lệ', [$e], 401);
        }
    }
}
