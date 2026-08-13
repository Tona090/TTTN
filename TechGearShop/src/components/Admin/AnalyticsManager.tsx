import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Calendar,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  Award,
  RefreshCw,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AnalyticsReportData } from '../../types';
import { fetchAnalyticsReport } from '../../services/api';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export const AnalyticsManager: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'thisMonth' | 'thisYear'>('30days');
  const [report, setReport] = useState<AnalyticsReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [timeRange]);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnalyticsReport(timeRange);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối báo cáo doanh thu');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!report) return;

    const headers = ['Ngay/ThoiGian', 'DoanhThu_VND', 'LoiNhuan_VND', 'SoDonHang'];
    const rows = report.revenueTrend.map(item => [
      item.date,
      item.revenue,
      item.profit,
      item.orders
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BaoCao_DoanhThu_TechGear_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Đã xuất file CSV báo cáo doanh thu thành công!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            Báo Cáo Doanh Thu & Analytics Bán Hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi chi tiết biểu đồ tăng trưởng doanh thu, lợi nhuận, AOV và tỷ lệ đóng góp danh mục.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                timeRange === 'today' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hôm Nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                timeRange === '7days' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Ngày Qua
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                timeRange === '30days' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Ngày Qua
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Báo Cáo Excel/CSV
          </button>
        </div>
      </div>

      {/* Export Toast */}
      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Đang tính toán dữ liệu báo cáo tài chính...</p>
        </div>
      ) : report ? (
        <>
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-2">
                {report.totalRevenue.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">đ</span>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+14.8% so với kỳ trước</span>
              </div>
            </div>

            {/* Estimated Profit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lợi Nhuận Ước Tính</span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-2">
                {report.totalProfit.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">đ</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Tỷ suất lợi nhuận ròng: <span className="font-bold text-slate-700">~28.0%</span>
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Đơn Hàng</span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-2">
                {report.totalOrders} <span className="text-sm font-normal text-slate-500">đơn</span>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>89% hoàn tất giao hàng</span>
              </div>
            </div>

            {/* Average Order Value (AOV) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Giá Trị Trung Bình/Đơn</span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mt-2">
                {report.averageOrderValue.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">đ</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Chỉ số AOV (Average Order Value)
              </p>
            </div>
          </div>

          {/* Revenue & Profit Area Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Biểu Đồ Doanh Thu & Lợi Nhuận Theo Thời Gian
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Xu hướng biến động doanh thu thực tế ghi nhận trên hệ thống</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.revenueTrend} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} đ`, '']}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="revenue" name="Doanh Thu (đ)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="profit" name="Lợi Nhuận (đ)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid: Top Products Bar Chart & Category Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Products Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Top 5 Sản Phẩm Bán Chạy Nhất (Doanh Số)
                </h2>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.topSellingProducts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis dataKey="sku" type="category" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 'bold' }} />
                    <Tooltip
                      formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')} đ`, 'Doanh Thu']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="revenue" name="Doanh Thu" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Revenue Breakdown Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" />
                  Cơ Cấu Doanh Thu Theo Danh Mục
                </h2>
              </div>
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="revenue"
                      nameKey="name"
                    >
                      {report.categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')} đ`, 'Doanh Thu']} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Top Products Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Bảng Xếp Hạng Doanh Số Chi Tiết Theo Sản Phẩm</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-3">Hạng</th>
                    <th className="p-3">Tên Sản Phẩm</th>
                    <th className="p-3">Mã SKU</th>
                    <th className="p-3">Danh Mục</th>
                    <th className="p-3 text-center">Số Lượng Đã Bán</th>
                    <th className="p-3 text-right">Tổng Doanh Thu Mang Lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {report.topSellingProducts.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-bold text-slate-700">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                          index === 0 ? 'bg-amber-100 text-amber-800 font-extrabold' :
                          index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-amber-700/10 text-amber-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="p-3 font-mono text-xs text-slate-600">{item.sku}</td>
                      <td className="p-3 text-xs text-slate-500 font-medium">{item.category}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{item.soldCount} sp</td>
                      <td className="p-3 text-right font-bold text-slate-800">
                        {item.revenue.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
