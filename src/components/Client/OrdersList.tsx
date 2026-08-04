import React, { useState, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, 
  Search, FileText, Download, ShieldCheck, MapPin, Phone, User as UserIcon, AlertCircle, RefreshCw
} from 'lucide-react';
import { Order, User } from '../../types';
import { fetchOrders, cancelCustomerOrder } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  user: User | null;
}

export const OrdersList: React.FC<Props> = ({ user }) => {
  const { lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  // Cancel order modal for customer
  const [cancelModalOrderId, setCancelModalOrderId] = useState<number | null>(null);
  const [customerCancelReason, setCustomerCancelReason] = useState<string>('');
  const [submittingCancel, setSubmittingCancel] = useState<boolean>(false);

  const loadCustomerOrders = () => {
    if (user) {
      setLoading(true);
      fetchOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadCustomerOrders();
  }, [user]);

  const handleConfirmCancelCustomer = async () => {
    if (!cancelModalOrderId) return;
    if (!customerCancelReason.trim()) {
      alert('Vui lòng chọn hoặc nhập lý do hủy đơn hàng.');
      return;
    }

    setSubmittingCancel(true);
    try {
      const updated = await cancelCustomerOrder(cancelModalOrderId, customerCancelReason.trim());
      setOrders(prev => prev.map(o => o.id === cancelModalOrderId ? updated : o));
      alert(`Đã hủy đơn hàng #${cancelModalOrderId} thành công.`);
      setCancelModalOrderId(null);
      setCustomerCancelReason('');
    } catch (err: any) {
      alert(err.message || 'Không thể hủy đơn hàng.');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-lg flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Hoàn thành
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 rounded-lg flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-500" /> Đang giao hàng
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-purple-700 bg-purple-100 dark:bg-purple-950/60 dark:text-purple-400 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-500" /> Đang chuẩn bị linh kiện
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-red-700 bg-red-100 dark:bg-red-950/60 dark:text-red-400 rounded-lg flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-500" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Chờ xác nhận
          </span>
        );
    }
  };

  // Timeline Steps representation
  const renderOrderTimeline = (order: Order) => {
    if (order.status === 'cancelled') {
      return (
        <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-1.5 text-red-700 dark:text-red-400">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-500" />
              ĐƠN HÀNG ĐÃ BỊ HỦY
            </span>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-800 dark:text-red-300 font-bold text-[10px] rounded-md">
              {order.cancelled_by === 'customer' ? 'Bạn tự hủy' : 'Shop / Quản trị viên hủy'}
            </span>
          </div>
          {order.cancel_reason && (
            <p className="text-[11px] font-semibold bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-red-200 dark:border-red-900/40">
              <strong>Lý do hủy:</strong> "{order.cancel_reason}"
            </p>
          )}
        </div>
      );
    }

    const steps = [
      { key: 'pending', label: 'Chờ xác nhận' },
      { key: 'processing', label: 'Đang chuẩn bị' },
      { key: 'shipped', label: 'Đang giao hàng' },
      { key: 'completed', label: 'Hoàn tất' },
    ];

    const currentIdx = order.status === 'completed' ? 3 : order.status === 'shipped' ? 2 : order.status === 'processing' ? 1 : 0;

    return (
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
          Tiến Độ Đơn Hàng Realtime
        </span>
        <div className="flex items-center justify-between relative">
          {steps.map((step, idx) => {
            const isFinished = idx <= currentIdx;
            return (
              <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-colors ${
                  isFinished 
                    ? 'bg-orange-500 text-slate-950' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {isFinished ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span className={`text-[9px] font-semibold mt-1 text-center ${
                  isFinished ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Download PDF simulation helper
  const handleDownloadInvoice = (order: Order) => {
    const invoiceContent = `
===============================================
               HÓA ĐƠN THU TIỀN
            CỬA HÀNG TECHGEAR VN
===============================================
Mã đơn hàng: #${order.id}
Ngày tạo: ${order.created_at}
Khách hàng: ${order.user_name || user?.name}
Điện thoại: ${order.phone}
Địa chỉ giao hàng: ${order.shipping_address}

DANH SÁCH SẢN PHẨM:
${order.items.map(i => `- ${i.name} x${i.quantity}: ${formatVND(i.price * i.quantity)}`).join('\n')}

TỔNG CỘNG THANH TOÁN: ${formatVND(order.total_amount)}
===============================================
Cảm ơn quý khách đã mua sắm tại TechGear!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HoaDon_TechGear_Don_${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.phone && order.phone.includes(searchQuery));
    const matchesStatus = activeStatusFilter === 'all' || order.status === activeStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
            <Package className="w-4 h-4" />
            Lịch Sử & Tiến Độ Đơn Hàng
          </span>
          <h1 className="text-2xl font-black">Quản Lý Đơn Hàng Đã Mua</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Theo dõi trạng thái giao hàng, kiểm tra danh sách linh kiện đã mua và tải hóa đơn mua hàng chi tiết.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        
        {/* Search box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Mã đơn / SĐT / Địa chỉ..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xác nhận' },
            { key: 'processing', label: 'Đang chuẩn bị' },
            { key: 'shipped', label: 'Đang giao' },
            { key: 'completed', label: 'Hoàn thành' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeStatusFilter === tab.key
                  ? 'bg-orange-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Orders List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Đang tải lịch sử đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Không tìm thấy đơn hàng phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Các đơn hàng bạn mua sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header item */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 dark:text-white text-xs">
                        Mã đơn #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="block text-[11px] text-slate-400">Ngày đặt: {order.created_at}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                      {formatVND(order.total_amount)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 animate-fade-in">
                    
                    {/* Realtime Timeline Tracker */}
                    {renderOrderTimeline(order)}

                    {/* Products list */}
                    <div className="space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block">Sản phẩm trong đơn:</span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt={item.name} className="w-11 h-11 object-cover rounded-lg bg-slate-100" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                              <span className="text-[10px] text-slate-500">Đơn giá: {formatVND(item.price)} | Số lượng: x{item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white">{formatVND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>
                        <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" /> Địa chỉ giao hàng:
                        </p>
                        <p className="pl-5 text-slate-500">{order.shipping_address}</p>
                      </div>

                      <div>
                        <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
                          <Phone className="w-3.5 h-3.5 text-blue-500" /> Số điện thoại người nhận:
                        </p>
                        <p className="pl-5 text-slate-500">{order.phone}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => {
                            setCancelModalOrderId(order.id);
                            setCustomerCancelReason('');
                          }}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold border border-red-500/30 rounded-xl flex items-center gap-1.5 transition-colors text-[11px]"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Yêu Cầu Hủy Đơn</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-xl text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors text-[11px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Hóa Đơn Mua Hàng (.TXT)</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Cancel Order Modal */}
      {cancelModalOrderId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="p-2.5 bg-red-500/10 rounded-2xl">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">Hủy Đơn Hàng #{cancelModalOrderId}</h3>
                <p className="text-[11px] text-slate-500">Đơn hàng ở trạng thái "Chờ xác nhận" có thể tự hủy trực tiếp.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px] block">
                Vui lòng chọn hoặc nhập lý do hủy đơn:
              </label>
              
              <div className="space-y-1.5">
                {[
                  'Đổi ý / Muốn đặt lại mẫu sản phẩm khác',
                  'Nhập sai địa chỉ / số điện thoại người nhận',
                  'Thời gian giao hàng không phù hợp',
                  'Tìm thấy mẫu thích hợp hơn',
                  'Lý do khác...'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomerCancelReason(preset)}
                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      customerCancelReason === preset
                        ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={customerCancelReason}
                onChange={e => setCustomerCancelReason(e.target.value)}
                placeholder="Nhập lý do cụ thể khác của bạn..."
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium focus:ring-2 focus:ring-orange-500 text-xs mt-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={submittingCancel}
                onClick={() => {
                  setCancelModalOrderId(null);
                  setCustomerCancelReason('');
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Giữ Lại Đơn
              </button>
              <button
                disabled={submittingCancel || !customerCancelReason.trim()}
                onClick={handleConfirmCancelCustomer}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                {submittingCancel ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang gửi...</span>
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
