import React, { useEffect, useState } from 'react';
import { Package, Layers, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { fetchStats, fetchOrders } from '../../services/api';
import { StatsData, Order } from '../../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchOrders()])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setOrders(ordersData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading || !stats) {
    return <div className="p-8 text-center text-xs text-slate-400">Đang tải thống kê Dashboard...</div>;
  }

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Tổng Quan Thống Kê (Admin Dashboard)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Số liệu hoạt động kinh doanh trực tuyến và thống kê hệ thống toàn sàn.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Sản Phẩm</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalProducts}</div>
            <span className="text-[10px] text-emerald-500 font-bold mt-1 inline-block">Đã phân loại danh mục</span>
          </div>
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Danh Mục</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalCategories}</div>
            <span className="text-[10px] text-blue-500 font-bold mt-1 inline-block">Hoạt động ổn định</span>
          </div>
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Đơn Hàng</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalOrders}</div>
            <span className="text-[10px] text-amber-500 font-bold mt-1 inline-block">Doanh thu: {formatVND(stats.totalRevenue)}</span>
          </div>
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tổng Người Dùng</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalUsers}</div>
            <span className="text-[10px] text-purple-500 font-bold mt-1 inline-block">Tài khoản phân quyền</span>
          </div>
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Revenue Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line / Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Thống Kê Doanh Thu Mới Nhất</h3>
              <p className="text-[11px] text-slate-400">Biểu đồ tổng doanh số theo tháng (VND)</p>
            </div>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Tăng 24.5%
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip formatter={(value: any) => [formatVND(value), 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Phân Bổ Sản Phẩm Theo Danh Mục</h3>
            <p className="text-[11px] text-slate-400">Tỷ lệ số lượng mặt hàng</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {stats.categorySales.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px]">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{cat.value} SP</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Đơn Hàng Gần Đây</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Mã Đơn</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3">Tổng Tiền</th>
                <th className="p-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">#{o.id}</td>
                  <td className="p-3 font-semibold">{o.user_name}</td>
                  <td className="p-3 text-slate-400">{o.created_at}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{formatVND(o.total_amount)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
