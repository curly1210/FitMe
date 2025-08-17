<?php

namespace App\Http\Controllers\api\Admin;

use App\Events\OrderStatusUpdated;
use App\Models\User;
use App\Models\Order;
use App\Models\ProductItem;
use App\Models\OrdersDetail;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminOrderResource;
use App\Http\Resources\Admin\AdminOrderDetailResource;
use App\Traits\ApiResponse;

class OrderController extends Controller
{
    private $statusMap = [
        1 => ['label' => 'Chờ xác nhận', 'color' => '#6c757d'],
        2 => ['label' => 'Đang chuẩn bị hàng', 'color' => '#0d6efd'],
        3 => ['label' => 'Đang giao hàng', 'color' => '#ffc107'],
        4 => ['label' => 'Đã giao hàng', 'color' => '#ffc107'],
        5 => ['label' => 'Giao hàng thất bại', 'color' => '#d47190ff'],
        6 => ['label' => 'Hoàn thành', 'color' => '#0dcaf0'],
        7 => ['label' => 'Đã hủy', 'color' => '#dc3545'],
    ];

    use ApiResponse;

    public function index(Request $request)
    {
        $query = Order::with('user')
            ->when($request->has('search'), function ($q) use ($request) {
                $q->where(function ($query) use ($request) {
                    $query->whereHas('user', function ($uq) use ($request) {
                        $uq->where('name', 'like', '%' . $request->search . '%');
                    })->orWhere('orders_code', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->filled('status_order_id'), function ($q) use ($request) {
                $q->where('status_order_id', $request->status_order_id);
            })
            ->when($request->filled('status_payment'), function ($q) use ($request) {
                $q->where('status_payment', $request->status_payment);
            })
            ->when($request->filled('from') && $request->filled('to'), function ($q) use ($request) {
                $q->whereBetween('created_at', [
                    $request->from . ' 00:00:00',
                    $request->to . ' 23:59:59'
                ]);
            })
            ->when($request->filled('date'), function ($q) use ($request) {
                $q->whereDate('created_at', $request->date);
            })
            ->orderBy('created_at', 'desc');

        $orders = $query->get();

        return AdminOrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'statusOrder', 'orderDetails'])->findOrFail($id);

        return response()->json([
            'order_code' => $order->orders_code,
            'customer_name' => $order->user->name,
            'customer_email' => $order->user->email,
            'customer_phone' => $order->user->phone,
            'status' => [
                'id' => $order->statusOrder->id,
                'label' => $order->statusOrder->name,
                'color' => $order->statusOrder->color,
            ],
            'created_at' => $order->created_at->format('d/m/Y H:i'),
            'receiving_name' => $order->recipient_name,
            'receiving_address' => $order->receiving_address,
            'recipient_phone' => $order->recipient_phone,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->status_payment,
            'total_price_item' => $order->total_price_item,
            'shipping_price' => $order->shipping_price,
            'discount' => $order->discount,
            'total_amount' => $order->total_amount,
            'order_details' => AdminOrderDetailResource::collection($order->orderDetails)
        ]);
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_order_id' => 'required|integer|min:1|max:7',
        ]);

        $order = Order::with('orderDetails')->findOrFail($id);
        $newStatus = (int) $request->status_order_id;

        $currentStatus = $order->status_order_id;

        // Đơn hàng đã hủy
        if ($currentStatus === 7) {
            return $this->error('Thao tác không hợp lệ hoặc trạng thái không cho phép thay đổi.', [], 400);
        }

        if ($newStatus === 4) {
            $order->status_payment = 1;
            $order->paid_at = now();
        }
        if ($newStatus === 6) {
            $order->success_at = Carbon::now();
        } elseif ($newStatus === 7) {
            $order->success_at = null;
        }
        if ($newStatus === 7 && $order->status_order_id != 7) {
            if ($order->payment_method == "vnpay") {
                $order->update(['status_payment' => 2]); # Chờ hoàn tiền
            }
            foreach ($order->orderDetails as $detail) {
                ProductItem::where('id', $detail->product_item_id)
                    ->increment('stock', $detail->quantity);
            }
        }

        $order->status_order_id = $newStatus;
        $order->save();

        $message = match ($newStatus) {
            1 => 'đang chờ xác nhận.',
            2 => 'đang được chuẩn bị.',
            3 => 'đang được giao.',
            4 => 'đã được giao.',
            5 => 'giao hàng thất bại.',
            6 => 'đã hoàn thành.',
            7 => 'đã bị hủy',
            default => 'Cập nhật trạng thái đơn hàng thành công.',
        };
        // Gửi Notification (lưu DB + broadcast qua Pusher) cho chủ đơn hàng
        if ($order->user) {
            $order->user->notify(new OrderStatusNotification($order->user_id, $order->orders_code, $newStatus, $message));
        }

        return response()->json(['message' => $message]);
    }
}
