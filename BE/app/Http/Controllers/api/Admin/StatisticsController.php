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

        $totalSellingProducts = ProductItem::where('stock', '>', 0)->count();

        $totalCustomers = User::where('role', 'Customer')->count();

        $ordersByStatus = Order::selectRaw('status_order_id, COUNT(*) as count')
            ->groupBy('status_order_id')
            ->pluck('count', 'status_order_id');

        $allStatuses = collect(range(0, 6))->mapWithKeys(function ($status) use ($ordersByStatus) {
            return [$status => $ordersByStatus[$status] ?? 0];
        });

        $data = [
            'total_orders' => $totalOrders,
            'total_selling_products' => $totalSellingProducts,
            'total_customers' => $totalCustomers,
            'orders_by_status' => Order::selectRaw('status_order_id, COUNT(*) as count')
                ->groupBy('status_order_id')
                ->pluck('count', 'status_order_id'),
        ];

        return new OverviewStatisticResource($data);
    }

    public function statistics(Request $request)
    {
        $now = now();
        if ($request->year == null) {
            $year = $now->year;
        } else {
            $year = $request->year;
        }

        if ($request->month == null) {
            $month = $now->month;
        } else {
            $month = $request->month;
        }


        $yearly = collect(range(1, 12))->mapWithKeys(function ($m) use ($year) {
            $start = now()->setDate($year, $m, 1)->startOfMonth();
            $end = now()->setDate($year, $m, 1)->endOfMonth();

            $total = Order::where('status_order_id', 7)
                ->whereBetween('created_at', [$start, $end])
                ->sum('total_amount');

            return [$m => $total];
        });

        $daysInMonth = now()->setDate($year, $month, 1)->daysInMonth;

        $monthly = collect(range(1, $daysInMonth))->mapWithKeys(function ($d) use ($year, $month) {
            $start = now()->setDate($year, $month, $d)->startOfDay();
            $end = now()->setDate($year, $month, $d)->endOfDay();

            $total = Order::where('status_order_id', 7)
                ->whereBetween('created_at', [$start, $end])
                ->sum('total_amount');

            return [$d => $total];
        });

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

        return new RevenueStatisticsResource([
            'yearly' => $yearly,
            'monthly' => $monthly,
            'recent' => $recent,
        ]);
    }

}
