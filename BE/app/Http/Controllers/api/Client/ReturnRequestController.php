<?php

namespace App\Http\Controllers\api\Client;

use App\Models\Order;
use App\Models\ReturnFile;
use App\Models\ReturnItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\ReturnRequest;
use App\Traits\CloudinaryTrait;
use App\Models\WalletTransaction;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use function PHPUnit\Framework\isEmpty;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\Client\ReturnRequestResource;

class ReturnRequestController extends Controller
{
    use ApiResponse, CloudinaryTrait;
    public function index(Request $request)
    {
        $user = $request->user();
        $search = $request->search ?? '';
        $allowedStatus = ['pending', 'accept', 'reject', 'returning', 'return_complete', 'cancel'];
        if (!$user) {
            return $this->error("Người dùng chưa đăng nhập", [], 403);
        }

        $query = ReturnRequest::with(['order'])->whereHas('order', function ($q) use ($search, $user) {
            $q->where('orders_code', 'like', "%" . $search . "%")->where('user_id', "=", $user->id);
        })->orderBy('id', 'desc');

        if ($request->status && in_array($request->status, $allowedStatus, true)) {
            $query->where('status', $request->status);
        }
        $data = $query->paginate(8);
        // return response()->json($data);
        return ReturnRequestResource::collection($data);
    }
    public function show($id, Request $request)
    {
        $returnRequest = ReturnRequest::with('returnFiles')->find($id);
        $user = $request->user();
        if (!$user) {
            return $this->error("Người dùng chưa đăng nhập", [], 403);
        }
        if (!$returnRequest) {
            return $this->error("Yêu cầu không tồn tại", [], 404);
        }
        if (!$returnRequest->order->user_id === $user->id) {
            return $this->error("Yêu cầu không tồn tại", [], 404);
        }
        $clientImageFiles = $returnRequest->returnFiles->where('media_type', "like", 'image')->where('upload_by', 'like', 'Customer')->values();
        $clientVideoFiles = $returnRequest->returnFiles->where('media_type', 'like', 'video')->where('upload_by', 'like', 'Customer')->values();
        $AdminImageFiles = $returnRequest->returnFiles->where('media_type', "like", 'image')->where('upload_by', 'like', 'Admin')->values();
        $AdminVideoFiles = $returnRequest->returnFiles->where('media_type', 'like', 'video')->where('upload_by', 'like', 'Admin')->values();
        $data = [
            "order_code" => $returnRequest->order->orders_code,
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
    // check sự tồn tại của yêu cầu
    public function checkRequest($id, Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return $this->error("Người dùng chưa đăng nhập", [], 403);
        }
        $order = $user->orders()->find($id);
        if (!$order) {
            return $this->error("Đơn hàng không tồn tại", [], 404);
        }
        if ($order->returnRequest) {
            return response()->json([
                'can_create' => false,
                "message" => "Yêu cầu hoàn hàng đã tồn tại",
            ], 422);
        } else if ($order->status_order_id != 4) {
            return response()->json([
                'can_create' => false,
                "message" => "Trạng thái đơn hàng không hợp lệ",
            ], 422);
        } else {
            return response()->json([
                'can_create' => true,
                "message" => "Có thể tạo yêu cầu",
            ]);
        }
    }
    // Tạo yêu cầu
    public function store($id, Request $request)
    {

        $validator = Validator::make($request->only(['media_files', 'reason', 'type', 'items', 'video_file']), [
            'media_files' => 'required|array',
            'media_files.*' => 'required|file|mimes:jpg,jpeg,pn,webp|max:2048',
            'reason' => 'required|string|max:255',
            'type' => 'required|string|in:full,partial',
            'video_file' => 'nullable|file|mimes:mp4,avi,mpeg,mov|max:51200'

        ], [
            'media_files.required' => 'Vui lòng tải lên hình ảnh.',
            'media_files.array' => 'Hình ảnh không hợp lệ.',
            'media_files.*.required' => 'Hình ảnh minh chứng là bắt buộc.',

            'media_files.*.file' => 'Hình ảnh không hợp lệ.',
            'media_files.*.mimes' => 'Hình ảnh phải có định dạng: jpg, jpeg, png, webp.',
            'media_files.*.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
            'reason.required' => 'Vui lòng nhập lý do.',
            'reason.string' => 'Lý do không hợp lệ.',
            'reason.max' => 'Lý do không được vượt quá 255 ký tự.',
            'type.required' => 'Vui lòng chọn loại yêu cầu.',
            'type.string' => 'Loại yêu cầu không hợp lệ.',
            'type.in' => 'Loại yêu cầu không hợp lệ.',
            'video_file.file' => 'Video không hợp lệ.',
            'video_file.mimes' => 'Video phải có định dạng: mp4, avi, mpeg, mov.',
            'video_file.max' => 'Kích thước video không được vượt quá 50MB.'

        ]);
        if ($request->type == 'partial') {
            $validator->addRules([
                'items' => 'required|array',
                'items.*.id' => 'required|exists:orders_detail,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|integer|min:1',
            ]);
            $validator->setCustomMessages([
                'items.required' => 'Vui lòng chọn sản phẩm để trả.',
                'items.array' => 'Sản phẩm không hợp lệ.',
                'items.*.id.exists' => "sản phẩm không tồn tại trong đơn hàng",
                'items.*.quantity' => 'Số lượng không hợp lệ.',
                'items.*.price' => 'Giá không hợp lệ.',
                'items.*.quantity.required' => 'Số lượng là bắt buộc.',
                'items.*.price.required' => 'Giá là bắt buộc.',
            ]);
        }
        if ($validator->fails()) {
            return $this->error('Dữ liệu đầu vào không hợp lệ', $validator->errors(), 422);
        }
        $user = $request->user();
        if (!$user) {
            return $this->error("Người dùng chưa đăng nhập", [], 403);
        }
        $order = $user->orders()->find($id);
        // dd($order);
        if (!$order || $order->status_order_id != 4) {
            return $this->error('Tạo yêu cầu thất bại', ['Đơn hàng không tồn tại hoặc trạng thái đơn hàng không hợp lệ '], 422);
        }
        if ($order->returnRequest) {
            return $this->error('Tạo yêu cầu thất bại', ['Đơn hàng đã tồn tại yêu cầu'], 422);
        }
        if (!$user) {
            return $this->error('Người dùng chưa đăng nhập', [], 403);
        }
        try {
            DB::beginTransaction();
            // Upload ảnh
            $media_urls = [];
            $video_file = $request->video_file ?? null;
            $video_url = null;
            if ($video_file) {
                $video_url = $this->uploadVideoToCloudinary($video_file, 'return_requests_video');
            }
            foreach ($request->media_files as $file) {
                $uploadFile = $this->uploadImageToCloudinary($file, ['folder' => 'return_image_' . strtolower($user->role)]);
                $media_urls[] = $uploadFile['public_id'];
            }
            // dd($media_urls);

            if (empty($media_urls)) {
                return $this->error('Tải ảnh minh chứng thất bại', [], 422);
            }


            // Tạo yêu cầu
            $returnRequest = ReturnRequest::create([
                'order_id' => $id,
                'reason' => $request->reason,
                'type' => $request->type,
            ]);
            // return response()->json($returnRequest);
            if ($request->type == 'full') {
                $items = $order->orderDetails;
            } else {
                //kiểm tra sản phẩm vượt quá giới hạn hay không
                $orderDetailsMap = $order->orderDetails
                    ->mapWithKeys(function ($detail) {
                        return [$detail->id => $detail->quantity];
                    })
                    ->toArray();
                $requestedItems = collect($request->items);
                $invalidQuantities = [];
                foreach ($requestedItems as $item) {
                    $maxQty = $orderDetailsMap[$item['id']];
                    if ($item['quantity'] > $maxQty) {
                        $invalidQuantities[] = [
                            'id' => $item['id'],
                            'max_quantity' => $maxQty,
                            'requested_quantity' => $item['quantity']
                        ];
                    }
                }

                if (!empty($invalidQuantities)) {
                    return $this->error(
                        message: 'Số lượng yêu cầu vượt quá số lượng trong đơn hàng.',
                        errors: ['invalid_quantities' => $invalidQuantities],
                        code: 422
                    );
                }
                $items = $request->items;
            }

            foreach ($items as $item) {
                ReturnItem::create([
                    'return_request_id' => $returnRequest->id,
                    'order_detail_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['sale_price'],
                ]);
            }

            if ($video_url != null) {
                ReturnFile::create([
                    'url' => $video_url['public_id'],
                    'return_request_id' => $returnRequest->id,
                    'media_type' => "video",
                    'upload_by' => $user->role,
                ]);
            }
            // return response()->json($media_urls);
            // Tạo bản ghi hình ảnh
            foreach ($media_urls as $media_url) {
                ReturnFile::create([
                    'url' => $media_url,
                    'return_request_id' => $returnRequest->id,
                    'media_type' => "image",
                    'upload_by' => $user->role,
                ]);
            }
            DB::commit();
            return response()->json(['message' => "Tạo yêu cầu thành công"]);
        } catch (\Throwable $th) {
            return $this->error("Tạo yêu cầu thất bại", $th->getMessage(), 400);
        }
    }
    public function updateShippingLabel($id, Request $request)
    {
        $validator = Validator::make(
            $request->only('shipping_label_image'),
            [
                'shipping_label_image' => 'file|mimes:jpg,jpeg,pn,webp|max:2048'
            ],
            [
                'shipping_label_image.required' => 'Vui lòng tải lên hình ảnh nhãn vận chuyển.',
                'shipping_label_image.file' => 'Hình ảnh nhãn vận chuyển không hợp lệ.',
                'shipping_label_image.mimes' => 'Hình ảnh nhãn vận chuyển phải có định dạng jpg, jpeg, png, webp.',
                'shipping_label_image.max' => 'Hình ảnh nhãn vận chuyển không được vượt quá 2MB.',
            ]
        );
        if ($validator->fails()) {
            return $this->error("Dữ liệu không hợp lệ", $validator->errors(), 422);
        }
        try {
            $returnRequest = ReturnRequest::find($id);
            $user = $request->user();
            if (!$user) {
                return $this->error("Người dùng chưa đăng nhập", [], 403);
            }
            if (!$returnRequest) {
                return $this->error('Yêu cầu hoàn hàng không tồn tại', [], 404);
            }
            if (!$returnRequest->order->user_id === $user->id) {
                return $this->error("Yêu cầu không tồn tại", [], 404);
            }
            if ($returnRequest->status != "accept") {
                return $this->error('Trạng thái yêu cầu không hợp lệ để thực hiện hành động', [], 422);
            }
            $image = $this->uploadImageToCloudinary($request->shipping_label_image);
            if (!$image) {
                return $this->error('Tải ảnh minh chứng thất bại', [], 422);
            }
            $returnRequest->update([
                "shipping_label_image" => $image['public_id'],
                'status' => 'returning',
            ]);
            return response()->json("Gửi minh chứng thành công");
        } catch (\Throwable $th) {
            return $this->error("Tải ảnh minh chứng thất bại", $th->getMessage(), 400);
        }
    }
    public function cancelRequest($id, Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return $this->error("Người dùng chưa đăng nhập", [], 403);
        }
        $returnRequest = ReturnRequest::find($id);

        if (!$returnRequest) {
            return $this->error("Yêu cầu hoàn hàng không tồn tại", [], 404);
        }

        if ($returnRequest->status == "pending" || $returnRequest->status == "approve") {
            $returnRequest->update([
                "status" => "cancel",
            ]);
            return response()->json(['message' => "Hủy yêu cầu thành công"]);
        } else {
            return $this->error('Hủy yêu cầu thất bại', [], 422);
        };
    }
}
