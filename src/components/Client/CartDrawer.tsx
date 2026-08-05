import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, ShoppingBag, CreditCard, CheckCircle2, ArrowRight, Tag, 
  QrCode, DollarSign, Wallet, ShieldCheck, Copy, Check, Lock, Building2,
  Percent, Sparkles, Clock, Smartphone, BadgePercent, Printer, ArrowLeft,
  User as UserIcon, LogIn, UserCheck
} from 'lucide-react';
import { Product, User, SiteSettings } from '../../types';
import { createOrder, fetchSettings } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { product: Product; quantity: number }[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  user: User | null;
  onOpenAuth: () => void;
  settings?: SiteSettings | null;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuth,
  settings: propSettings
}) => {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState(user?.name || '');
  const [orderNote, setOrderNote] = useState('');
  
  // Payment Method Selection
  type PaymentMethod = 'COD' | 'VIETQR' | 'MOMO' | 'VNPAY' | 'CARD' | 'INSTALLMENT';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('VIETQR');
  
  // Extra payment configuration state
  const [selectedBank, setSelectedBank] = useState<string>('MBBank');
  const [installmentMonths, setInstallmentMonths] = useState<number>(6);
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; type: 'percent' | 'amount' | 'freeship'; value: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(propSettings || null);

  // Reset form & payment state whenever drawer is opened or user changes
  useEffect(() => {
    if (isOpen) {
      setPaymentVerified(false);
      setError(null);

      if (user) {
        setFullName(user.name || '');
        if (user.phone) setPhone(user.phone);
      } else {
        // Clear guest inputs if drawer opens freshly so stale data isn't retained
        if (!placedOrderInfo) {
          setFullName('');
          setPhone('');
          setAddress('');
          setOrderNote('');
        }
      }

      fetchSettings()
        .then(s => {
          if (s) setSettings(s);
        })
        .catch(console.error);
    }
  }, [isOpen, user]);

  const handleCloseDrawer = () => {
    setStep('cart');
    setPaymentVerified(false);
    setPlacedOrderInfo(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Calculate Shipping
  let shippingFee = subtotal > 2000000 ? 0 : 30000;
  if (appliedVoucher?.type === 'freeship') {
    shippingFee = 0;
  }

  // Calculate Voucher Discount Amount
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedVoucher.value) / 100);
    } else if (appliedVoucher.type === 'amount') {
      discountAmount = appliedVoucher.value;
    }
  }

  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);
    const code = voucherCode.trim().toUpperCase();

    if (code === 'TECHGEAR10') {
      setAppliedVoucher({ code: 'TECHGEAR10', type: 'percent', value: 10 });
    } else if (code === 'VIP50K' || code === 'VNPAY50K') {
      setAppliedVoucher({ code: code, type: 'amount', value: 50000 });
    } else if (code === 'FREESHIP') {
      setAppliedVoucher({ code: 'FREESHIP', type: 'freeship', value: 0 });
    } else {
      setVoucherError(lang === 'vi' ? 'Mã không hợp lệ! Thử: TECHGEAR10, VNPAY50K, FREESHIP' : 'Invalid promo! Try: TECHGEAR10, VNPAY50K, FREESHIP');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone || !fullName) {
      setError(lang === 'vi' 
        ? 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.' 
        : 'Please fill in full name, phone number, and delivery address.');
      return;
    }

    if (paymentMethod === 'CARD' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvc)) {
      setError(lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin thẻ Visa/Mastercard.' : 'Please enter full credit card details.');
      return;
    }

    setLoading(true);
    setError(null);
    // Explicitly reset payment verification status to false for the new order
    setPaymentVerified(false);

    try {
      const orderData = await createOrder({
        items: cartItems.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.sale_price ?? item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        total_amount: totalAmount,
        shipping_address: address,
        phone,
        user_name: fullName,
        payment_method: paymentMethod,
        installment_months: paymentMethod === 'INSTALLMENT' ? installmentMonths : undefined,
        note: orderNote,
        voucher_code: appliedVoucher?.code,
        discount_amount: discountAmount
      });

      // If placing as guest user, store order in localStorage so guest can track it
      if (!user) {
        try {
          const existingGuestOrders = JSON.parse(localStorage.getItem('techgear_guest_orders') || '[]');
          existingGuestOrders.unshift(orderData);
          localStorage.setItem('techgear_guest_orders', JSON.stringify(existingGuestOrders.slice(0, 20)));
        } catch (err) {
          console.error('Error saving guest order locally:', err);
        }
      }

      setPlacedOrderInfo({
        ...orderData,
        user_name: fullName,
        shipping_address: address,
        phone: phone,
        paymentMethod,
        installmentMonths,
        selectedBank,
        orderNote,
        totalAmount
      });

      // Clear card input fields
      setCardNumber('');
      setCardHolder('');
      setCardExpiry('');
      setCardCvc('');

      onClearCart();
      setStep('success');
    } catch (err: any) {
      setError(err.message || (lang === 'vi' ? 'Lỗi đặt hàng.' : 'Order processing error.'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Supported Banks List
  const supportedBanks = [
    { code: 'MB', name: 'MBBank', label: 'Ngân hàng Quân Đội' },
    { code: 'VCB', name: 'Vietcombank', label: 'Ngoại Thương Việt Nam' },
    { code: 'TCB', name: 'Techcombank', label: 'Kỹ Thương Việt Nam' },
    { code: 'ICB', name: 'VietinBank', label: 'Công Thương Việt Nam' },
    { code: 'BIDV', name: 'BIDV', label: 'Đầu Tư & Phát Triển' },
    { code: 'VPB', name: 'VPBank', label: 'Việt Nam Thịnh Vượng' },
    { code: 'ACB', name: 'ACB', label: 'Á Châu' },
    { code: 'TPB', name: 'TPBank', label: 'Tiên Phong' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            {step !== 'cart' && (
              <button 
                onClick={() => setStep(step === 'success' ? 'cart' : 'cart')}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg mr-1 text-slate-500"
                title="Quay lại"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {step === 'cart' && `${t('cart.title', 'Giỏ Hàng')} (${cartItems.length})`}
                {step === 'checkout' && (lang === 'vi' ? 'Thanh Toán & Cổng Chuyển Khoản' : 'Checkout & Payment Portal')}
                {step === 'success' && (lang === 'vi' ? 'Hoàn Tất Đơn Hàng' : 'Order Placed')}
              </h3>
              <p className="text-[10px] text-slate-500">
                {step === 'cart' && 'Kiểm tra sản phẩm & mã khuyến mãi'}
                {step === 'checkout' && 'Chọn phương thức & thông tin nhận hàng'}
                {step === 'success' && 'Thông tin thanh toán & hoá đơn điện tử'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="font-bold text-slate-700 dark:text-slate-300">{t('cart.empty', 'Giỏ hàng của bạn đang trống')}</p>
                  <p className="text-[11px]">{t('cart.empty_desc', 'Hãy lựa chọn các sản phẩm công nghệ ưng ý để trải nghiệm nhé.')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl bg-white border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-orange-600 dark:text-orange-400 font-extrabold mt-0.5">
                          {formatVND(item.product.sale_price ?? item.product.price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="font-bold px-1 hover:text-orange-500"
                            >
                              -
                            </button>
                            <span className="font-bold px-1 text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="font-bold px-1 hover:text-orange-500"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                            title={t('cart.remove', 'Xóa khỏi giỏ')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Voucher Section */}
                  <div className="pt-2">
                    <form onSubmit={handleApplyVoucher} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          placeholder={lang === 'vi' ? 'Nhập mã: TECHGEAR10, VNPAY50K, FREESHIP' : 'Promo Code'}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px] uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-[11px]"
                      >
                        {lang === 'vi' ? 'Áp Dụng' : 'Apply'}
                      </button>
                    </form>

                    {appliedVoucher && (
                      <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-between text-[11px]">
                        <span>
                          🎉 {lang === 'vi' ? 'Đã áp dụng voucher:' : 'Voucher applied:'} <strong>{appliedVoucher.code}</strong>
                        </span>
                        <button
                          onClick={() => { setAppliedVoucher(null); setVoucherCode(''); }}
                          className="text-red-500 font-bold hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    )}

                    {voucherError && (
                      <p className="mt-1 text-[10px] text-red-500 font-semibold">{voucherError}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT METHOD SELECTOR */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* User Account / Guest Status Banner */}
              {user ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[11px]">Đang thanh toán với tài khoản: <span className="underline font-extrabold">{user.name}</span></p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{user.email} • Tự động tích điểm & theo dõi đơn hàng</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-amber-900 dark:text-amber-200">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold text-[11px]">Bạn đang mua hàng với tư cách <span className="text-amber-600 dark:text-amber-400 font-extrabold">Khách Vãng Lai</span></p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-300">Đăng nhập để tích điểm, tự động điền địa chỉ & xem lịch sử đơn hàng.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg text-[10px] whitespace-nowrap shadow-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Đăng Nhập</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded-xl text-[11px]">
                  {error}
                </div>
              )}

              {/* 1. SHIPPING DETAILS */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                  <span>1. {lang === 'vi' ? 'Thông Tin Nhận Hàng' : 'Shipping Details'}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Giao hàng toàn quốc
                  </span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Họ và tên người nhận *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'vi' ? 'Ví dụ: Nguyễn Minh Toàn' : 'e.g. John Doe'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Số điện thoại nhận hàng *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0908123456"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Địa chỉ giao hàng chi tiết *' : 'Delivery Address *'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === 'vi' ? 'Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP...' : 'Street address, city...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Ghi chú cho kỹ thuật viên / shipper (Tùy chọn)' : 'Order Note (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder={lang === 'vi' ? 'Ví dụ: Cài sẵn Win 11, lắp fan LED, giao giờ hành chính...' : 'e.g. Call before delivery...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 2. PAYMENT METHODS SELECTION */}
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                  <span>2. {lang === 'vi' ? 'Phương Thức Thanh Toán' : 'Payment Method'}</span>
                  <span className="text-[10px] text-orange-500 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Bảo mật SSL 256-bit
                  </span>
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  
                  {/* VIETQR BANK TRANSFER */}
                  <div
                    onClick={() => setPaymentMethod('VIETQR')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'VIETQR'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Chuyển Khoản Ngân Hàng VietQR 24/7</span>
                            <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-black">Khuyên Dùng</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Mở ứng dụng ngân hàng quét mã QR tự động điền STK & số tiền.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'VIETQR'}
                        onChange={() => setPaymentMethod('VIETQR')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* Bank selector options when VietQR is selected */}
                    {paymentMethod === 'VIETQR' && (
                      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-900 space-y-2">
                        <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-300">
                          Chọn Ngân Hàng Nhận Chuyển Khoản:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {supportedBanks.map(b => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedBank(b.name); }}
                              className={`p-1.5 rounded-xl border text-[10px] font-bold text-center transition-all ${
                                selectedBank === b.name
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VNPAY */}
                  <div
                    onClick={() => setPaymentMethod('VNPAY')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'VNPAY'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-red-600 text-white shrink-0 font-black text-xs">
                          VN
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Thanh Toán VNPAY QR</span>
                            <span className="px-1.5 py-0.2 rounded bg-red-500 text-white text-[9px] font-black">Giảm 50K</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Cổng VNPAY liên kết 32+ ngân hàng Việt Nam & Ví VNPAY.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'VNPAY'}
                        onChange={() => setPaymentMethod('VNPAY')}
                        className="text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* MOMO / ZALOPAY */}
                  <div
                    onClick={() => setPaymentMethod('MOMO')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'MOMO'
                        ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 ring-2 ring-pink-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-pink-600 text-white shrink-0">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Ví Điện Tử MoMo / ZaloPay</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Thanh toán nhanh qua ứng dụng MoMo / ZaloPay với 1 chạm.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'MOMO'}
                        onChange={() => setPaymentMethod('MOMO')}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  {/* CREDIT / DEBIT CARD */}
                  <div
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Thẻ Tín Dụng / Ghi Nợ (Visa, Mastercard, JCB)</span>
                            <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-black">3D Secure</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Mã hoá an toàn tiêu chuẩn thẻ quốc tế, xác minh OTP.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    {/* Card Form when Card is selected */}
                    {paymentMethod === 'CARD' && (
                      <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-900 space-y-2.5 text-[11px]" onClick={e => e.stopPropagation()}>
                        <div>
                          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Số Thẻ Tín Dụng / Ghi Nợ *</label>
                          <input
                            type="text"
                            placeholder="4123 4567 8901 2345"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tên Chủ Thẻ *</label>
                            <input
                              type="text"
                              placeholder="NGUYEN MINH TOAN"
                              value={cardHolder}
                              onChange={e => setCardHolder(e.target.value.toUpperCase())}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hạn Dùng</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CVV/CVC</label>
                              <input
                                type="password"
                                maxLength={4}
                                placeholder="123"
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 0% INSTALLMENT */}
                  <div
                    onClick={() => setPaymentMethod('INSTALLMENT')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'INSTALLMENT'
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 font-extrabold">
                          <Percent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Trả Góp 0% Lãi Suất (Thẻ Tín Dụng / Fundiin)</span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black">Lãi Suất 0%</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Chia nhỏ trả hàng tháng qua Thẻ Tín Dụng hoặc Ví Trả Sau Fundiin / Kredivo.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'INSTALLMENT'}
                        onChange={() => setPaymentMethod('INSTALLMENT')}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                    </div>

                    {/* Installment breakdown options */}
                    {paymentMethod === 'INSTALLMENT' && (
                      <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-900 space-y-2" onClick={e => e.stopPropagation()}>
                        <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          Chọn Kỳ Hạn Trả Góp 0% Lãi Suất:
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[3, 6, 9, 12].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setInstallmentMonths(m)}
                              className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                                installmentMonths === m
                                  ? 'border-amber-500 bg-amber-500 text-slate-950 font-black shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div>{m} Tháng</div>
                              <div className="text-[9px] opacity-80">{formatVND(Math.round(totalAmount / m))}/tháng</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            Thanh Toán Khi Nhận Hàng (COD)
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Thanh toán bằng tiền mặt trực tiếp cho Shipper khi giao tới tận nơi.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider text-xs"
              >
                {loading 
                  ? (lang === 'vi' ? 'Đang khởi tạo đơn hàng...' : 'Submitting order...') 
                  : (lang === 'vi' ? `XÁC NHẬN ĐẶT HÀNG (${formatVND(totalAmount)})` : `CONFIRM ORDER (${formatVND(totalAmount)})`)}
              </button>

              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
              >
                {lang === 'vi' ? 'Quay lại giỏ hàng' : 'Back to cart'}
              </button>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS & PAYMENT RECEIPT */}
          {step === 'success' && (
            <div className="p-1 space-y-4 my-auto">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {lang === 'vi' ? 'Đặt Hàng Thành Công!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Mã Đơn Hàng: <strong className="text-slate-900 dark:text-white font-mono">#{placedOrderInfo?.id || 'TG-' + Date.now().toString().slice(-6)}</strong>
                </p>
              </div>

              {/* VIETQR / VNPAY Payment Box */}
              {(placedOrderInfo?.paymentMethod === 'VIETQR' || placedOrderInfo?.paymentMethod === 'VNPAY') && (() => {
                const bName = placedOrderInfo?.selectedBank || settings?.bankName || 'MBBank';
                const bAcc = settings?.bankAccountNo || propSettings?.bankAccountNo || '0382903129';
                const bOwner = settings?.bankAccountName || propSettings?.bankAccountName || 'TECHGEAR INC STORE';

                const bankCodeMap: Record<string, string> = {
                  MBBank: 'MB',
                  Vietcombank: 'VCB',
                  Techcombank: 'TCB',
                  VietinBank: 'ICB',
                  BIDV: 'BIDV',
                  VPBank: 'VPB',
                  ACB: 'ACB',
                  TPBank: 'TPB'
                };
                const bCode = bankCodeMap[bName] || 'MB';

                return (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-2">
                      <span className="font-extrabold text-blue-900 dark:text-blue-300 text-xs flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-blue-500" />
                        Chuyển Khoản {placedOrderInfo?.paymentMethod === 'VNPAY' ? 'VNPAY QR' : 'VietQR 24/7'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px]">
                        {paymentVerified ? 'ĐÃ XÁC NHẬN' : 'CHỜ TỰ ĐỘNG'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative group p-2 bg-white rounded-xl border border-blue-200 shadow-sm flex flex-col items-center">
                        <img
                          src={`https://img.vietqr.io/image/${bCode}-${bAcc}-compact2.png?amount=${placedOrderInfo?.totalAmount}&addInfo=TECHGEAR%20DON%20${placedOrderInfo?.id}`}
                          alt="VietQR Bank Transfer"
                          className="w-36 h-36 object-contain bg-white rounded-lg"
                        />
                        <span className="text-[9px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                          <QrCode className="w-3 h-3" /> Quét mã để thanh toán
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 flex-1">
                        <p><strong>Ngân hàng:</strong> {bName}</p>
                        <p><strong>Số tài khoản:</strong> <span className="font-mono font-bold text-orange-500">{bAcc}</span></p>
                        <p><strong>Chủ tài khoản:</strong> <span className="uppercase font-bold">{bOwner}</span></p>
                        <p><strong>Số tiền:</strong> <strong className="text-blue-600 dark:text-blue-400">{formatVND(placedOrderInfo?.totalAmount)}</strong></p>
                        <p><strong>Nội dung:</strong> <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold">TECHGEAR DON {placedOrderInfo?.id}</span></p>
                        
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(bAcc)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            {copiedAccount ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAccount ? 'Đã sao chép STK' : 'Sao Chép STK'}</span>
                          </button>

                          <button
                            onClick={() => setPaymentVerified(true)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                              paymentVerified 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{paymentVerified ? 'Đã xác nhận' : 'Tôi đã chuyển khoản'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* MOMO Box */}
              {placedOrderInfo?.paymentMethod === 'MOMO' && (
                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-pink-200 dark:border-pink-800 pb-2">
                    <span className="font-extrabold text-pink-900 dark:text-pink-300 text-xs flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-pink-500" />
                      Mã QR Thanh Toán Ví Điện Tử MoMo / ZaloPay
                    </span>
                    <span className="px-2 py-0.5 rounded bg-pink-600 text-white font-black text-[9px] uppercase">
                      MoMo Pay
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative group p-2 bg-white rounded-xl border border-pink-200 shadow-sm flex flex-col items-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2|99|0908123456|TECHGEAR%20STORE||0|0|${placedOrderInfo?.totalAmount}|TG%20${placedOrderInfo?.id}`}
                        alt="MoMo QR Code"
                        className="w-36 h-36 object-contain rounded-lg"
                      />
                      <span className="text-[9px] font-bold text-pink-600 mt-1 flex items-center gap-1">
                        <QrCode className="w-3 h-3" /> Mở app MoMo quét
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 flex-1">
                      <p><strong>Số điện thoại MoMo:</strong> <span className="font-mono font-bold text-pink-600 dark:text-pink-400">0908123456</span></p>
                      <p><strong>Tên tài khoản:</strong> TECHGEAR STORE</p>
                      <p><strong>Số tiền thanh toán:</strong> <strong className="text-pink-600 dark:text-pink-400">{formatVND(placedOrderInfo?.totalAmount)}</strong></p>
                      <p><strong>Lời nhắn / Nội dung:</strong> <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-pink-200 dark:border-slate-700 font-bold text-pink-700 dark:text-pink-300">TG {placedOrderInfo?.id}</span></p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => copyToClipboard('0908123456')}
                          className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAccount ? 'Đã chép SĐT MoMo' : 'Sao chép SĐT'}</span>
                        </button>

                        <button
                          onClick={() => setPaymentVerified(true)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            paymentVerified 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{paymentVerified ? 'Đã xác nhận' : 'Tôi đã chuyển MoMo'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INSTALLMENT Box */}
              {placedOrderInfo?.paymentMethod === 'INSTALLMENT' && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-2xl text-[11px] space-y-2">
                  <p className="font-extrabold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-500" /> Hồ Sơ Trả Góp 0% Lãi Suất
                  </p>
                  <p>Kỳ hạn trả góp: <strong>{placedOrderInfo?.installmentMonths} Tháng</strong></p>
                  <p>Số tiền mỗi tháng: <strong className="text-amber-600 dark:text-amber-400 font-bold">{formatVND(Math.round(placedOrderInfo?.totalAmount / (placedOrderInfo?.installmentMonths || 6)))}/tháng</strong></p>
                  <p className="text-[10px] text-slate-500">Chuyên viên tư vấn trả góp sẽ liên hệ trực tiếp qua số điện thoại <strong>{placedOrderInfo?.phone}</strong> để xác nhận thủ tục trong 15 phút.</p>
                </div>
              )}

              {/* Order Summary details */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1.5">
                <p className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 pb-1 mb-1 flex items-center justify-between">
                  <span>📋 Thông Tin Khách Hàng & Giao Hàng:</span>
                  <span className="text-[10px] text-orange-500 font-bold">TECHGEAR Official Receipt</span>
                </p>
                <p>👤 Người nhận: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.user_name}</strong></p>
                <p>📞 Điện thoại: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.phone}</strong></p>
                <p>📍 Địa chỉ giao: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.shipping_address}</strong></p>
                <p>🚚 Phương thức: <strong className="text-orange-600 dark:text-orange-400">
                  {placedOrderInfo?.paymentMethod === 'COD' && 'Tiền mặt khi nhận hàng (COD)'}
                  {placedOrderInfo?.paymentMethod === 'VIETQR' && 'Chuyển khoản Ngân hàng VietQR 24/7'}
                  {placedOrderInfo?.paymentMethod === 'VNPAY' && 'Thanh toán Cổng VNPAY QR'}
                  {placedOrderInfo?.paymentMethod === 'MOMO' && 'Ví điện tử MoMo Pay'}
                  {placedOrderInfo?.paymentMethod === 'CARD' && 'Thẻ Tín Dụng Quốc Tế (Visa/Mastercard)'}
                  {placedOrderInfo?.paymentMethod === 'INSTALLMENT' && `Trả Góp 0% (${placedOrderInfo?.installmentMonths} tháng)`}
                </strong></p>
                {placedOrderInfo?.orderNote && (
                  <p>📝 Ghi chú: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.orderNote}</strong></p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Hoá Đơn</span>
                </button>

                <button
                  onClick={() => {
                    setStep('cart');
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl shadow-md transition-colors uppercase tracking-wider text-xs"
                >
                  {lang === 'vi' ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer Summary */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-3">
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{lang === 'vi' ? 'Tạm tính:' : 'Subtotal:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatVND(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{lang === 'vi' ? 'Giảm giá Voucher:' : 'Voucher Discount:'}</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{lang === 'vi' ? 'Phí vận chuyển:' : 'Shipping fee:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shippingFee === 0 ? (lang === 'vi' ? 'Miễn phí' : 'Free') : formatVND(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>{t('cart.total', 'Tổng tiền thanh toán:')}</span>
                <span className="text-orange-600 dark:text-orange-400">{formatVND(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('checkout')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider text-xs"
            >
              <span>{t('cart.checkout', 'Tiến Hành Thanh Toán')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
