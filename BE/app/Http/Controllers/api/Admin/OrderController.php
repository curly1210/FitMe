<?php
namespace App\Http\Controllers\api\Admin;

use App\Models\User;
use App\Models\Order;

use App\Models\OrdersDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminOrderResource;
use App\Http\Resources\Admin\AdminOrderDetailResource;

class OrderController extends Controller
{
    private $statusMap = [
        1 => ['label' => 'Chờ xác nhận', 'color' => '#6c757d'],
        2 => ['label' => 'Đang chuẩn bị hàng', 'color' => '#0d6efd'],
        3 => ['label' => 'Đang giao hàng', 'color' => '#ffc107'],
        4 => ['label' => 'Đã giao hàng', 'color' => '#ffc107'],
        5 => ['label' => 'Giao hàng thất bại', 'color' => '#198754'],
        6 => ['label' => 'Hoàn thành', 'color' => '#0dcaf0'],
        7 => ['label' => 'Đã hủy', 'color' => '#dc3545'],
    ];

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
            ->orderBy('created_at', 'desc'); // 👉 Sắp xếp mới nhất lên đầu

        $orders = $query->get();

        return AdminOrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'statusOrder', 'orderDetails'])->findOrFail($id);

        return response()->json([
            'order_code' => $order->orders_code,
            'customer_name' => $order->user->name,
            'status' => $order->statusOrder->name,
            'created_at' => $order->created_at->format('d/m/Y H:i'),
            'receiving_address' => $order->receiving_address,
            'recipient_phone' => $order->recipient_phone,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->status_payment ? 'Đã thanh toán' : 'Chưa thanh toán',
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

        if ($newStatus === 4) {
            $order->status_payment = 1;
        }

        if ($newStatus === 7 && $order->status_order_id != 7) {
            foreach ($order->orderDetails as $detail) {
                \App\Models\ProductItem::where('id', $detail->product_item_id)
                    ->increment('stock', $detail->quantity);
            }
        }

        $order->status_order_id = $newStatus;
        $order->save();

        $message = match ($newStatus) {
            1 => 'Đơn hàng đã được chuyển sang trạng thái: Chờ xác nhận.',
            2 => 'Đơn hàng đang được chuẩn bị.',
            3 => 'Đơn hàng đang được giao.',
            4 => 'Đơn hàng đã được giao.',
            5 => 'Giao hàng thất bại.',
            6 => 'Đơn hàng đã hoàn thành.',
            7 => 'Đơn hàng đã bị hủy và số lượng đã được hoàn lại kho.',
            default => 'Cập nhật trạng thái đơn hàng thành công.',
        };

        return response()->json(['message' => $message]);
    }



}
