<?php
namespace App\Http\Resources\Admin;



use Illuminate\Http\Request;
use App\Http\Resources\Admin\OrderResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'birthday' => $this->birthday,
            'phone' => $this->phone,
            'gender' => $this->gender,
            // 'role'     => $this->role,
            'is_ban' => $this->is_ban,
            'orders' => OrderResource::collection($this->whenLoaded('orders')),

        ];
    }
}
