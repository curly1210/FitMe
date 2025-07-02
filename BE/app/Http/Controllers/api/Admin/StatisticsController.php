<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Carbon\CarbonPeriod;
use App\Models\ProductItem;
use App\Models\OrdersDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OverviewStatisticResource;
use App\Http\Resources\Admin\CustomerStatisticsResource;
use App\Http\Resources\Admin\ProductStatisticsResource as AdminProductStatisticsResource;
use App\Http\Resourcesư\Admin\ProductStatisticsResource;

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
            'filter_by' => 'nullable|in:quantity,revenue',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);

        $filterBy = $request->input('filter_by', 'quantity');
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

    public function productStatistics(Request $request)
    {
        $filterBy = $request->input('filter_by', 'quantity');
        $now = now();
        $year = $request->filled('year') ? (int) $request->year : null;
        $month = $request->filled('month') ? (int) $request->month : null;
        $recent = $request->filled('recent') ? (int) $request->recent : null;

        $topQuery = OrdersDetail::with('productItem.product.images')
            ->whereHas('order', function ($q) {
                $q->where('status_order_id', 6);
            });

        if ($year && $month) {
            $start = now()->setDate($year, $month, 1)->startOfMonth();
            $end = now()->setDate($year, $month, 1)->endOfMonth();
            $topQuery->whereHas('order', fn($q) => $q->whereBetween('created_at', [$start, $end]));
        } elseif (in_array($recent, [7, 14, 30])) {
            $start = now()->subDays($recent - 1)->startOfDay();
            $end = now()->endOfDay();
            $topQuery->whereHas('order', fn($q) => $q->whereBetween('created_at', [$start, $end]));
        }

        $topProducts = $topQuery->select(
            'product_item_id',
            DB::raw('SUM(quantity) as total_quantity'),
            DB::raw('SUM(sale_price * quantity) as total_revenue')
        )
            ->groupBy('product_item_id')
            ->orderByDesc($filterBy === 'revenue' ? 'total_revenue' : 'total_quantity')
            ->take(20)
            ->get();

        $lowStock = ProductItem::with(['product', 'imageByColor'])
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->take(10)
            ->get();

        $highStock = ProductItem::with(['product', 'imageByColor'])
            ->where('stock', '>', 50)
            ->orderByDesc('stock')
            ->take(10)
            ->get();

        // // === PHÂN LOẠI ===
        // $byCategory = Product::select('category_id', DB::raw('COUNT(*) as total'))
        //     ->groupBy('category_id')->with('category:id,name')->get();

        // $byColor = ProductItem::select('color_id', DB::raw('COUNT(*) as total'))
        //     ->groupBy('color_id')->with('color:id,name')->get();

        // $bySize = ProductItem::select('size_id', DB::raw('COUNT(*) as total'))
        //     ->groupBy('size_id')->with('size:id,name')->get();

        return new AdminProductStatisticsResource([
            'top_selling_products' => $topProducts,
            'stock' => [
                'low' => $lowStock,
                'high' => $highStock,
            ],
            // 'classification' => [
            //     'by_category' => $byCategory,
            //     'by_color' => $byColor,
            //     'by_size' => $bySize,
            // ],
        ]);
    }

    public function orderByLocation(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $statusId = $request->input('status_order_id');

        $orders = Order::query()
            ->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [
                    Carbon::parse($from)->startOfDay(),
                    Carbon::parse($to)->endOfDay()
                ]);
            })
            ->when($statusId !== null, function ($query) use ($statusId) {
                $query->where('status_order_id', $statusId);
            })
            ->select('receiving_address', 'total_amount')
            ->get();

        $cityStats = [];

        foreach ($orders as $order) {
            $address = $order->receiving_address;
            $parts = explode(',', $address);
            $city = trim(end($parts));

            if (!isset($cityStats[$city])) {
                $cityStats[$city] = [
                    'order_count' => 0,

                ];
            }

            $cityStats[$city]['order_count']++;
        }

        uasort($cityStats, fn($a, $b) => $b['order_count'] <=> $a['order_count']);

        return response()->json([
            'data' => $cityStats,
        ]);
    }

    public function inventoryStatistics(Request $request)
    {
        $sortStock = $request->input('sort_stock', 'desc'); 
        $byItem = $request->boolean('product_item', false); 

        if ($byItem) {
            $items = ProductItem::with(['product', 'imageByColor'])
                ->whereHas('product', fn($q) => $q->where('is_active', 1))
                ->get()
                ->map(function ($item) {
                    $sold = OrdersDetail::where('product_item_id', $item->id)
                        ->whereHas('order', fn($q) => $q->where('status_order_id', 6))
                        ->sum('quantity');

                    return [
                        'id' => $item->id,
                        'sku' => $item->sku,
                        'stock' => $item->stock,
                        'total_sold' => $sold,
                        'sell_rate_percent' => $item->stock > 0
                            ? round($sold / $item->stock * 100, 2)
                            : null,
                        'color_id' => $item->color_id,
                        'size_id' => $item->size_id,
                        'image' => $item->imageByColor?->url,
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                        ]
                    ];
                });

            $items = $sortStock === 'asc'
                ? $items->sortBy('stock')->values()
                : $items->sortByDesc('stock')->values();

            return response()->json([
                'type' => 'product_item',
                'inventory_by_product_item' => $items,
            ]);
        }

        $products = Product::with(['productItems.imageByColor'])
            ->select('id', 'name')
            ->where('is_active', 1)
            ->get()
            ->map(function ($product) {
                $totalStock = $product->productItems->sum('stock');

                $totalSold = OrdersDetail::whereIn('product_item_id', $product->productItems->pluck('id'))
                    ->whereHas('order', fn($q) => $q->where('status_order_id', 6))
                    ->sum('quantity');

                $sellRate = $totalStock > 0
                    ? round($totalSold / $totalStock * 100, 2)
                    : null;

                $firstItemImage = $product->productItems->first()?->imageByColor?->url;

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $firstItemImage,
                    'total_stock' => $totalStock,
                    'total_sold' => $totalSold,
                    'inventory_rate_percent' => $sellRate,
                    'product_items' => $product->productItems->map(function ($item) {
                        $sold = OrdersDetail::where('product_item_id', $item->id)
                            ->whereHas('order', fn($q) => $q->where('status_order_id', 6))
                            ->sum('quantity');

                        return [
                            'id' => $item->id,
                            'sku' => $item->sku,
                            'color_id' => $item->color_id,
                            'size_id' => $item->size_id,
                            'stock' => $item->stock,
                            'total_sold' => $sold,
                            'sell_rate_percent' => $item->stock > 0
                                ? round($sold / $item->stock * 100, 2)
                                : null,
                            'image' => $item->imageByColor?->url,
                        ];
                    }),
                ];
            });

        // Tổng toàn shop
        $totalStockAll = $products->sum('total_stock');
        $totalSoldAll = $products->sum('total_sold');

        $shopSellRate = $totalStockAll > 0
            ? round($totalSoldAll / $totalStockAll * 100, 2)
            : null;

        $products = $sortStock === 'asc'
            ? $products->sortBy('total_stock')->values()
            : $products->sortByDesc('total_stock')->values();

        return response()->json([
            'type' => 'product',
            'shop_sell_rate_percent' => $shopSellRate,
            'inventory_by_product' => $products,
        ]);
    }










}
