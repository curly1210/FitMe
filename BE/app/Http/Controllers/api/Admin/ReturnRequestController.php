<?php

namespace App\Http\Controllers\api\Admin;

use App\Models\ReturnFile;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\ReturnRequest;
use App\Traits\CloudinaryTrait;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Client\ReturnRequestResource;

class ReturnRequestController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index(Request $request)
    {
        //lọc theo trạng thái (status) và lọc theo mã đơn - orders_code  (search)
        $search = $request->search ?? '';
        $allowedStatus = ['pending', 'accept', 'reject', 'returning', 'return_complete', 'cancel'];

        $query = ReturnRequest::with(['order'])->whereHas('order', function ($q) use ($search) {
            $q->where('orders_code', 'like', "%" . $search . "%");
        })->orderBy('id', 'desc');

        if ($request->status && in_array($request->status, $allowedStatus, true)) {
            $query->where('status', $request->status);
        }
        $data = $query->paginate(8);
        // return response()->json($data);
        return ReturnRequestResource::collection($data);
    }
    /* $id => id của request */
    public function changeStatus($id, Request $request)
    {
        $returnRequest = ReturnRequest::find($id);
        if (!$returnRequest) {
            return $this->error("Yêu cầu hoàn hàng không tồn tại", [], 404);
        }
        switch ($request->status) {
            //Trường hợp hoàn hàng thành công và chuyển tiền về ví
            case 'return_complete':
                try {
                    if ($returnRequest->status != 'returning') {
                        return $this->error("Trạng thái hiện tại không hợp lệ", [], 422);
                    }
                    $user = $returnRequest->order->user;
                    $wallet = $user->wallet;
                    // dd($user);
                    $total_return = collect($returnRequest->returnItems)->sum(function ($item) {
                        return $item->quantity * $item->price;
                    });
                    $wallet->update([
                        'balance' => $wallet->balance + $total_return,
                    ]);
                    WalletTransaction::create([
                        "wallet_id" => $wallet->id,
                        "amount" => $total_return,
                        'type' => "refund",
                    ]);
                    $returnRequest->update([
                        'status' => $request->status
                    ]);
                    return response()->json(["message" => "Chuyển trạng thái thành công"]);
                } catch (\Throwable $th) {
                    return $this->error("Chuyển trạng thái thất bại", $th->getMessage(), 400);
                }
                break;
            //Trường hợp hoàn hàng thất bại
            case 'return_fail':
                $validator = Validator::make(
                    $request->only(['admin_note', "media_files", "video_file"]),
                    [
                        'admin_note' => 'required|string|max:255',
                        'media_files' => 'required|array',
                        'media_files.*' => 'file|mimes:jpg,jpeg,png,webp|max:2048',
                        'video_file' => 'nullable|file|mimes:mp4,avi,mpeg,mov|max:51200'
                    ],
                    [
                        'admin_note.required' => 'Vui lòng nhập ghi chú của quản trị viên.',
                        'admin_note.max' => 'Ghi chú của quản trị viên không được vượt quá 255 ký tự.',
                        'media_files.required' => 'Vui lòng tải lên ít nhất một ảnh minh chứng.',
                        'media_files.*.file' => 'Tệp tải lên phải là tệp hợp lệ.',
                        'media_files.*.mimes' => 'Tệp tải lên phải có định dạng jpg, jpeg, png hoặc webp.',
                        'media_files.*.max' => 'Kích thước tệp không được vượt quá 2MB.',
                        'video_file.mimes' => 'Video phải có định dạng mp4, avi, mpeg hoặc mov.',
                        'video_file.max' => 'Kích thước video không được vượt quá 50MB.'
                    ]
                );
                if ($validator->fails()) {
                    return $this->error("Dữ liệu không hợp lệ", $validator->errors(), 422);
                }
                if ($returnRequest->status != 'returning') {
                    return $this->error("Trạng thái hiện tại không hợp lệ", [], 422);
                }
                try {
                    DB::beginTransaction();
                    $media_urls = [];
                    $video_file = $request->video_file ?? null;
                    $video_url = null;
                    if ($video_file) {
                        $video_url = $this->uploadVideoToCloudinary($video_file, 'return_requests_video');
                    }
                    foreach ($request->media_files as $file) {
                        $uploadFile = $this->uploadImageToCloudinary($file, ['folder' => 'return_image_' . strtolower('Admin')]);
                        $media_urls[] = $uploadFile['public_id'];
                    }
                    // dd($media_urls);

                    if (empty($media_urls)) {
                        return $this->error('Tải ảnh minh chứng thất bại', [], 422);
                    }
                    $returnRequest->update([
                        'status' => $request->status,
                        "admin_note" => $request->admin_note,
                    ]);
                    if ($video_url != null) {
                        ReturnFile::create([
                            'url' => $video_url['public_id'],
                            'return_request_id' => $returnRequest->id,
                            'media_type' => "video",
                            'upload_by' => 'Admin',
                        ]);
                    }
                    // return response()->json($media_urls);
                    // Tạo bản ghi hình ảnh
                    foreach ($media_urls as $media_url) {
                        ReturnFile::create([
                            'url' => $media_url,
                            'return_request_id' => $returnRequest->id,
                            'media_type' => "image",
                            'upload_by' => 'Admin',
                        ]);
                    }
                    DB::commit();
                } catch (\Throwable $th) {
                    return $this->error("Chuyển trạng thái thất bại", $th->getMessage(), 400);
                }
                break;
        }
        return response()->json(['message' => "Chuyển trạng thái thành công"]);
    }
    /* $id => id của request */
    public function rejectRequest($id, Request $request)
    {
        $validator = Validator::make(
            $request->only(['admin_note']),
            [
                'admin_note' => 'required|string|max:255',

            ],
            [
                'admin_note.required' => 'Vui lòng nhập ghi chú của quản trị viên.',
                'admin_note.max' => 'Ghi chú của quản trị viên không được vượt quá 255 ký tự.',
            ]
        );
        if ($validator->fails()) {
            return $this->error("Dữ liệu không hợp lệ", $validator->errors(), 422);
        }

        $returnRequest = ReturnRequest::find($id);
        if (!$returnRequest) {
            return $this->error("Yêu cầu hoàn hàng không tồn tại", [], 404);
        }
        if ($returnRequest->status != "pending") {
            return $this->error("Trạng thái yêu cầu không thể thực hiện từ chối", [], 422);
        }
        $returnRequest->update([
            'admin_note' => $request->admin_note,
            "status" => "reject",
        ]);
        return response()->json(['message' => "Yêu cầu đã bị từ chối"]);
    }

    /* $id => id của request */
    public function acceptRequest($id, Request $request)
    {
        $returnRequest = ReturnRequest::find($id);
        if (!$returnRequest) {
            return $this->error("Yêu cầu không tồn tại", [], 404);
        }
        if ($returnRequest->status != "pending") {
            return $this->error("Trạng thái yêu cầu không thể thực hiện từ chối", [], 422);
        }
        $returnRequest->update([
            'status' => 'accept',
            'accepted_at' => now(),
        ]);
        return response()->json(['message' => "Yêu cầu đã được chấp nhận"]);
    }
    public function show($id, Request $request)
    {
        $returnRequest = ReturnRequest::with('returnFiles')->find($id);

        if (!$returnRequest) {
            return $this->error("Yêu cầu không tồn tại", [], 404);
        }

        $clientImageFiles = $returnRequest->returnFiles->where('media_type', "like", 'image')->where('upload_by', 'like', 'Customer')->values();
        $clientVideoFiles = $returnRequest->returnFiles->where('media_type', 'like', 'video')->where('upload_by', 'like', 'Customer')->values();
        $AdminImageFiles = $returnRequest->returnFiles->where('media_type', "like", 'image')->where('upload_by', 'like', 'Admin')->values();
        $AdminVideoFiles = $returnRequest->returnFiles->where('media_type', 'like', 'video')->where('upload_by', 'like', 'Admin')->values();
        $order = $returnRequest->order;
        $data = [
            "order_code" => $order->orders_code,
            "user_info" => [
                "email" => $order->user->email,
                "phone" => $order->user->phone,
                "name" => $order->user->name,
            ],
            "client_media_files" => [
                "image" => $clientImageFiles->map(function ($file) {
                    return $this->buildImageUrl($file->url);
                }) ?? [],
                "video" => $clientVideoFiles->map(function ($file) {
                    return $this->buildVideoUrl($file->url);
                }) ?? [],
            ],
            "admin_media_files" => [
                "image" => $AdminImageFiles->map(function ($file) {
                    return $this->buildImageUrl($file->url);
                }) ?? [],
                "video" => $AdminVideoFiles->map(function ($file) {
                    return $this->buildVideoUrl($file->url);
                }) ?? [],
            ],
            "items" => $returnRequest->returnItems->map(function ($item) {
                return [
                    "id" => $item->id,
                    "return_request_id" => $item->return_request_id,
                    "order_detail_id" => $item->order_detail_id,
                    "image" => $this->buildImageUrl($item->orderDetail->image_product),
                    "price" => $item->price,
                ];
            }),
            "reason" => $returnRequest->reason,
            "shipping_label_image" => $returnRequest->shipping_label_image != null ? $this->buildImageUrl($returnRequest->shipping_label_image) : null,
            "admin_note" => $returnRequest->admin_note,
            "type" => $returnRequest->type,
            "status" => $returnRequest->status,
            "created_at" => $returnRequest->created_at->timezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s'),
            "updated_at" => $returnRequest->updated_at->timezone('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s'),
        ];
        return response()->json($data);
    }
}
