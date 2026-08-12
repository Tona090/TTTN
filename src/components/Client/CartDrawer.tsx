import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, ShoppingBag, CreditCard, CheckCircle2, ArrowRight, Tag, 
  QrCode, DollarSign, Wallet, ShieldCheck, Copy, Check, Lock, Building2,
  Percent, Sparkles, Clock, Smartphone, BadgePercent, Printer, ArrowLeft,
  User as UserIcon, LogIn, UserCheck, Loader2, RefreshCw, Upload, Image as ImageIcon, FileText, Eye, Mail, Send
} from 'lucide-react';
import { Product, User, SiteSettings } from '../../types';
import { createOrder, fetchSettings, notifyTransfer, sendReceiptEmail, checkOrderPaymentStatus, triggerAutoPayment } from '../../services/api';
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
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [orderNote, setOrderNote] = useState('');
  
  // Email receipt delivery state
  const [receiptEmailInput, setReceiptEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  
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
  const [transferStatus, setTransferStatus] = useState<'idle' | 'verifying' | 'notified'>('idle');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(propSettings || null);

  // Auto payment gateway state
  const [autoPayLoading, setAutoPayLoading] = useState(false);
  const [autoPaidTxn, setAutoPaidTxn] = useState<string | null>(null);
  const [autoPaidGateway, setAutoPaidGateway] = useState<string | null>(null);

  // Auto-polling for payment gateway confirmation
  useEffect(() => {
    if (step !== 'success' || !placedOrderInfo?.id) return;
    if (placedOrderInfo.payment_status === 'paid' || autoPaidTxn) return;

    const interval = setInterval(async () => {
      try {
        const res = await checkOrderPaymentStatus(placedOrderInfo.id);
        if (res.payment_status === 'paid') {
          setAutoPaidTxn(res.payment_transaction_id || `TXN-AUTO-${Date.now()}`);
          setAutoPaidGateway(res.payment_gateway_name || 'Cổng Payment Gateway Auto');
          setPlacedOrderInfo((prev: any) => prev ? { ...prev, payment_status: 'paid', payment_transaction_id: res.payment_transaction_id } : null);
          setTransferStatus('notified');
        }
      } catch (e) {
        // ignore transient errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, placedOrderInfo?.id, autoPaidTxn]);

  const handleTriggerAutoPay = async () => {
    if (!placedOrderInfo?.id) return;
    setAutoPayLoading(true);
    try {
      const res = await triggerAutoPayment(placedOrderInfo.id, placedOrderInfo.paymentMethod);
      if (res.success) {
        setAutoPaidTxn(res.transaction_id);
        setAutoPaidGateway(res.order.payment_gateway_name || 'Cổng Payment Gateway Auto');
        setPlacedOrderInfo((prev: any) => prev ? { ...prev, payment_status: 'paid', payment_transaction_id: res.transaction_id } : null);
        setTransferStatus('notified');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi xác thực cổng thanh toán');
    } finally {
      setAutoPayLoading(false);
    }
  };

  // Reset form & payment state whenever drawer is opened or user changes
  useEffect(() => {
    if (isOpen) {
      setPaymentVerified(false);
      setTransferStatus('idle');
      setReceiptImage(null);
      setAutoPaidTxn(null);
      setAutoPaidGateway(null);
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

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng ảnh tối đa 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotifyTransfer = async () => {
    if (!placedOrderInfo?.id) return;
    setTransferStatus('verifying');
    try {
      await new Promise(r => setTimeout(r, 800));
      await notifyTransfer(placedOrderInfo.id, receiptImage || undefined);
      setTransferStatus('notified');
      setPaymentVerified(true);

      if (placedOrderInfo) {
        setPlacedOrderInfo({
          ...placedOrderInfo,
          payment_status: 'pending_verification',
          payment_receipt_url: receiptImage || placedOrderInfo.payment_receipt_url
        });
      }

      if (!user) {
        try {
          const guestOrders = JSON.parse(localStorage.getItem('techgear_guest_orders') || '[]');
          const updated = guestOrders.map((o: any) => o.id === placedOrderInfo.id ? { 
            ...o, 
            payment_status: 'pending_verification',
            payment_receipt_url: receiptImage || o.payment_receipt_url
          } : o);
          localStorage.setItem('techgear_guest_orders', JSON.stringify(updated));
        } catch (e) {
          console.error('Error updating guest order transfer status:', e);
        }
      }
    } catch (err) {
      setTransferStatus('notified');
      setPaymentVerified(true);
    }
  };

  const handleCloseDrawer = () => {
    setStep('cart');
    setPaymentVerified(false);
    setTransferStatus('idle');
    setReceiptImage(null);
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
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();

    if (!cleanName || cleanName.length < 3) {
      setError(lang === 'vi' 
        ? 'Họ và tên người nhận không hợp lệ! Vui lòng nhập tối thiểu 3 ký tự (Ví dụ: Nguyễn Văn A).' 
        : 'Invalid recipient name! Please enter at least 3 characters.');
      return;
    }

    // Strict regex check for Vietnamese mobile numbers (10 digits starting with 03, 05, 07, 08, 09)
    const phoneRegex = /^(03|05|07|08|09)+[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError(lang === 'vi' 
        ? 'Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số di động Việt Nam (Ví dụ: 0398933652 hoặc 0908123456).' 
        : 'Invalid phone number! Please enter a valid 10-digit phone number starting with 03, 05, 07, 08, 09.');
      return;
    }

    if (!cleanAddress || cleanAddress.length < 10) {
      setError(lang === 'vi' 
        ? 'Địa chỉ giao hàng quá ngắn! Vui lòng nhập chi tiết Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố (Tối thiểu 10 ký tự).' 
        : 'Shipping address is too short! Please enter house number, street, ward, and city (Min 10 characters).');
      return;
    }

    if (paymentMethod === 'CARD' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvc)) {
      setError(lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin thẻ Visa/Mastercard.' : 'Please enter full credit card details.');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentVerified(false);
    setTransferStatus('idle');

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
        email: email.trim(),
        user_name: fullName,
        payment_method: paymentMethod,
        installment_months: paymentMethod === 'INSTALLMENT' ? installmentMonths : undefined,
        note: orderNote,
        voucher_code: appliedVoucher?.code,
        discount_amount: discountAmount
      });

      // Always save order in localStorage so guest & logged-in users can access locally
      try {
        const existingGuestOrders = JSON.parse(localStorage.getItem('techgear_guest_orders') || '[]');
        const updated = [orderData, ...existingGuestOrders.filter((o: any) => o.id !== orderData.id)];
        localStorage.setItem('techgear_guest_orders', JSON.stringify(updated.slice(0, 30)));
      } catch (err) {
        console.error('Error saving order locally:', err);
      }

      setPlacedOrderInfo({
        ...orderData,
        user_name: fullName,
        shipping_address: address,
        phone: phone,
        email: email.trim() || user?.email || '',
        paymentMethod,
        installmentMonths,
        selectedBank,
        orderNote,
        totalAmount
      });

      setReceiptEmailInput(email.trim() || user?.email || '');
      setEmailSent(false);
      setEmailSuccessMsg(null);

      // Auto send receipt email if email is provided
      const targetEmail = email.trim() || user?.email || '';
      if (targetEmail && targetEmail.includes('@')) {
        sendReceiptEmail(orderData.id, targetEmail)
          .then(res => {
            setEmailSent(true);
            setEmailSuccessMsg(res.message);
          })
          .catch(console.error);
      }

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
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {step === 'cart' && `${t('cart.title', 'Giỏ Hàng')} (${cartItems.length})`}
                {step === 'checkout' && (lang === 'vi' ? 'Thanh Toán' : 'Checkout')}
                {step === 'success' && (lang === 'vi' ? 'Hoàn Tất Đơn Hàng' : 'Order Placed')}
              </h3>
              <p className="text-[10px] text-slate-500">
                {step === 'cart' && 'Kiểm tra sản phẩm & mã giảm giá'}
                {step === 'checkout' && 'Nhập thông tin giao hàng & thanh toán'}
                {step === 'success' && 'Thông tin đơn hàng & thanh toán'}
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
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs">Tài khoản: <span className="font-bold">{user.name}</span></p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between text-amber-900 dark:text-amber-200">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs">Khách vãng lai</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-300">Đăng nhập để tích điểm & tự động điền địa chỉ</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="ml-2 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] whitespace-nowrap shadow-xs transition-colors flex items-center gap-1 shrink-0"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Đăng nhập</span>
                  </button>
                </div>
              )}

              {error && (
                <div className="p-2.5 text-red-600 bg-red-50 border border-red-200 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* 1. SHIPPING DETAILS */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1">
                  1. {lang === 'vi' ? 'Thông tin giao hàng' : 'Shipping Details'}
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'e.g. John Doe'}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0908123456"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Email (không bắt buộc)' : 'Email (optional)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="khachhang@gmail.com"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Địa chỉ giao hàng *' : 'Delivery Address *'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === 'vi' ? 'Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/TP...' : 'Street address, city...'}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Ghi chú (tùy chọn)' : 'Note (optional)'}
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder={lang === 'vi' ? 'Ví dụ: Giao giờ hành chính, gọi trước khi giao...' : 'e.g. Call before delivery...'}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. PAYMENT METHODS SELECTION */}
              <div className="space-y-2.5 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                  <span>2. {lang === 'vi' ? 'Phương Thức Thanh Toán' : 'Payment Method'}</span>
                  <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Thanh toán an toàn
                  </span>
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  
                  {/* VIETQR BANK TRANSFER */}
                  <div
                    onClick={() => setPaymentMethod('VIETQR')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'VIETQR'
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <span>Chuyển Khoản VietQR 24/7</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Quét mã QR tự động qua app ngân hàng.
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
                      <div className="mt-2.5 pt-2 border-t border-blue-200 dark:border-blue-900 space-y-1.5">
                        <label className="block text-[10px] font-semibold text-blue-900 dark:text-blue-300">
                          Ngân hàng nhận khoản:
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {supportedBanks.map(b => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedBank(b.name); }}
                              className={`p-1 rounded-lg border text-[10px] font-semibold text-center transition-all ${
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'VNPAY'
                        ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 ring-1 ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 font-bold text-xs">
                          VN
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                            <span>VNPAY QR</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Thanh toán qua ứng dụng ngân hàng hoặc ví VNPAY.
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'MOMO'
                        ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 ring-1 ring-pink-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-pink-600 text-white shrink-0">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            Ví Ví MoMo / ZaloPay
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Thanh toán nhanh qua ví điện tử.
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-1 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-600 text-white shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            Thẻ Tín Dụng / Ghi Nợ (Visa, Mastercard)
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Thanh toán an toàn qua thẻ quốc tế.
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
                      <div className="mt-2.5 pt-2.5 border-t border-purple-200 dark:border-purple-900 space-y-2 text-[11px]" onClick={e => e.stopPropagation()}>
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Số thẻ *</label>
                          <input
                            type="text"
                            placeholder="4123 4567 8901 2345"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Tên chủ thẻ *</label>
                            <input
                              type="text"
                              placeholder="NGUYEN VAN A"
                              value={cardHolder}
                              onChange={e => setCardHolder(e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Hạn dùng</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={e => setCardExpiry(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-center text-xs"
                              />
                            </div>
                            <div>
                              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-0.5">CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                placeholder="123"
                                value={cardCvc}
                                onChange={e => setCardCvc(e.target.value)}
                                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-center text-xs"
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'INSTALLMENT'
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-1 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 shrink-0 font-bold">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            Trả Góp 0% Lãi Suất
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Chia nhỏ trả hàng tháng qua thẻ tín dụng hoặc ví trả sau.
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
                      <div className="mt-2.5 pt-2 border-t border-amber-200 dark:border-amber-900 space-y-1.5" onClick={e => e.stopPropagation()}>
                        <label className="block text-[10px] font-semibold text-amber-900 dark:text-amber-300">
                          Kỳ hạn trả góp:
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {[3, 6, 9, 12].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setInstallmentMonths(m)}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                                installmentMonths === m
                                  ? 'border-amber-500 bg-amber-500 text-slate-950 font-bold shadow-xs'
                                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div>{m} tháng</div>
                              <div className="text-[9px] opacity-80">{formatVND(Math.round(totalAmount / m))}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            Thanh Toán Khi Nhận Hàng (COD)
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Thanh toán tiền mặt cho nhân viên giao hàng.
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
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs"
              >
                {loading 
                  ? (lang === 'vi' ? 'Đang xử lý...' : 'Processing...') 
                  : (lang === 'vi' ? `Đặt Hàng (${formatVND(totalAmount)})` : `Place Order (${formatVND(totalAmount)})`)}
              </button>

              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium rounded-xl text-slate-700 dark:text-slate-300 transition-colors text-xs"
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

              {/* AUTO-PAYMENT GATEWAY REALTIME LISTENER BANNER */}
              {placedOrderInfo?.paymentMethod !== 'COD' && (
                <div>
                  {(autoPaidTxn || placedOrderInfo?.payment_status === 'paid') ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 shadow-xs space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ĐÃ XÁC NHẬN THANH TOÁN TỰ ĐỘNG
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[9px] uppercase tracking-wider">
                          Đã khớp lệnh
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 space-y-0.5">
                        <p>Mã Giao Dịch: <strong className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{autoPaidTxn || placedOrderInfo?.payment_transaction_id || 'TXN-PAID-SUCCESS'}</strong></p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                          ✓ Giao dịch đã được Cổng Ngân hàng đối soát thành công. Đơn hàng đang được chuẩn bị đóng gói!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                            Tự động xác nhận giao dịch 24/7
                          </span>
                        </div>
                        <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                          VietQR Auto Check
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                        Sau khi quét mã QR chuyển khoản, hệ thống sẽ tự động cập nhật trạng thái đơn hàng trong vài giây mà không cần gửi biên lai.
                      </p>
                      <div className="pt-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 italic">Đang chờ ngân hàng báo có...</span>
                        <button
                          type="button"
                          disabled={autoPayLoading}
                          onClick={handleTriggerAutoPay}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {autoPayLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                          <span>{autoPayLoading ? 'Đang đối soát...' : 'Kiểm tra & Khớp lệnh ngay'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                        transferStatus === 'notified' 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : transferStatus === 'verifying'
                          ? 'bg-blue-600 text-white flex items-center gap-1'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {transferStatus === 'notified' ? '⏳ CHỜ KẾ TOÁN ĐỐI SOÁT' : transferStatus === 'verifying' ? 'ĐANG ĐỐI SOÁT...' : 'CHỜ TỰ ĐỘNG'}
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
                        
                        <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/60 space-y-2">
                          <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            📸 Tải ảnh biên lai / Ảnh chụp chuyển khoản (Không bắt buộc):
                          </label>
                          {receiptImage ? (
                            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-blue-300 dark:border-blue-700">
                              <img src={receiptImage} alt="Biên lai chuyển khoản" className="w-10 h-10 object-cover rounded border" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
                                  <Check className="w-3 h-3 shrink-0" /> Đã chọn ảnh biên lai
                                </p>
                                <p className="text-[9px] text-slate-400">Ảnh sẽ gửi cho Admin xác minh</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setReceiptImage(null)}
                                className="px-1.5 py-0.5 text-[9px] bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold"
                              >
                                Xóa
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-dashed border-blue-300 dark:border-blue-700 rounded-xl cursor-pointer text-[10px] text-blue-600 dark:text-blue-400 font-bold transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Chọn ảnh chụp màn hình bill chuyển tiền</span>
                              <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
                            </label>
                          )}
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bAcc)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            {copiedAccount ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAccount ? 'Đã sao chép STK' : 'Sao Chép STK'}</span>
                          </button>

                          {transferStatus === 'idle' && (
                            <button
                              type="button"
                              onClick={handleNotifyTransfer}
                              className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition-colors shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{receiptImage ? 'Gửi ảnh & Báo đã chuyển' : 'Tôi đã chuyển khoản'}</span>
                            </button>
                          )}

                          {transferStatus === 'verifying' && (
                            <button
                              disabled
                              type="button"
                              className="px-2.5 py-1 bg-blue-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 opacity-90 cursor-wait"
                            >
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Đang gửi thông báo...</span>
                            </button>
                          )}

                          {transferStatus === 'notified' && (
                            <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Đã báo chuyển khoản</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {transferStatus === 'notified' && (
                      <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1.5 animate-fade-in">
                        <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-black text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            Đã gửi thông báo cho Kế Toán đối soát!
                          </span>
                          <span className="text-[9px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-300/50">
                            ⏳ Chờ Xác Minh Thanh Toán
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-tight">
                          Đơn hàng <strong className="font-mono font-bold">#{placedOrderInfo?.id}</strong> đang ở trạng thái: <span className="underline font-extrabold">Chờ kế toán đối soát biến động số dư</span>. Quản trị viên sẽ xem xét bill chuyển khoản và kích hoạt đơn hàng trong ít phút.
                        </p>

                        {(receiptImage || placedOrderInfo?.payment_receipt_url) && (
                          <div className="mt-2 p-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2">
                            <img src={receiptImage || placedOrderInfo?.payment_receipt_url} alt="Biên lai đã gửi" className="w-12 h-12 object-cover rounded border" />
                            <div className="text-[10px] flex-1">
                              <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <FileText className="w-3 h-3 text-blue-500" /> Ảnh biên lai đã đính kèm
                              </p>
                              <p className="text-[9px] text-slate-500">Kế toán sẽ kiểm tra hình ảnh này để duyệt đơn ngay.</p>
                            </div>
                          </div>
                        )}
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <button 
                            type="button"
                            onClick={handleNotifyTransfer}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 text-[10px]"
                          >
                            <RefreshCw className="w-3 h-3" /> Kiểm tra lại sao kê
                          </button>
                          <span className="text-slate-500 dark:text-slate-400 text-[9px]">Hotline / Zalo: 1900-8888</span>
                        </div>
                      </div>
                    )}
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

                        {transferStatus === 'idle' && (
                          <button
                            type="button"
                            onClick={handleNotifyTransfer}
                            className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tôi đã chuyển MoMo</span>
                          </button>
                        )}

                        {transferStatus === 'verifying' && (
                          <button
                            disabled
                            type="button"
                            className="px-2.5 py-1 bg-pink-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 opacity-90 cursor-wait"
                          >
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Đang đối soát MoMo...</span>
                          </button>
                        )}

                        {transferStatus === 'notified' && (
                          <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã báo chuyển MoMo</span>
                          </span>
                        )}
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

              {/* E-RECEIPT & EMAIL NOTIFICATION BOX */}
              <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200 text-xs flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-500" /> Gửi Hóa Đơn Điện Tử & Thông Báo Qua Email
                  </span>
                  {emailSent && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded text-[9px]">
                      ✓ Đã Gửi Email
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                  Gửi bản sao hóa đơn, mã đơn <strong className="font-mono font-bold">#{placedOrderInfo?.id}</strong> và link theo dõi tiến độ giao hàng về email người nhận.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="email"
                    value={receiptEmailInput}
                    onChange={(e) => setReceiptEmailInput(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white text-xs"
                  />
                  <button
                    type="button"
                    disabled={emailSending}
                    onClick={async () => {
                      const target = receiptEmailInput.trim() || placedOrderInfo?.email || email || user?.email || '';
                      if (!target || !target.includes('@')) {
                        alert('Vui lòng nhập địa chỉ email hợp lệ');
                        return;
                      }
                      setEmailSending(true);
                      try {
                        const res = await sendReceiptEmail(placedOrderInfo?.id, target);
                        setEmailSent(true);
                        setEmailSuccessMsg(res.message || `Đã gửi hóa đơn về ${target}`);
                      } catch (err: any) {
                        alert('Lỗi: ' + (err.message || 'Chưa gửi được email'));
                      } finally {
                        setEmailSending(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                  >
                    {emailSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{emailSending ? 'Đang gửi...' : 'Gửi Email Bill'}</span>
                  </button>
                </div>

                {emailSuccessMsg && (
                  <div className="p-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-[10px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{emailSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* GUEST REASSURANCE NOTICE */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[10px] text-amber-900 dark:text-amber-200 space-y-1">
                <p className="font-extrabold text-xs flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-amber-500" /> Lưu mã đơn hàng để tra cứu
                </p>
                <p>
                  Mã đơn hàng: <strong className="font-mono font-bold text-amber-700 dark:text-amber-300 text-xs">#{placedOrderInfo?.id}</strong>. Dùng <strong>Mã đơn hàng + Số điện thoại ({placedOrderInfo?.phone})</strong> để tra cứu tại mục <strong>"Tra Cứu Đơn Hàng"</strong> trên menu.
                </p>
              </div>

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
