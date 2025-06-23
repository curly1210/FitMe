<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\Order;
use Carbon\CarbonPeriod;
use App\Models\ProductItem;
use App\Models\OrdersDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OverviewStatisticResource;
use App\Http\Resources\Admin\RevenueStatisticsResource;

class StatisticsController extends Controller
{
    //
    public function overview()
    {
        $totalOrders = Order::count();

        $totalSellingProducts = ProductItem::where('stock', '>', 0)
            ->where('is_active', 1)
            ->count();

        $totalCustomers = User::where('role', 'Customer')->count();

        $ordersByStatus = Order::selectRaw('status_order_id, COUNT(*) as count')
            ->groupBy('status_order_id')
            ->pluck('count', 'status_order_id');

        $allStatuses = collect(range(0, 6))->mapWithKeys(function ($status) use ($ordersByStatus) {
            return [$status => $ordersByStatus[$status] ?? 0];
        });

        $totalRevenue = Order::where('status_order_id', 6)->sum('total_amount');

        $data = [
            'total_orders' => $totalOrders,
            'total_selling_products' => $totalSellingProducts,
            'total_customers' => $totalCustomers,
            'total_sold' => $totalRevenue,
            'orders_by_status' => $allStatuses,
        ];

        return new OverviewStatisticResource($data);
    }


    public function statistics(Request $request)
    {
        $now = now();
        $year = $request->year ?? $now->year;
        $month = $request->month ?? $now->month;

        // Doanh thu theo 12 tháng
        $yearly = collect(range(1, 12))->mapWithKeys(function ($m) use ($year) {
            $start = now()->setDate($year, $m, 1)->startOfMonth();
            $end = now()->setDate($year, $m, 1)->endOfMonth();

            $total = Order::where('status_order_id', 6)
                ->whereBetween('created_at', [$start, $end])
                ->sum('total_amount');

            return [$m => $total];
        });

        // Doanh thu theo ngày của tháng
        $daysInMonth = now()->setDate($year, $month, 1)->daysInMonth;

        $monthly = collect(range(1, $daysInMonth))->mapWithKeys(function ($d) use ($year, $month) {
            $start = now()->setDate($year, $month, $d)->startOfDay();
            $end = now()->setDate($year, $month, $d)->endOfDay();

            $total = Order::where('status_order_id', 6)
                ->whereBetween('created_at', [$start, $end])
                ->sum('total_amount');

            return [$d => $total];
        });

        // Doanh thu gần đây
        $recentDays = [7, 14, 30];
        $recent = [];

        foreach ($recentDays as $dayCount) {
            $from = now()->copy()->subDays($dayCount - 1)->startOfDay();

            $recent[$dayCount] = collect(range(0, $dayCount - 1))->mapWithKeys(function ($offset) use ($from) {
                $date = $from->copy()->addDays($offset);
                $total = Order::where('status_order_id', 6)
                    ->whereDate('created_at', $date)
                    ->sum('total_amount');

                return [$date->format('Y-m-d') => $total];
            });
        }

        return response()->json([
            'yearly' => [
                'data' => $yearly,
                'total' => $yearly->sum(),
            ],
            'monthly' => [
                'data' => $monthly,
                'total' => $monthly->sum(),
            ],
            'recent' => collect($recent)->map(function ($data) {
                return [
                    'data' => $data,
                    'total' => collect($data)->sum(),
                ];
            }),
        ]);
    }


    public function topSellingProducts(Request $request)
    {
        $request->validate([
            'filter_by' => 'nullable|in:quantity,revenue', // lọc theo số lượng hoặc doanh thu
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);

        $filterBy = $request->input('filter_by', 'quantity'); // mặc định theo số lượng
        $from = $request->input('from', '2000-01-01');
        $to = $request->input('to', now()->toDateString());

        $query = OrdersDetail::select([
            'product_item_id',
            'name_product',
            'image_product',
            DB::raw('SUM(quantity) as total_quantity'),
            DB::raw('SUM(sale_price * quantity) as total_revenue')
        ])
            ->whereHas('order', function ($q) use ($from, $to) {
                $q->where('status_order_id', 6) // Chỉ lấy đơn đã hoàn thành
                    ->whereBetween('created_at', [$from, $to]);
            })
            ->groupBy('product_item_id', 'name_product', 'image_product')
            ->orderBy($filterBy === 'revenue' ? 'total_revenue' : 'total_quantity', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => $query
        ]);
    }


}
