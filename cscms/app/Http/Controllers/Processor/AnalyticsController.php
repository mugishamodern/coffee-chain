<?php

namespace App\Http\Controllers\Processor;

use App\Http\Controllers\Controller;
use App\Models\FarmerOrder;
use App\Models\RetailerOrder;
use App\Models\RetailerOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Get the processor's company ID
        $processorCompanyId = auth()->user()->company->company_id;

        // Get retailer orders where this processor is selling
        $retailerOrders = RetailerOrder::where('processor_company_id', $processorCompanyId)
            ->with(['orderItems'])
            ->get();

        // Get farmer orders where this processor is buying
        $farmerOrders = FarmerOrder::where('farmer_company_id', $processorCompanyId)
            ->get();

        // Calculate analytics
        $analytics = $this->calculateAnalytics($farmerOrders, $retailerOrders);

        // Get customer segments
        $customerSegments = $this->segmentCustomers($retailerOrders);

        // Calculate production trends (last 6 months)
        $productionTrends = $this->calculateProductionTrends($processorCompanyId);

        // Log the data for debugging
        Log::info('Analytics Data', [
            'analytics' => $analytics,
            'customerSegments' => $customerSegments,
            'productionTrends' => $productionTrends,
            'farmerOrdersCount' => $farmerOrders->count(),
            'retailerOrdersCount' => $retailerOrders->count()
        ]);

        return view('processor.analytics.index', compact('analytics', 'customerSegments', 'productionTrends'));
    }

    private function calculateAnalytics($farmerOrders, $retailerOrders)
    {
        // Initialize metrics
        $totalCost = 0;
        $totalRevenue = 0;
        $totalInventoryValue = 0;
        $totalProcessedKg = 0;

        // Calculate costs from farmer orders
        foreach ($farmerOrders as $order) {
            if ($order->order_status === 'delivered') {
                $totalCost += $order->total_amount;
                $totalProcessedKg += $order->quantity_kg;
            }
        }

        // Calculate revenue from retailer orders
        foreach ($retailerOrders as $order) {
            if ($order->order_status === 'delivered') {
                $totalRevenue += $order->total_amount;
            }
        }

        // Calculate metrics
        $profitMargin = $totalRevenue > 0 ? (($totalRevenue - $totalCost) / $totalRevenue) * 100 : 0;
        $inventoryTurnover = $totalProcessedKg > 0 ? ($totalRevenue / $totalProcessedKg) : 0;
        $productionEfficiency = $totalProcessedKg > 0 ? ($totalRevenue / ($totalProcessedKg * 100)) : 0;

        return (object) [
            'profit_margin' => round($profitMargin, 2),
            'inventory_turnover' => round($inventoryTurnover, 2),
            'production_efficiency' => round($productionEfficiency, 2),
            'total_revenue' => round($totalRevenue, 2),
            'total_cost' => round($totalCost, 2),
            'total_processed_kg' => round($totalProcessedKg, 2)
        ];
    }

    private function segmentCustomers($retailerOrders)
    {
        $segments = [
            'high_value' => 0,
            'medium_value' => 0,
            'low_value' => 0
        ];

        // Group orders by retailer and calculate total value
        $retailerValues = [];
        foreach ($retailerOrders as $order) {
            $retailerId = $order->processor_company_id;
            if (!isset($retailerValues[$retailerId])) {
                $retailerValues[$retailerId] = 0;
            }
            $retailerValues[$retailerId] += $order->total_amount;
        }

        // Segment retailers based on their total order value
        foreach ($retailerValues as $totalValue) {
            if ($totalValue >= 10000000) { // 10M UGX
                $segments['high_value']++;
            } elseif ($totalValue >= 5000000) { // 5M UGX
                $segments['medium_value']++;
            } else {
                $segments['low_value']++;
            }
        }

        return $segments;
    }

    private function calculateProductionTrends($processorCompanyId)
    {
        $trends = [];
        $months = [];
        $productionData = [];
        
        // Get last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = $date->format('M');
            
            // Calculate production for this month based on finished goods inventory
            // This is a simplified calculation - you might want to track actual production dates
            $monthStart = $date->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();
            
            // Use processor_finished_goods_inventory for finished goods
            $monthlyProduction = \Illuminate\Support\Facades\DB::table('processor_finished_goods_inventory')
                ->where('processor_company_id', $processorCompanyId)
                ->whereIn('product_name', ['roasted_coffee', 'ground_coffee'])
                ->whereBetween('last_updated', [$monthStart, $monthEnd])
                ->sum('current_stock_units');
            
            // If no production data, estimate based on current inventory
            if ($monthlyProduction == 0) {
                $monthlyProduction = \Illuminate\Support\Facades\DB::table('processor_finished_goods_inventory')
                    ->where('processor_company_id', $processorCompanyId)
                    ->whereIn('product_name', ['roasted_coffee', 'ground_coffee'])
                    ->sum('current_stock_units') / 6;
            }
            
            $productionData[] = round($monthlyProduction, 0);
        }
        
        return [
            'months' => $months,
            'production' => $productionData
        ];
    }
}