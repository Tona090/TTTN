import React, { useState, useEffect } from 'react';
import {
  Package, Search, Truck, CheckCircle2, Clock, MapPin, Phone, User as UserIcon,
  Copy, Check, AlertCircle, RefreshCw, ChevronRight, ArrowLeft, ShieldCheck,
  ExternalLink, Calendar, Navigation, Sparkles, Building2, FileText, Send, Mail, AlertTriangle, X,
  Printer, QrCode, Compass, Eye, ShieldAlert, Award, Bell, Smartphone
} from 'lucide-react';
import { Order, TrackingInfo, NotificationLog } from '../../types';
import { trackOrder, sendReceiptEmail, rescheduleDelivery, fetchNotificationLogs, triggerAutoPayment } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  initialOrderId?: string | number;
  onBack?: () => void;
  userPhoneOrEmail?: string;
}

export const OrderTracker: React.FC<Props> = ({ initialOrderId, onBack, userPhoneOrEmail }) => {
  const { lang } = useLanguage();
  const [searchId, setSearchId] = useState<string>(initialOrderId ? String(initialOrderId) : '');
  const [searchContact, setSearchContact] = useState<string>(userPhoneOrEmail || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);
  const [notifLogs, setNotifLogs] = useState<NotificationLog[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Email resend state
  const [emailInput, setEmailInput] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('Ngày mai');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('Chiều (13:00 - 17:00)');
  const [rescheduleNote, setRescheduleNote] = useState<string>('');
  const [reschedulePhone, setReschedulePhone] = useState<string>('');
  const [rescheduleAddress, setRescheduleAddress] = useState<string>('');
  const [submittingReschedule, setSubmittingReschedule] = useState<boolean>(false);
  const [rescheduleSuccessMsg, setRescheduleSuccessMsg] = useState<string | null>(null);

  // Interactive extras state
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showGpsMap, setShowGpsMap] = useState<boolean>(false);
  const [showEWarrantyModal, setShowEWarrantyModal] = useState<boolean>(false);

  const [autoPayLoading, setAutoPayLoading] = useState<boolean>(false);

  const handleAutoPayInTracker = async () => {
    if (!orderData?.id) return;
    setAutoPayLoading(true);
    try {
      const res = await triggerAutoPayment(orderData.id, orderData.payment_method);
      if (res.success) {
        setOrderData(res.order);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi xác thực thanh toán');
    } finally {
      setAutoPayLoading(false);
    }
  };

  const handleTrack = async (idToTrack?: string | number, contactToTrack?: string) => {
    const queryId = (idToTrack !== undefined ? idToTrack : searchId).toString().trim();
    if (!queryId) {
      setErrorMsg(lang === 'vi' ? 'Vui lòng nhập Mã đơn hàng.' : 'Please enter an Order ID.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setEmailSuccessMsg(null);
    setRescheduleSuccessMsg(null);

    try {
      const res = await trackOrder(queryId, contactToTrack || searchContact);
      setOrderData(res.order);
      setTrackingData(res.tracking);
      setEmailInput(res.order.email || '');
      setReschedulePhone(res.order.phone || '');
      setRescheduleAddress(res.order.shipping_address || '');

      try {
        const logs = await fetchNotificationLogs(res.order.id);
        setNotifLogs(logs);
      } catch (e) {
        console.error('Failed to load notif logs for tracker', e);
      }
    } catch (err: any) {
      setOrderData(null);
      setTrackingData(null);
      setNotifLogs([]);
      setErrorMsg(err.message || (lang === 'vi' ? 'Không tìm thấy thông tin vận chuyển.' : 'Tracking information not found.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      handleTrack(initialOrderId);
    }
  }, [initialOrderId]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!orderData) return;
    if (!emailInput || !emailInput.includes('@')) {
      alert(lang === 'vi' ? 'Vui lòng nhập Email hợp lệ.' : 'Please enter a valid email.');
      return;
    }
    setSendingEmail(true);
    try {
      const res = await sendReceiptEmail(orderData.id, emailInput);
      setEmailSuccessMsg(res.message);
    } catch (err: any) {
      alert(err.message || 'Lỗi gửi email hóa đơn.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!orderData) return;
    setSubmittingReschedule(true);
    try {
      const res = await rescheduleDelivery({
        order_id: orderData.id,
        date: rescheduleDate,
        time_slot: rescheduleSlot,
        note: rescheduleNote,
        new_phone: reschedulePhone,
        new_address: rescheduleAddress
      });
      setOrderData(res.order);
      setTrackingData(res.tracking);
      setRescheduleSuccessMsg(res.message);
      setShowRescheduleModal(false);
    } catch (err: any) {
      alert(err.message || 'Có lỗi khi gửi lịch hẹn giao lại.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const sampleOrderIds = [
    { id: '2000', label: '#2000 (Đơn mới đặt)' },
    { id: '3000', label: '#3000 (Giao thất bại mẫu)', badge: 'Giao thất bại' },
    { id: '1001', label: '#1001 (Đã giao xong)' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-6">
      
      {/* Top Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Quay lại danh sách đơn hàng' : 'Back to Order List'}</span>
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 shadow-md">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </span>
            <span>{lang === 'vi' ? 'Theo Dõi Đơn Hàng Real-Time' : 'Live Order Tracking'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'vi'
              ? 'Nhập mã đơn hàng để tra cứu lộ trình vận chuyển, shipper và thời gian giao hàng dự kiến chính xác.'
              : 'Enter order ID to track real-time delivery status, courier, and estimated delivery time.'}
          </p>
        </div>

        {/* Quick Help Hotline Pill */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 self-start md:self-auto shadow-2xs">
          <Phone className="w-4 h-4 text-orange-500 shrink-0 animate-bounce" />
          <div className="text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{lang === 'vi' ? 'Tổng đài Vận Chuyển' : 'Support Hotline'}</div>
            <div className="text-slate-900 dark:text-white font-black text-sm">1900-8888 (24/7)</div>
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-all">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Order ID input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Package className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={lang === 'vi' ? 'Nhập Mã Đơn Hàng (Ví dụ: 1001, #1002)...' : 'Enter Order ID (e.g. 1001, #1002)...'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Optional contact input */}
            <div className="md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                placeholder={lang === 'vi' ? 'SĐT hoặc Email (Tùy chọn)' : 'Phone or Email (Optional)'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Track Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Search className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{lang === 'vi' ? 'Tra Cứu Ngay' : 'Track Order'}</span>
            </button>
          </div>

          {/* Quick sample Order IDs */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {lang === 'vi' ? 'Thử tra cứu mẫu:' : 'Sample Order IDs:'}
            </span>
            {sampleOrderIds.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setSearchId(sample.id);
                  handleTrack(sample.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  sample.badge
                    ? 'bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span>{sample.label}</span>
                {sample.badge && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded uppercase">
                    {sample.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Tracking Results View */}
      {orderData && trackingData ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 1. Header Banner & Estimated Delivery */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 text-orange-500 pointer-events-none">
              <Truck className="w-64 h-64" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Col 1: Order ID & Carrier */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-extrabold uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{trackingData.carrier}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <span>Mã đơn: #{orderData.id}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Mã vận đơn:</span>
                  <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {trackingData.tracking_code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(trackingData.tracking_code)}
                    className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                    title="Sao chép mã vận đơn"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Col 2: Estimated Delivery Card */}
              <div className="bg-white/10 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/15 dark:border-slate-700 space-y-1">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>{lang === 'vi' ? 'Thời gian giao hàng dự kiến' : 'Estimated Delivery Time'}</span>
                </div>
                <div className="text-lg font-black text-amber-300">
                  {trackingData.estimated_delivery}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Khung thời gian: {trackingData.estimated_delivery_range}
                </div>
              </div>

              {/* Col 3: Status Badge & Progress Percent */}
              <div className="flex flex-col items-start md:items-end space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 shadow-md">
                  <span className={`w-3 h-3 rounded-full animate-ping ${
                    orderData.status === 'completed' ? 'bg-emerald-400' :
                    orderData.status === 'shipped' ? 'bg-amber-400' :
                    orderData.status === 'processing' ? 'bg-blue-400' : 'bg-slate-400'
                  }`} />
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider">
                    {orderData.status === 'completed' ? (lang === 'vi' ? 'Giao Hàng Thành Công' : 'Delivered') :
                     orderData.status === 'shipped' ? (lang === 'vi' ? 'Đang Vận Chuyển' : 'In Transit') :
                     orderData.status === 'processing' ? (lang === 'vi' ? 'Đang Đóng Gói / Xuất Kho' : 'Packing & Processing') :
                     orderData.status === 'cancelled' ? (lang === 'vi' ? 'Đã Hủy Đơn Hàng' : 'Cancelled') :
                     (lang === 'vi' ? 'Đã Tiếp Nhận Đơn Hàng' : 'Order Placed')}
                  </span>
                </div>

                <div className="w-full md:w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${trackingData.progress_percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-bold">
                  {trackingData.progress_percent}% Hoàn thành hành trình
                </span>
              </div>
            </div>

            {/* Live Interactive Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGpsMap(!showGpsMap)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Compass className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{showGpsMap ? 'Ẩn Bản Đồ GPS' : '🗺️ Định Vị GPS Shipper Real-Time'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>In Phiếu Giao Hàng (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEWarrantyModal(true)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>🛡️ Bảo Hành Điện Tử (QR)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Cập nhật tự động 30 giây/lần theo thời gian thực
              </div>
            </div>
          </div>

          {/* Simulated Real-Time GPS Map Card */}
          {showGpsMap && (
            <div className="bg-slate-900 border-2 border-amber-500/60 p-5 rounded-3xl text-white shadow-xl space-y-4 animate-fadeIn relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Bản Đồ Định Vị GPS Shipper Trực Tuyến</h3>
                    <p className="text-[11px] text-slate-400">Hệ thống vệ tinh định vị khoảng cách shipper tới điểm giao</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGpsMap(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Map Visualizer Box */}
              <div className="relative h-56 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                {/* Background Grid Pattern simulating GPS map roads */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />

                {/* Simulated Road Lines */}
                <svg className="absolute inset-0 w-full h-full stroke-orange-500/40" strokeWidth="3" fill="none">
                  <path d="M 50 180 Q 200 80, 380 120 T 700 80" strokeDasharray="6 6" />
                </svg>

                {/* Shipper GPS Moving Marker */}
                <div className="absolute left-[35%] top-[45%] flex flex-col items-center animate-bounce">
                  <div className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg shadow-lg flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>Shipper (Cách 1.2km)</span>
                  </div>
                  <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 animate-ping" />
                </div>

                {/* Destination Pin */}
                <div className="absolute right-[25%] top-[35%] flex flex-col items-center">
                  <div className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-lg shadow-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Điểm Giao Hàng Của Bạn</span>
                  </div>
                  <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950" />
                </div>

                {/* Live Driver Telemetry Floating Box */}
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Tốc độ di chuyển</div>
                      <div className="font-extrabold text-amber-400">28 km/h (Đang di chuyển)</div>
                    </div>
                    <div className="h-6 w-px bg-slate-800" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Phương tiện</div>
                      <div className="font-bold text-slate-200">Honda Wave • BKS: 59-P1 888.99</div>
                    </div>
                  </div>

                  <a
                    href={`tel:${trackingData.shipper?.phone.replace(/\D/g, '') || '0901234567'}`}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg flex items-center gap-1 text-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {trackingData.shipper?.name || 'Shipper'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Failed Delivery Alert & Rescheduling Action Box */}
          {trackingData.is_failed_attempt && (
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-rose-500/80 p-5 sm:p-6 rounded-3xl text-white shadow-xl space-y-4 animate-fadeIn relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-rose-500">
                <AlertTriangle className="w-32 h-32" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40 animate-pulse shrink-0">
                    <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider mb-1 border border-rose-500/40">
                      Cảnh báo Vận Chuyển
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-rose-100">
                      Giao Hàng Không Thành Công (Lần {trackingData.failed_attempt_count || 1})
                    </h3>
                    <p className="text-xs text-rose-200/90 mt-1 font-medium leading-relaxed">
                      {trackingData.failed_attempt_reason || 'Shipper đã đến địa chỉ giao hàng nhưng không thể liên lạc được với SĐT khách hàng.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-start">
                  <span className="px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm">
                    ⚠️ Bưu Cục Đang Lưu Kho
                  </span>
                </div>
              </div>

              {/* Info grid */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-rose-500/20 space-y-1">
                  <div className="text-amber-400 font-extrabold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Lưu Kho An Toàn Bưu Cục Phường/Quận:</span>
                  </div>
                  <p className="text-slate-300 font-medium">
                    Kiện hàng công nghệ của bạn được bảo quản niêm phong an toàn tại bưu cục địa phương (Miễn phí lưu giữ 5 ngày).
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-rose-500/20 space-y-1">
                  <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Chính Sách Phát Lại Của TechGear:</span>
                  </div>
                  <p className="text-slate-300 font-medium">
                    Shipper sẽ tự động gọi điện và thử giao lại lần 2 vào ca làm việc tiếp theo. Bạn cũng có thể hẹn lại lịch giờ phát phù hợp bên dưới.
                  </p>
                </div>
              </div>

              {/* Success notification if user rescheduled */}
              {rescheduleSuccessMsg && (
                <div className="relative z-10 p-3.5 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{rescheduleSuccessMsg}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="relative z-10 pt-2 border-t border-rose-500/30 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(!showRescheduleModal)}
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>{showRescheduleModal ? 'Đóng Form Hẹn Lịch' : '📅 Hẹn Lại Lịch Giao Hàng / Cập Nhật SĐT'}</span>
                </button>

                {trackingData.shipper && (
                  <a
                    href={`tel:${trackingData.shipper.phone.replace(/\D/g, '')}`}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Shipper Trực Tiếp: {trackingData.shipper.phone}</span>
                  </a>
                )}
              </div>

              {/* Inline Form for Rescheduling */}
              {showRescheduleModal && (
                <div className="relative z-10 mt-3 p-4 sm:p-5 bg-slate-950/95 rounded-2xl border border-slate-800 text-slate-200 space-y-4 text-xs animate-fadeIn shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="font-black text-white text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>Đăng Ký Khung Giờ Hẹn Giao Lại & Cập Nhật Ghi Chú</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRescheduleModal(false)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Ngày Hẹn Giao Lại (*):</label>
                      <select
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:border-orange-500 focus:outline-none"
                      >
                        <option value="Ngày mai (Ca sáng/Chiều)">Ngày mai (Ca sáng/Chiều)</option>
                        <option value="Ngày kia (Sau 2 ngày)">Ngày kia (Sau 2 ngày)</option>
                        <option value="Cuối tuần (Thứ 7 / Chủ Nhật)">Cuối tuần (Thứ 7 / Chủ Nhật)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Khung Giờ Nhận Hàng (*):</label>
                      <select
                        value={rescheduleSlot}
                        onChange={(e) => setRescheduleSlot(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-semibold focus:border-orange-500 focus:outline-none"
                      >
                        <option value="Sáng (8:00 - 12:00)">Sáng (8:00 - 12:00)</option>
                        <option value="Chiều (13:00 - 17:00)">Chiều (13:00 - 17:00)</option>
                        <option value="Tối (18:00 - 20:30)">Tối (18:00 - 20:30)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">SĐT Nhận Hàng Mới (Nếu đổi):</label>
                      <input
                        type="text"
                        value={reschedulePhone}
                        onChange={(e) => setReschedulePhone(e.target.value)}
                        placeholder="Nhập SĐT nhận hàng mới..."
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Địa Chỉ Nhận Mới (Nếu đổi):</label>
                      <input
                        type="text"
                        value={rescheduleAddress}
                        onChange={(e) => setRescheduleAddress(e.target.value)}
                        placeholder="Nhập địa chỉ nhận hàng..."
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Ghi Chú Cho Shipper:</label>
                    <input
                      type="text"
                      value={rescheduleNote}
                      onChange={(e) => setRescheduleNote(e.target.value)}
                      placeholder="Ví dụ: Gửi bảo vệ chung cư, Gọi SĐT phụ trước 15 phút..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRescheduleSubmit}
                    disabled={submittingReschedule}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submittingReschedule ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Send className="w-4 h-4" />}
                    <span>XÁC NHẬN GỬI YÊU CẦU HẸN GIAO LAI</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. Real-time Shipping Timeline Stepper */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-500" />
              <span>{lang === 'vi' ? 'Lịch Sử Hành Trình Vận Chuyển Real-Time' : 'Real-Time Delivery Timeline'}</span>
            </h3>

            {/* Stepper list */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {trackingData.timeline.map((item, idx) => {
                const isCompleted = item.status === 'completed';
                const isCurrent = item.status === 'current';
                const isCancelled = item.status === 'cancelled';
                const isFailed = item.status === 'failed';
                const isWarning = item.status === 'warning';

                return (
                  <div key={item.id} className="relative flex items-start group">
                    {/* Circle Node Indicator */}
                    <div className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isFailed
                        ? 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-950 font-black animate-bounce'
                        : isWarning
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 dark:ring-amber-950 font-black'
                        : isCancelled
                        ? 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950'
                        : isCompleted
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : isCurrent
                        ? 'bg-orange-500 text-slate-950 ring-4 ring-orange-200 dark:ring-orange-950 animate-pulse font-black'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      ) : isFailed ? (
                        <AlertTriangle className="w-4 h-4 stroke-[3]" />
                      ) : isWarning ? (
                        <Clock className="w-4 h-4 stroke-[3]" />
                      ) : isCancelled ? (
                        <AlertCircle className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Timeline Content Card */}
                    <div className={`flex-1 ml-3 p-4 rounded-2xl border transition-all ${
                      isFailed
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 shadow-xs'
                        : isWarning
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80'
                        : isCurrent
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800/80 shadow-xs'
                        : isCompleted
                        ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                        : 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-200/60 dark:border-slate-800/50 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className={isFailed ? 'text-rose-600 dark:text-rose-400 font-black' : ''}>{item.title}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse">
                              Đang diễn ra
                            </span>
                          )}
                          {isFailed && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                              Giao thất bại
                            </span>
                          )}
                          {isWarning && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                              Lưu kho chờ hẹn
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {item.description}
                      </p>

                      {item.location && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <span>Vị trí: <strong className="text-slate-700 dark:text-slate-200">{item.location}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2.5 Automated Notification Dispatch Audit Trail */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <span>Nhật Ký Thông Báo Tự Động Gửi Đến Bạn (Email & SMS)</span>
              </h3>
              <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] rounded-full border border-blue-500/20">
                {notifLogs.length} thông báo đã phát
              </span>
            </div>

            {notifLogs.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center text-slate-500 text-xs border border-dashed border-slate-300 dark:border-slate-800">
                Mỗi khi đơn hàng đổi trạng thái, hệ thống sẽ tự động gửi Email & SMS BrandName trực tiếp tới quý khách.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notifLogs.map(log => (
                  <div key={log.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {log.type === 'email' ? (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black text-[9px] rounded-md border border-blue-500/20 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> EMAIL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[9px] rounded-md border border-amber-500/20 flex items-center gap-1">
                            <Smartphone className="w-3 h-3" /> SMS
                          </span>
                        )}
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{log.recipient}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{log.created_at}</span>
                    </div>

                    {log.subject && (
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{log.subject}</div>
                    )}

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono whitespace-pre-line bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {log.message}
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Trạng thái phát: {log.status}</span>
                      <span className="italic">{log.provider}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Shipper & Delivery Details + Recipient Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipper & Carrier Info Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-orange-500" />
                  <span>{lang === 'vi' ? 'Nhân Viên Giao Hàng (Shipper)' : 'Assigned Shipper'}</span>
                </h3>

                {trackingData.shipper ? (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {trackingData.shipper.name}
                      </span>
                      <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        ★ {trackingData.shipper.rating || '5.0'} / 5.0
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Phương tiện: {trackingData.shipper.vehicle}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${trackingData.shipper.phone.replace(/\D/g, '')}`}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Gọi Shipper: {trackingData.shipper.phone}</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Chưa phân công nhân viên giao trực tiếp.</p>
                )}
              </div>

              {/* Carrier Warranty Guarantee */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Đơn hàng được bảo hiểm 100% giá trị trong quá trình vận chuyển bởi <strong>TechGear Express</strong>. Quý khách được quyền đồng kiểm cùng shipper trước khi thanh toán.
                </span>
              </div>
            </div>

            {/* Recipient Shipping Address Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{lang === 'vi' ? 'Thông Tin Khách Hàng & Nhận Hàng' : 'Customer & Shipping Address'}</span>
              </h3>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Người nhận:</span>{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">{orderData.user_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Số điện thoại:</span>{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">{orderData.phone}</strong>
                </div>
                {orderData.email && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>{' '}
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{orderData.email}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Địa chỉ giao:</span>{' '}
                  <span className="text-slate-900 dark:text-white font-semibold">{orderData.shipping_address}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Thanh toán:</span>{' '}
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                    orderData.payment_status === 'paid' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {orderData.payment_method} ({orderData.payment_status === 'paid' ? '✓ ĐÃ THANH TOÁN' : '⏳ CHƯA THANH TOÁN'})
                  </span>
                </div>

                {orderData.payment_status === 'paid' && orderData.payment_transaction_id && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-[11px] space-y-1">
                    <p className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Xác thực tự động bởi Cổng Payment Auto
                    </p>
                    <p className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                      Mã GD: {orderData.payment_transaction_id} {orderData.paid_at && `• ${orderData.paid_at}`}
                    </p>
                  </div>
                )}

                {orderData.payment_status !== 'paid' && orderData.payment_method !== 'COD' && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Tự động đối soát thanh toán 24/7
                      </span>
                      <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                        VietQR Auto Check
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      Ngay khi chuyển khoản thành công, hệ thống ngân hàng sẽ tự động cập nhật trạng thái đơn hàng.
                    </p>
                    <button
                      type="button"
                      disabled={autoPayLoading}
                      onClick={handleAutoPayInTracker}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {autoPayLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                      <span>{autoPayLoading ? 'Đang đối soát...' : 'Kiểm tra & Khớp lệnh ngay'}</span>
                    </button>
                  </div>
                )}

                {orderData.note && (
                  <div className="text-slate-600 dark:text-slate-300 italic border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                    Ghi chú: "{orderData.note}"
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* 4. Products in Order & Send Email Receipt */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              <span>{lang === 'vi' ? 'Sản Phẩm Trong Đơn Hàng' : 'Items in Order'}</span>
            </h3>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Số lượng: <strong className="text-slate-900 dark:text-white">{item.quantity}</strong> x {formatVND(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 shrink-0">
                    {formatVND(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Hình thức: <strong className="text-slate-900 dark:text-white">{orderData.payment_method}</strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mr-2">Tổng tiền đơn hàng:</span>
                <span className="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400">
                  {formatVND(orderData.total_amount)}
                </span>
              </div>
            </div>

            {/* Resend Receipt Email Box & View Printable HTML Invoice */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={lang === 'vi' ? 'Nhập Email để nhận Hóa Đơn Điện Tử...' : 'Enter Email for receipt...'}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {sendingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{lang === 'vi' ? 'Gửi Email Hóa Đơn' : 'Send Email Receipt'}</span>
                  </button>
                  <a
                    href={`/api/orders/${orderData.id}/invoice`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Mở Hóa Đơn HTML' : 'View HTML Invoice'}</span>
                  </a>
                </div>
              </div>
              {emailSuccessMsg && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ {emailSuccessMsg}
                </p>
              )}
            </div>

          </div>

        </div>
      ) : null}

      {/* 5. PRINT SHIPPING MANIFEST MODAL */}
      {showPrintModal && orderData && trackingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 animate-fadeIn my-auto">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 text-amber-400 rounded-2xl font-black text-xl tracking-wider">
                  TG
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">PHIẾU VẬN CHUYỂN & ĐỒNG KIỂM</h2>
                  <p className="text-xs text-slate-500 font-semibold">CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHGEAR VIỆT NAM</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Mã Vận Đơn</div>
                <div className="font-mono font-black text-sm text-orange-600">{trackingData.tracking_code}</div>
              </div>
            </div>

            {/* Barcode & Order Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Mã Đơn Hàng: <strong className="text-slate-900 font-mono font-bold">#{orderData.id}</strong></div>
                <div className="text-xs text-slate-500">Đơn vị vận chuyển: <strong className="text-slate-900 font-bold">{trackingData.carrier}</strong></div>
                <div className="text-xs text-slate-500">Trạng thái tiền: <strong className="text-emerald-700 font-bold">{orderData.payment_status === 'paid' ? 'ĐÃ THANH TOÁN (KHO NỘI BỘ)' : 'COD - THU TIỀN TẬN NƠI'}</strong></div>
              </div>

              {/* QR Code Graphic */}
              <div className="p-2 bg-white rounded-xl border border-slate-300 flex flex-col items-center">
                <QrCode className="w-16 h-16 text-slate-900" />
                <span className="text-[9px] font-mono text-slate-500 mt-1">QUÉT MÃ ĐỐI SOÁT</span>
              </div>
            </div>

            {/* Sender & Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-extrabold uppercase text-slate-700 text-[10px] tracking-wider">Từ (Bưu Cục Gửi):</div>
                <div className="font-bold text-slate-900">TechGear Flagship Warehouse</div>
                <div>Tòa nhà TechTower, 123 Nguyễn Huệ, Q.1, TP.HCM</div>
                <div>Hotline: 1900-8888</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border space-y-1">
                <div className="font-extrabold uppercase text-slate-700 text-[10px] tracking-wider">Đến (Người Nhận):</div>
                <div className="font-bold text-slate-900">{orderData.user_name} ({orderData.phone})</div>
                <div className="font-semibold text-slate-800">{orderData.shipping_address}</div>
                {orderData.note && <div className="italic text-slate-500">"Ghi chú: {orderData.note}"</div>}
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2 uppercase">Danh Mục Hàng Hóa Niêm Phong Đồng Kiểm:</div>
              <div className="border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Sản Phẩm</th>
                      <th className="p-2.5 text-center">SL</th>
                      <th className="p-2.5 text-right">Đơn Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderData.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-bold text-slate-900">{it.name}</td>
                        <td className="p-2.5 text-center font-semibold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono font-bold">{formatVND(it.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Collect COD */}
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-2xl">
              <div>
                <div className="text-xs text-orange-800 font-bold">TỔNG TIỀN PHẢI THU SHIPPER (COD):</div>
                <div className="text-xs text-orange-600 font-medium">Khách hàng được mở hàng kiểm tra trước khi nhận</div>
              </div>
              <div className="text-xl font-black text-orange-600 font-mono">
                {orderData.payment_status === 'paid' ? '0 VNĐ (Đã TT)' : formatVND(orderData.total_amount)}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-xs rounded-xl text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>In Phiếu Ngay (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ELECTRONIC WARRANTY MODAL */}
      {showEWarrantyModal && orderData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 border border-slate-800 animate-fadeIn my-auto">
            <button
              onClick={() => setShowEWarrantyModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Thẻ Bảo Hành Điện Tử (E-Warranty)</h2>
                <p className="text-xs text-slate-400">Đơn hàng #{orderData.id} • Tự động kích hoạt 24/7</p>
              </div>
            </div>

            {/* License Card Body */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded uppercase border border-emerald-500/30">
                    Chính Hãng TechGear
                  </span>
                  <h3 className="text-sm font-extrabold text-white mt-1.5">{orderData.user_name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{orderData.phone}</p>
                </div>
                <QrCode className="w-14 h-14 text-emerald-400 p-1 bg-slate-950 rounded-xl border border-emerald-500/30" />
              </div>

              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800">
                <div className="text-slate-400">Sản phẩm kích hoạt bảo hành:</div>
                {orderData.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between font-semibold text-slate-200">
                    <span>• {it.name}</span>
                    <span className="text-emerald-400 font-mono font-bold">12 Tháng</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Ngày kích hoạt: <strong className="text-white">{orderData.created_at}</strong></span>
                <span className="text-emerald-400 font-bold">Trạng thái: Khả dụng</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center font-medium leading-relaxed">
              Quý khách chỉ cần đọc Số Điện Thoại hoặc quét mã QR trên để được bảo hành đổi mới 1:1 tại 120+ trung tâm TechGear trên toàn quốc.
            </p>

            <button
              type="button"
              onClick={() => setShowEWarrantyModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
            >
              Đóng Thẻ Bảo Hành
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
