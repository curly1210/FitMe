<?php

namespace App\Http\Resources\Client;

use App\Traits\CloudinaryTrait;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    use CloudinaryTrait;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Tùy chỉnh email: chỉ hiển thị chữ cái đầu, ẩn các ký tự trước @ bằng *
        $email = $this->email;
        if ($email) {
            $parts = explode('@', $email);
            if (count($parts) === 2) {
                $localPart = $parts[0];
                $domainPart = $parts[1];
                $hiddenLocalPart = substr($localPart, 0, 1) . str_repeat('*', max(0, strlen($localPart) - 1));
                $email = $hiddenLocalPart . '@' . $domainPart;
            }
        }
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $email,
            'password' => '********',
            'avatar' => $this->buildImageUrl($this->avatar),
            'birthday' => $this->birthday,
            'phone' => $this->phone,
            'gender' => $this->gender,
        ];
    }
}
