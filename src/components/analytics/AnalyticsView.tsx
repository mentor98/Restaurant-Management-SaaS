import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  UtensilsCrossed,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext.tsx';

export const AnalyticsView: React.FC = () => {
  const { analytics, profile, activeBranch } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | '7days' | 'month'>('today');

  const currencySymbol = profile?.currencySymbol || '$';

  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-400">
        Loading restaurant revenue metrics...
      </div>
    );
  }

  const { metrics, hourlySales, categorySales, bestSellers, paymentMethodBreakdown } = analytics;

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Gross Revenue,${metrics.totalRevenue}\n` +
      `Net Sales,${metrics.netSales}\n` +
      `Total Orders,${metrics.totalOrders}\n` +
      `Average Order Value,${metrics.averageOrderValue}\n` +
      `Total Tips,${metrics.totalTips}\n` +
      `Tax Collected,${metrics.totalTax}\n` +
      `Table Turn Rate,${metrics.tableTurnoverRate}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `restaurant-sales-report-${activeBranch.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="analytics-screen" className="flex-1 flex flex-col h-[calc(100vh-4.25rem)] overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-5 space-y-5">
      {/* Top Header & Range Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
              Executive Sales & Revenue Analytics
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {activeBranch.name} • Real-time operational intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: '7days', label: 'Last 7 Days' },
                { id: 'month', label: 'This Month' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === t.id
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Gross Revenue</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100">
            {currencySymbol}{metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Completed Orders</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100">
            {metrics.totalOrders} <span className="text-xs font-normal text-zinc-400">tickets</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.6% guest count</span>
          </div>
        </div>

        {/* Average Check */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Avg Check / Ticket</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <div className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100">
            {currencySymbol}{metrics.averageOrderValue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <span>Per cover average</span>
          </div>
        </div>

        {/* Table Turnover */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Table Turnover</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="font-extrabold text-2xl text-zinc-900 dark:text-zinc-100">
            {metrics.tableTurnoverRate}x <span className="text-xs font-normal text-zinc-400">/ table / shift</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
            <span>Avg dining time: 54 mins</span>
          </div>
        </div>
      </div>

      {/* Primary Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hourly Sales Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Hourly Revenue & Order Flow</h3>
              <p className="text-xs text-zinc-500">Peak dining lunch & dinner rush analysis</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-500">Live Service</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${currencySymbol}${value}`, 'Sales Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Revenue by Category</h3>
            <p className="text-xs text-zinc-500">Sales volume contribution</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="sales"
                  nameKey="categoryName"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(value: any) => [`${currencySymbol}${value}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {categorySales.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-zinc-600 dark:text-zinc-400 truncate">{cat.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Top Sellers & Tender Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Best-Selling Dishes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Top-Ranked Dishes</h3>
              <p className="text-xs text-zinc-500">Highest grossing items on the menu</p>
            </div>
            <UtensilsCrossed className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-2.5 pt-1">
            {bestSellers.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 font-mono font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{item.name}</div>
                    <div className="text-[10px] text-zinc-400">{item.quantity} orders prepared</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-xs text-emerald-500">
                    {currencySymbol}{item.revenue.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-zinc-400">Total volume</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods & Tip Performance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Settlement Tender Breakdown</h3>
            <p className="text-xs text-zinc-500">Payment channel volume & tip distribution</p>
          </div>

          <div className="space-y-3">
            {paymentMethodBreakdown.map((pm, idx) => {
              const totalM = paymentMethodBreakdown.reduce((sum, p) => sum + p.amount, 0);
              const pct = totalM > 0 ? ((pm.amount / totalM) * 100).toFixed(1) : '0';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-800 dark:text-zinc-200 capitalize">
                      {pm.method.replace('_', ' ')} ({pm.count} txns)
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">
                      {currencySymbol}{pm.amount.toFixed(2)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gratuity Pool Info */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400">Staff Gratuity Pool Collected</span>
              <div className="text-[11px] text-zinc-500">Evenly split across front & back of house</div>
            </div>
            <div className="font-black text-base text-amber-500 font-mono">
              {currencySymbol}{metrics.totalTips.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
