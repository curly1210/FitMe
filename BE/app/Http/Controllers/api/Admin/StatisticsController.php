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
use App\Http\Resources\Admin\CustomerStatisticsResource;

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

    public function customerStatistics(Request $request)
    {
        $now = now();
        $year = $request->year ?? $now->year;
        $month = $request->month ?? $now->month;

        $daysInMonth = now()->setDate($year, $month, 1)->daysInMonth;
        $monthly = collect(range(1, $daysInMonth))->mapWithKeys(function ($d) use ($year, $month) {
            $date = now()->setDate($year, $month, $d)->format('Y-m-d');

            $count = User::where('role', 'Customer')
                ->whereDate('created_at', $date)
                ->count();

            return [$d => $count];
        });

        $recentDays = [7, 14, 30];
        $recent = [];
        foreach ($recentDays as $days) {
            $from = now()->copy()->subDays($days - 1)->startOfDay();

            $recent[$days] = collect(range(0, $days - 1))->mapWithKeys(function ($offset) use ($from) {
                $date = $from->copy()->addDays($offset);
                $count = User::where('role', 'Customer')
                    ->whereDate('created_at', $date)
                    ->count();

                return [$date->format('Y-m-d') => $count];
            });
        }


        $topBySpendingQuery = Order::select('user_id', DB::raw('SUM(total_amount) as total_spent'))
            ->where('status_order_id', 6)
            ->whereHas('user', function ($q) {
                $q->where('role', 'Customer');
            })
            ->groupBy('user_id')
            ->orderByDesc('total_spent')
            ->with('user:id,name,email');

        if ($request->has('year')) {
            $topBySpendingQuery->whereYear('created_at', $request->year);
        }
        if ($request->has('month')) {
            $topBySpendingQuery->whereMonth('created_at', $request->month);
        }

        $topBySpending = $topBySpendingQuery->take(5)->get();

        $bannedAccounts = User::where('role', 'Customer')->where('is_ban', 1)->count();
        $activeAccounts = User::where('role', 'Customer')->where('is_ban', 0)->count();
        $customersWithOrders = Order::whereHas('user', function ($q) {
            $q->where('role', 'Customer');
        })
            ->select('user_id')
            ->groupBy('user_id')
            ->get()
            ->count();

        $returningCustomers = Order::whereHas('user', function ($q) {
            $q->where('role', 'Customer');
        })
            ->select('user_id', DB::raw('COUNT(*) as total_orders'))
            ->groupBy('user_id')
            ->having('total_orders', '>=', 2)
            ->get()
            ->count();

        $repeatRate = $customersWithOrders > 0
            ? round(($returningCustomers / $customersWithOrders) * 100, 2)
            : 0;

        return new CustomerStatisticsResource([
            'monthly' => $monthly,
            'recent' => $recent,
            'top_customers_by_spending' => $topBySpending,
            'active_accounts' => $activeAccounts,
            'banned_accounts' => $bannedAccounts,
            'returning_rate_percent' => $repeatRate,
        ]);
    }





}
