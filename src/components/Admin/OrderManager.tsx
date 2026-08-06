import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, CheckCircle2, Truck, XCircle, 
  Clock, DollarSign, QrCode, Phone, MapPin, User, FileText, Printer, Check, RefreshCw, Image as ImageIcon
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
  const [receiptLightboxUrl, setReceiptLightboxUrl] = useState<string | null>(null);

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

  const handlePaymentStatusChange = async (orderId: number, newPaymentStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, undefined, undefined, newPaymentStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder(updated);
      }
      setSuccessMsg(`Đã cập nhật trạng thái thanh toán đơn hàng #${orderId}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật trạng thái thanh toán.');
    } finally {
      setUpdatingId(null);
    }
  };

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
    const matchesStatus = 
      selectedStatus === 'all' 
        ? true 
        : selectedStatus === 'pending_verification' 
        ? o.payment_status === 'pending_verification'
        : o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrdersCount = orders.length;
  const pendingVerificationCount = orders.filter(o => o.payment_status === 'pending_verification').length;
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

      {pendingVerificationCount > 0 && (
        <div className="p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-xs">
                Có {pendingVerificationCount} đơn hàng đang CHỜ XÁC MINH THANH TOÁN (Pending Verification)
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Khách hàng đã tải ảnh biên lai / báo đã chuyển khoản ngân hàng. Vui lòng đối soát và bấm duyệt đơn.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus('pending_verification')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-[11px] shrink-0 transition-colors shadow-sm"
          >
            Xem {pendingVerificationCount} đơn chờ duyệt ➔
          </button>
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
              { id: 'pending_verification', label: `⏳ Chờ xác minh (${pendingVerificationCount})` },
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
                      <div className="space-y-1">
                        {order.payment_method === 'VIETQR' ? (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded text-[10px] flex items-center gap-1 w-fit">
                            <QrCode className="w-3 h-3" /> VietQR 24/7
                          </span>
                        ) : order.payment_method === 'VNPAY' ? (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded text-[10px] w-fit">
                            VNPAY QR
                          </span>
                        ) : order.payment_method === 'MOMO' ? (
                          <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold rounded text-[10px] w-fit">
                            Ví MoMo
                          </span>
                        ) : order.payment_method === 'CARD' ? (
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold rounded text-[10px] w-fit">
                            Thẻ Quốc Tế
                          </span>
                        ) : order.payment_method === 'INSTALLMENT' ? (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded text-[10px] w-fit">
                            Trả Góp 0% ({order.installment_months || 6}T)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded text-[10px] w-fit">
                            COD Tiền Mặt
                          </span>
                        )}

                        {order.payment_status === 'paid' ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 block w-fit">
                              ✓ Đã Thanh Toán
                            </span>
                            {order.payment_receipt_url && (
                              <button
                                type="button"
                                onClick={() => setReceiptLightboxUrl(order.payment_receipt_url!)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                              >
                                <ImageIcon className="w-3 h-3" /> Xem Ảnh Bill
                              </button>
                            )}
                          </div>
                        ) : order.payment_status === 'pending_verification' ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                handlePaymentStatusChange(order.id, 'paid');
                                if (order.status === 'pending') {
                                  handleStatusChange(order.id, 'processing');
                                }
                              }}
                              title="Bấm để duyệt: Đã nhận tiền & chuyển đơn sang Đang xử lý"
                              className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/25 text-amber-800 dark:text-amber-200 border border-amber-500/50 animate-pulse block w-fit hover:bg-emerald-600 hover:text-white transition-colors shadow-xs"
                            >
                              ⏳ Chờ Xác Minh ➔ Duyệt Paid
                            </button>
                            {order.payment_receipt_url && (
                              <button
                                type="button"
                                onClick={() => setReceiptLightboxUrl(order.payment_receipt_url!)}
                                className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-xs"
                              >
                                <ImageIcon className="w-3 h-3" /> Xem Ảnh Bill
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 block w-fit">
                            Chưa Thanh Toán
                          </span>
                        )}
                      </div>
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
                <p>
                  <strong>Trạng thái tiền:</strong>{' '}
                  {activeOrder.payment_status === 'paid' ? (
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold rounded text-[10px]">✓ Đã Thanh Toán</span>
                  ) : activeOrder.payment_status === 'pending_verification' ? (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-900 dark:text-amber-300 font-extrabold rounded text-[10px] animate-pulse">⏳ Chờ Xác Minh Thanh Toán</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded text-[10px]">Chưa Thanh Toán</span>
                  )}
                </p>
                {activeOrder.note && <p><strong>Ghi chú:</strong> {activeOrder.note}</p>}
              </div>
            </div>

            {/* Receipt Verification Section */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 text-xs">
                  <ImageIcon className="w-4 h-4 text-blue-500" /> Xác Minh Biên Lai / Bill Chuyển Khoản
                </h4>
                {activeOrder.payment_status === 'pending_verification' && (
                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[9px] animate-pulse">
                    CẦN ĐỐI SOÁT
                  </span>
                )}
              </div>

              {activeOrder.payment_receipt_url ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="relative group shrink-0">
                    <img
                      src={activeOrder.payment_receipt_url}
                      alt="Ảnh bill chuyển khoản"
                      className="w-28 h-28 object-cover rounded-xl border border-slate-200 cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
                      onClick={() => setReceiptLightboxUrl(activeOrder.payment_receipt_url!)}
                    />
                    <button
                      type="button"
                      onClick={() => setReceiptLightboxUrl(activeOrder.payment_receipt_url!)}
                      className="absolute bottom-1 right-1 p-1 bg-black/60 text-white rounded-md text-[9px] font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Phóng to
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      Khách hàng đã đính kèm ảnh chụp màn hình giao dịch thành công.
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Vui lòng kiểm tra mã giao dịch, tên người chuyển và số tiền <strong className="text-orange-600 font-mono">{formatVND(activeOrder.total_amount)}</strong> trên sao kê ngân hàng trước khi xác nhận.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeOrder.payment_status !== 'paid' && (
                        <button
                          type="button"
                          disabled={updatingId === activeOrder.id}
                          onClick={async () => {
                            await handlePaymentStatusChange(activeOrder.id, 'paid');
                            if (activeOrder.status === 'pending') {
                              await handleStatusChange(activeOrder.id, 'processing');
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt: Đã Nhận Tiền & Xử Lý Đơn</span>
                        </button>
                      )}

                      {activeOrder.payment_status === 'pending_verification' && (
                        <button
                          type="button"
                          disabled={updatingId === activeOrder.id}
                          onClick={() => handlePaymentStatusChange(activeOrder.id, 'unpaid')}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>Từ Chối Bill / Chưa Nhận Tiền</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-dashed border-blue-200 dark:border-blue-800 text-slate-500 text-[11px] flex items-center justify-between gap-2">
                  <span>Khách hàng chưa tải ảnh biên lai. Bạn vẫn có thể kiểm tra sao kê ngân hàng thủ công và bấm duyệt.</span>
                  {activeOrder.payment_status !== 'paid' && (
                    <button
                      type="button"
                      disabled={updatingId === activeOrder.id}
                      onClick={() => handlePaymentStatusChange(activeOrder.id, 'paid')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shrink-0 text-[11px]"
                    >
                      ✓ Xác Nhận Đã Nhận Tiền
                    </button>
                  )}
                </div>
              )}
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

      {/* Lightbox Modal for Receipt Image */}
      {receiptLightboxUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setReceiptLightboxUrl(null)}
        >
          <div 
            className="relative max-w-2xl max-h-[90vh] w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 space-y-3 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" /> Ảnh Chụp Biên Lai Thanh Toán (Receipt Verification)
              </h3>
              <button 
                onClick={() => setReceiptLightboxUrl(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-auto max-h-[70vh] flex items-center justify-center bg-black/60 rounded-2xl p-2 border border-slate-800">
              <img 
                src={receiptLightboxUrl} 
                alt="Biên lai chuyển khoản" 
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="flex justify-between items-center text-slate-400 text-xs pt-1">
              <span className="text-[11px] text-slate-400">💡 Click bên ngoài hoặc nút Đóng để thoát xem ảnh.</span>
              <button 
                onClick={() => setReceiptLightboxUrl(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-600/30"
              >
                Đóng Ảnh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
