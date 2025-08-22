<?php

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use App\Models\MemberPoint;
use App\Traits\ApiResponse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\PasswordReset;
use App\Mail\ResetPasswordMail;
use App\Mail\ActivateAccountMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTFactory;
use App\Http\Resources\Auth\UserResource;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$accessToken = JWTAuth::attempt($credentials)) {
            return $this->error('Thông tin đăng nhập không chính xác', [], 402,);
        }

        $user = JWTAuth::user(); // Lấy thông tin user từ JWT
        // $refreshToken = JWTAuth::claims(['type' => 'refresh'])->fromUser($user); // Sử dụng TTL từ config/jwt.php

        if (!$user->is_active) {
            // Huỷ token đã cấp (nếu có) để đảm bảo không dùng được
            JWTAuth::setToken($accessToken)->invalidate();

            return $this->error('Tài khoản của bạn chưa được kích hoạt', ['email'   => $user->email,], 400);
        }

        if ($user->is_ban) {
            // Huỷ token đã cấp (nếu có) để đảm bảo không dùng được
            JWTAuth::setToken($accessToken)->invalidate();

            return $this->error('Tài khoản của bạn đã bị ban', [], 500);
        }

        $payload = JWTFactory::customClaims(['type' => 'refresh'])
            ->setTTL(config('jwt.refresh_ttl'))
            ->make();

        $refreshToken = JWTAuth::encode($payload)->get();

        $lastestOrder = $user->orders()->where('status_order_id', '=', 6)->latest()->first() ?? null;
        if ($lastestOrder && now()->diffInDays($lastestOrder->created_at, true) > 180) {
            $memberPoint = MemberPoint::where('user_id', '=', $user->id)->first();
            if (!$memberPoint->last_rank_deduction_at || $memberPoint->last_rank_deduction_at < $lastestOrder->created_at) {
                switch ($memberPoint->rank) {
                    case "diamond":
                        $memberPoint->update(['point' => 500, 'rank' => 'gold', 'value' => 5]);
                        break;
                    case "gold":
                        $memberPoint->update(['point' => 200, 'rank' => 'silver', 'value' => 3]);
                        break;
                    case "silver":
                        $memberPoint->update(['point' => 0, 'rank' => 'bronze', 'value' => 0]);
                        break;
                    case "bronze":
                        break;
                }
                $memberPoint->last_rank_deduction_at = now();
                $memberPoint->save();
            }
        }


        return $this->success([

            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60, // Tính bằng giây
            'user' => new UserResource($user),
        ], 'Đăng nhập thành công', 200)->cookie(
            'refresh_token',
            $refreshToken,
            // $refreshTtl,
            (int) config('jwt.refresh_ttl'), // Thời gian sống của cookie (phút)
            '/',
            null,
            false, // Secure
            true, // HttpOnly
            false, // Raw
            'Lax' // SameSite
        );
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users,email',
                'phone' => 'required|unique:users,phone',
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:6',
                'avatar' => 'nullable|string',
            ], [
                'email.unique' => 'Email đã được sử dụng.',
                'phone.unique' => 'Số điện thoại đã được sử dụng.',
                'email.required' => 'Email là bắt buộc.',
                'email.email' => 'Email không hợp lệ.',
                'phone.required' => 'Số điện thoại là bắt buộc.',
                'name.required' => 'Tên là bắt buộc.',
                'password.required' => 'Mật khẩu là bắt buộc.',
                'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            ]);
        } catch (ValidationException $e) {
            return $this->error('Có lỗi xảy ra khi xác thực dữ liệu', $e->errors(), 422);
        }


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'is_active' => 1
        ]);
        MemberPoint::create(['user_id' => $user->id]);

        PasswordReset::where('user_id', $user->id)->delete();

        $rawToken = Str::random(60) . $user->id;
        $hashedToken = hash('sha256', $rawToken);

        PasswordReset::create([
            'user_id' => $user->id,
            'token' => $hashedToken,
            'expires_at' => now()->addMinutes(15),
        ]);

        $resetUrl = 'http://localhost:5173/verify-email?token=' . $rawToken;

        // Khoong gui mail (test)
        // Mail::to($user->email)->send(new ActivateAccountMail($resetUrl));


        return $this->success(new UserResource($user), 'Đăng ký thành công', 201);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return $this->error('Không tìm thấy refresh token', [], 401);
        }

        try {
            JWTAuth::setToken($refreshToken);
            $payload = JWTAuth::getPayload();

            if ($payload->get('type') !== 'refresh') {
                return $this->error('Loại token không hợp lệ', [], 401);
            }

            $user = JWTAuth::toUser($refreshToken);
            $newAccessToken = JWTAuth::fromUser($user);

            $lastestOrder = $user->orders()->where('status_order_id', '=', 6)->latest()->first() ?? null;
            if ($lastestOrder && now()->diffInDays($lastestOrder->created_at, true) > 180) {
                $memberPoint = MemberPoint::where('user_id', '=', $user->id)->first();
                if (!$memberPoint->last_rank_deduction_at || $memberPoint->last_rank_deduction_at < $lastestOrder->created_at) {
                    switch ($memberPoint->rank) {
                        case "diamond":
                            $memberPoint->update(['point' => 500, 'rank' => 'gold', 'value' => 5]);
                            break;
                        case "gold":
                            $memberPoint->update(['point' => 200, 'rank' => 'silver', 'value' => 3]);
                            break;
                        case "silver":
                            $memberPoint->update(['point' => 0, 'rank' => 'bronze', 'value' => 0]);
                            break;
                        case "bronze":
                            break;
                    }
                    $memberPoint->last_rank_deduction_at = now();
                    $memberPoint->save();
                }
            }

            return $this->success([
                'access_token' => $newAccessToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60, // Tính bằng giây
                'user' => new UserResource($user),
            ], 'Làm mới token thành công', 200);
        } catch (\Exception $e) {
            return $this->error('Refresh token không hợp lệ', [], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Lấy token từ request
            $token = JWTAuth::getToken();
            if (!$token) {
                return $this->error('Không tìm thấy token để đăng xuất. Vui lòng kiểm tra lại.', [], 400)
                    ->cookie('refresh_token', '', -1, '/', null, false, true, false, 'Lax');
            }

            // Vô hiệu hóa token
            try {
                JWTAuth::invalidate($token);
            } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
                // Token đã hết hạn, vẫn coi như đăng xuất thành công vì token không còn hợp lệ
                return $this->success([], 'Đăng xuất thành công.', 200)
                    ->cookie('refresh_token', '', -1, '/', null, false, true, false, 'Lax');
            } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
                // Token không hợp lệ
                return $this->error('Token không hợp lệ. Vui lòng kiểm tra lại.', ['message' => $e->getMessage()], 401)
                    ->cookie('refresh_token', '', -1, '/', null, false, true, false, 'Lax');
            }

            // Trả về phản hồi thành công và xóa cookie refresh_token
            return $this->success([], 'Đăng xuất thành công.', 200)
                ->cookie('refresh_token', '', -1, '/', null, false, true, false, 'Lax');
        } catch (\Throwable $th) {
            // Bắt các lỗi khác (nếu có)
            return $this->error('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại sau.', ['message' => $th->getMessage()], 500)
                ->cookie('refresh_token', '', -1, '/', null, false, true, false, 'Lax');
        }
    }

    public function activeAccount(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $hashedToken = hash('sha256', $request->token);

        $reset = PasswordReset::where('token', $hashedToken)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$reset) {
            return response()->json(['message' => 'Link không hợp lệ hoặc đã hết hạn.'], 400);
        }

        $user = User::where('id', $reset->user_id)->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng.'], 404);
        }

        $user->is_active = 1;
        $user->save();

        $reset->used = true;
        $reset->save();

        return response()->json(['message' => 'Tài khoản đã được kích hoạt thành công!'], 200);
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.exists' => 'Email không tồn tại trong hệ thống.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return $this->error('Không tìm thấy người dùng với email này.', [], 404);
        }

        $rawToken = Str::random(60) . $user->id;
        $hashedToken = hash('sha256', $rawToken);

        PasswordReset::updateOrCreate(
            ['user_id' => $user->id, 'used' => false],
            ['token' => $hashedToken, 'expires_at' => now()->addMinutes(15)]
        );

        $resetUrl = 'http://localhost:5173/verify-email?token=' . $rawToken;

        Mail::to($user->email)->send(new ActivateAccountMail($resetUrl));

        return $this->success([], 'Đã gửi liên kết kích hoạt tài khoản đến email của bạn.', 200);
    }
}
