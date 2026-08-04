import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle2, Truck, XCircle, 
  Clock, DollarSign, QrCode, Phone, MapPin, User, FileText, Printer, Check, RefreshCw
} from 'lucide-react';
import { Order } from '../../types';
import { fetchOrders, updateOrderStatus } from '../../services/api';

export const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cancellation modal state for Admin
  const [cancelModalOrderId, setCancelModalOrderId] = useState<number | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: Order['status'], reason?: string) => {
    if (newStatus === 'cancelled' && !reason) {
      setCancelModalOrderId(orderId);
      setCancelReasonInput('');
      return;
    }

    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus, reason);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      setSuccessMsg(`Đã cập nhật trạng thái đơn hàng #${orderId} thành "${getStatusLabel(newStatus)}"`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmCancelAdmin = async () => {
    if (!cancelModalOrderId) return;
    if (!cancelReasonInput.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng để làm việc với khách hàng.');
      return;
    }

    setSubmittingCancel(true);
    try {
      const updated = await updateOrderStatus(cancelModalOrderId, 'cancelled', cancelReasonInput.trim());
      setOrders(prev => prev.map(o => o.id === cancelModalOrderId ? updated : o));
      if (activeOrder && activeOrder.id === cancelModalOrderId) {
        setActiveOrder(updated);
      }
      setSuccessMsg(`Đã hủy đơn hàng #${cancelModalOrderId} thành công.`);
      setCancelModalOrderId(null);
      setCancelReasonInput('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi hủy đơn hàng.');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ Xác Nhận';
      case 'processing': return 'Đã Xác Nhận / Đang Xử Lý';
      case 'shipped': return 'Đang Giao Hàng';
      case 'completed': return 'Giao Thành Công';
      case 'cancelled': return 'Đã Hủy';
      default: return status;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Chờ Xác Nhận</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit"><RefreshCw className="w-3 h-3 animate-spin" /> Đang Xử Lý</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Đang Giao</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Thành Công</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Đã Hủy</span>;
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toString().includes(searchTerm.trim()) ||
      (o.user_name && o.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.phone && o.phone.includes(searchTerm.trim()));
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing' || o.status === 'shipped').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="space-y-6 text-xs max-w-6xl">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            Quản Lý Đơn Hàng & Vận Chuyển
          </h1>
          <p className="text-slate-500 text-[11px]">Xác nhận đơn hàng, thay đổi trạng thái giao hàng và theo dõi dòng tiền chuyển khoản VietQR.</p>
        </div>
        <button
          onClick={loadOrders}
          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <span className="text-slate-400 font-medium block text-[10px]">TỔNG ĐƠN HÀNG</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{totalOrdersCount}</span>
        </div>
        <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <span className="text-amber-600 dark:text-amber-400 font-medium block text-[10px]">CHỜ XÁC NHẬN</span>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
        </div>
        <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
          <span className="text-blue-600 dark:text-blue-400 font-medium block text-[10px]">ĐANG XỬ LÝ & GIAO</span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">{processingCount}</span>
        </div>
        <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium block text-[10px]">HOÀN THÀNH</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
        </div>
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm col-span-2 md:col-span-1">
          <span className="text-slate-400 font-medium block text-[10px]">TỔNG GIÁ TRỊ TÍCH LŨY</span>
          <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">{formatVND(totalRevenue)}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Mã đơn (2001), Tên khách, SĐT..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'pending', label: 'Chờ xác nhận' },
              { id: 'processing', label: 'Đang xử lý' },
              { id: 'shipped', label: 'Đang giao' },
              { id: 'completed', label: 'Thành công' },
              { id: 'cancelled', label: 'Đã hủy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap text-[11px] ${
                  selectedStatus === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            Đang tải dữ liệu đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="font-bold text-slate-700 dark:text-slate-300">Không tìm thấy đơn hàng phù hợp</p>
            <p className="text-[11px]">Thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-3.5">Mã Đơn</th>
                  <th className="p-3.5">Khách Hàng</th>
                  <th className="p-3.5">Sản Phẩm</th>
                  <th className="p-3.5">Tổng Tiền</th>
                  <th className="p-3.5">Phương Thức</th>
                  <th className="p-3.5">Trạng Thái</th>
                  <th className="p-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-black text-blue-600 dark:text-blue-400">
                      #{order.id}
                      <span className="block text-[10px] text-slate-400 font-normal">{order.created_at}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{order.user_name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-orange-500" /> {order.phone}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-xs">
                        {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                      <span className="text-[10px] text-slate-400">{order.items.length} món</span>
                    </td>
                    <td className="p-3.5 font-extrabold text-orange-600 dark:text-orange-400">
                      {formatVND(order.total_amount)}
                    </td>
                    <td className="p-3.5">
                      {order.payment_method === 'VIETQR' ? (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded text-[10px] flex items-center gap-1 w-fit">
                          <QrCode className="w-3 h-3" /> VietQR
                        </span>
                      ) : order.payment_method === 'MOMO' ? (
                        <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold rounded text-[10px] w-fit">
                          Ví MoMo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded text-[10px] w-fit">
                          COD Tiền Mặt
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => setActiveOrder(order)}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span>Xem</span>
                      </button>

                      {order.status === 'pending' && (
                        <>
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'processing')}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Duyệt</span>
                          </button>
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hủy</span>
                          </button>
                        </>
                      )}

                      {order.status === 'processing' && (
                        <>
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'shipped')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Giao Hàng</span>
                          </button>
                          <button
                            disabled={updatingId === order.id}
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Hủy</span>
                          </button>
                        </>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hoàn Thành</span>
                        </button>
                      )}

                      {order.status === 'cancelled' && (
                        <span className="text-[10px] text-red-500 font-bold italic px-2 py-1 bg-red-50 dark:bg-red-950/40 rounded-lg">
                          🔒 Đã khóa đơn
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Order Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Chi Tiết Đơn Hàng</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Mã Đơn #{activeOrder.id}</span>
                  {getStatusBadge(activeOrder.status)}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Status Control Bar / Cancelled Warning */}
            {activeOrder.status === 'cancelled' ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-2 text-red-700 dark:text-red-400">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500" />
                    ĐƠN HÀNG ĐÃ BỊ HỦY (TRẠNG THÁI KHÓA TOÀN BỘ)
                  </span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-700 dark:text-red-300 font-black text-[10px] rounded-md">
                    {activeOrder.cancelled_by === 'customer' ? 'Khách Hàng Hủy' : 'Admin Hủy'}
                  </span>
                </div>
                {activeOrder.cancel_reason && (
                  <p className="text-xs font-semibold bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-red-200 dark:border-red-900/50">
                    <strong>Lý do hủy ghi nhận:</strong> "{activeOrder.cancel_reason}"
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Cập nhật trạng thái:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['pending', 'processing', 'shipped', 'completed', 'cancelled'] as Order['status'][]).map(st => (
                    <button
                      key={st}
                      disabled={updatingId === activeOrder.id || activeOrder.status === st}
                      onClick={() => handleStatusChange(activeOrder.id, st)}
                      className={`px-2.5 py-1 rounded-xl font-extrabold transition-all text-[10px] ${
                        activeOrder.status === st
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow'
                          : st === 'cancelled'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border hover:border-blue-500'
                      }`}
                    >
                      {getStatusLabel(st)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Info & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-800">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 border-b pb-1">
                  <User className="w-4 h-4 text-blue-500" /> Thông Tin Khách Hàng
                </h4>
                <p><strong>Họ tên:</strong> {activeOrder.user_name}</p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-500" /> 
                  <strong>Số điện thoại:</strong> {activeOrder.phone}
                </p>
                <p className="flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                  <span><strong>Địa chỉ giao:</strong> {activeOrder.shipping_address}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-800">
                <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 border-b pb-1">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Thanh Toán & Thời Gian
                </h4>
                <p><strong>Ngày tạo:</strong> {activeOrder.created_at}</p>
                <p>
                  <strong>Hình thức:</strong>{' '}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {activeOrder.payment_method === 'VIETQR' ? 'Chuyển Khoản Ngân Hàng VietQR' : activeOrder.payment_method === 'MOMO' ? 'Ví Điện Tử MoMo' : 'Tiền Mặt COD'}
                  </span>
                </p>
                {activeOrder.note && <p><strong>Ghi chú:</strong> {activeOrder.note}</p>}
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div>
              <h4 className="font-extrabold text-slate-900 dark:text-white mb-2">Danh Sách Sản Phẩm Đặt Mua</h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 font-extrabold uppercase border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3 text-center">Đơn giá</th>
                      <th className="p-3 text-center">Số lượng</th>
                      <th className="p-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 flex items-center gap-2.5">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-white border" />
                          <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                        </td>
                        <td className="p-3 text-center font-mono">{formatVND(item.price)}</td>
                        <td className="p-3 text-center font-bold">x{item.quantity}</td>
                        <td className="p-3 text-right font-extrabold text-orange-600 dark:text-orange-400">
                          {formatVND(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-black border-t border-slate-200 dark:border-slate-800">
                      <td colSpan={3} className="p-3 text-right">TỔNG CỘNG THANH TOÁN:</td>
                      <td className="p-3 text-right text-base text-orange-600 dark:text-orange-400">
                        {formatVND(activeOrder.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs"
              >
                <Printer className="w-4 h-4 text-blue-500" />
                <span>In Hóa Đơn</span>
              </button>

              <button
                onClick={() => setActiveOrder(null)}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Admin Cancel Reason Requirement Modal */}
      {cancelModalOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 bg-red-500/10 rounded-2xl">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Xác Nhận Hủy Đơn #{cancelModalOrderId}</h3>
                <p className="text-[11px] text-slate-500">Yêu cầu ghi rõ lý do đã trao đổi với khách hàng.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px]">
                Lý Do Hủy Đơn Hàng <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={cancelReasonInput}
                onChange={e => setCancelReasonInput(e.target.value)}
                placeholder="VD: Khách hàng gọi điện hotline yêu cầu hủy do chọn nhầm mẫu; Hoặc Hết hàng kích cỡ yêu cầu trong kho..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium focus:ring-2 focus:ring-red-500 text-xs"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold rounded-xl text-[11px]">
              ⚠️ Lưu ý: Khi hủy đơn hàng, kho hàng sẽ tự động hoàn trả lại số lượng sản phẩm và trạng thái đơn sẽ bị <strong>KHÓA VĨNH VIỄN</strong>.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                disabled={submittingCancel}
                onClick={() => {
                  setCancelModalOrderId(null);
                  setCancelReasonInput('');
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Hủy Bỏ
              </button>
              <button
                disabled={submittingCancel || !cancelReasonInput.trim()}
                onClick={handleConfirmCancelAdmin}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                {submittingCancel ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác Nhận Hủy Đơn</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
