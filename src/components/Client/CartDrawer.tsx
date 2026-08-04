import React, { useState, useEffect } from 'react';
import { 
  X, Trash2, ShoppingBag, CreditCard, CheckCircle2, ArrowRight, Tag, 
  QrCode, Landmark, DollarSign, Wallet, ShieldCheck, Copy, Check
} from 'lucide-react';
import { Product, CartItem, User, SiteSettings } from '../../types';
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR' | 'MOMO'>('COD');
  
  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; type: 'percent' | 'amount' | 'freeship'; value: number } | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(propSettings || null);

  // Sync propSettings or fetch fresh settings when cart opens
  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
    }
  }, [propSettings]);

  useEffect(() => {
    if (isOpen) {
      fetchSettings()
        .then(s => {
          if (s) setSettings(s);
        })
        .catch(console.error);
    }
  }, [isOpen]);

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
    } else if (code === 'VIP50K') {
      setAppliedVoucher({ code: 'VIP50K', type: 'amount', value: 50000 });
    } else if (code === 'FREESHIP') {
      setAppliedVoucher({ code: 'FREESHIP', type: 'freeship', value: 0 });
    } else {
      setVoucherError(lang === 'vi' ? 'Mã voucher không hợp lệ! Thử: TECHGEAR10, VIP50K, FREESHIP' : 'Invalid code! Try: TECHGEAR10, VIP50K, FREESHIP');
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

    setLoading(true);
    setError(null);

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
        note: orderNote,
        voucher_code: appliedVoucher?.code,
        discount_amount: discountAmount
      });

      setPlacedOrderInfo({
        ...orderData,
        user_name: fullName,
        shipping_address: address,
        phone: phone,
        paymentMethod,
        orderNote,
        totalAmount
      });

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              {step === 'cart' && `${t('cart.title', 'Giỏ Hàng')} (${cartItems.length})`}
              {step === 'checkout' && (lang === 'vi' ? 'Xác Nhận & Thanh Toán' : 'Checkout & Payment')}
              {step === 'success' && (lang === 'vi' ? 'Đặt Hàng Thành Công' : 'Order Placed Successfully')}
            </h3>
          </div>
          <button
            onClick={() => {
              setStep('cart');
              onClose();
            }}
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
                        className="w-14 h-14 object-cover rounded-xl bg-white"
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
                            className="p-1 text-red-500 hover:text-red-700 rounded-lg"
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
                          placeholder={lang === 'vi' ? 'Nhập mã giảm giá (TECHGEAR10)' : 'Promo Code'}
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

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-red-600 bg-red-50 border border-red-200 rounded-xl text-[11px]">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1">
                  1. {lang === 'vi' ? 'Thông Tin Nhận Hàng' : 'Shipping Details'}
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
                    {lang === 'vi' ? 'Số điện thoại liên hệ *' : 'Phone Number *'}
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
                    placeholder={lang === 'vi' ? 'Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP...' : 'Street address, city...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Ghi chú cho shipper / kỹ thuật viên (Tùy chọn)' : 'Order Note (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder={lang === 'vi' ? 'Ví dụ: Giao giờ hành chính, lắp sẵn fan LED...' : 'e.g. Call before delivery...'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2.5 pt-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-800 pb-1">
                  2. {lang === 'vi' ? 'Chọn Phương Thức Thanh Toán' : 'Payment Method'}
                </h4>

                <div className="grid grid-cols-1 gap-2">
                  
                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-orange-500 bg-orange-500/10 text-slate-900 dark:text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="font-bold">{lang === 'vi' ? 'Thanh toán khi nhận hàng (COD)' : 'Cash on Delivery (COD)'}</div>
                      <span className="text-[10px] text-slate-500 block">Thanh toán bằng tiền mặt khi shipper giao tới.</span>
                    </div>
                  </label>

                  {/* VIETQR */}
                  <label
                    onClick={() => setPaymentMethod('VIETQR')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'VIETQR'
                        ? 'border-orange-500 bg-orange-500/10 text-slate-900 dark:text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>Chuyển Khoản Ngân Hàng VietQR</span>
                        <span className="px-1.5 py-0.2 rounded bg-blue-600 text-white text-[9px] font-black">Khuyên dùng</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">Quét mã QR tự động từ ứng dụng ngân hàng bất kỳ.</span>
                    </div>
                  </label>

                  {/* MOMO */}
                  <label
                    onClick={() => setPaymentMethod('MOMO')}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'MOMO'
                        ? 'border-orange-500 bg-orange-500/10 text-slate-900 dark:text-white font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-bold">{lang === 'vi' ? 'Ví Điện Tử MoMo / ZaloPay' : 'E-Wallet MoMo'}</div>
                      <span className="text-[10px] text-slate-500 block">Thanh toán qua mã QR Ví điện tử.</span>
                    </div>
                  </label>

                </div>
              </div>

              {/* Confirm Buttons */}
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

          {/* STEP 3: SUCCESS & PAYMENT DETAILS */}
          {step === 'success' && (
            <div className="p-4 space-y-4 my-auto">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {lang === 'vi' ? 'Đặt Hàng Thành Công!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'vi' 
                    ? `Mã đơn hàng: #${placedOrderInfo?.id || 'TG-' + Date.now().toString().slice(-6)}` 
                    : `Order ID: #${placedOrderInfo?.id || 'TG-' + Date.now().toString().slice(-6)}`}
                </p>
              </div>

              {/* VietQR Bank Transfer Box */}
              {placedOrderInfo?.paymentMethod === 'VIETQR' && (() => {
                const bName = settings?.bankName || propSettings?.bankName || 'MBBank';
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
                const bCode = bankCodeMap[bName] || (bName === 'Vietcombank' ? 'VCB' : bName === 'Techcombank' ? 'TCB' : 'MB');

                return (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-800 pb-2">
                      <span className="font-extrabold text-blue-900 dark:text-blue-300 text-xs flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-blue-500" />
                        Thông Tin Chuyển Khoản Ngân Hàng VietQR
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <img
                        src={`https://img.vietqr.io/image/${bCode}-${bAcc}-compact2.png?amount=${placedOrderInfo?.totalAmount}&addInfo=TECHGEAR%20DON%20${placedOrderInfo?.id}`}
                        alt="VietQR Bank Transfer"
                        className="w-36 h-36 object-contain bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
                      />
                      <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 flex-1">
                        <p><strong>Ngân hàng:</strong> {bName}</p>
                        <p><strong>Số tài khoản:</strong> <span className="font-mono font-bold text-orange-500">{bAcc}</span></p>
                        <p><strong>Chủ tài khoản:</strong> <span className="uppercase font-bold">{bOwner}</span></p>
                        <p><strong>Số tiền:</strong> <strong className="text-blue-600 dark:text-blue-400">{formatVND(placedOrderInfo?.totalAmount)}</strong></p>
                        <p><strong>Nội dung:</strong> <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-bold">TECHGEAR DON {placedOrderInfo?.id}</span></p>
                        
                        <button
                          onClick={() => copyToClipboard(bAcc)}
                          className="mt-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAccount ? 'Đã sao chép STK' : 'Sao chép Số Tài Khoản'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* MoMo Box */}
              {placedOrderInfo?.paymentMethod === 'MOMO' && (
                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-900 space-y-3">
                  <div className="flex items-center justify-between border-b border-pink-200 dark:border-pink-800 pb-2">
                    <span className="font-extrabold text-pink-900 dark:text-pink-300 text-xs flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-pink-500" />
                      Mã QR Thanh Toán Ví Điện Tử MoMo
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
                        <QrCode className="w-3 h-3" /> Mở app MoMo để quét
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 flex-1">
                      <p><strong>Ví MoMo:</strong> Ví điện tử MoMo / ZaloPay</p>
                      <p><strong>Số điện thoại:</strong> <span className="font-mono font-bold text-pink-600 dark:text-pink-400">0908123456</span></p>
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
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary details */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1.5">
                <p className="font-extrabold text-slate-900 dark:text-white text-xs border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">
                  📋 Thông Tin Khách Hàng Nhận Hàng:
                </p>
                <p>👤 Người nhận: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.user_name}</strong></p>
                <p>📞 Điện thoại: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.phone}</strong></p>
                <p>📍 Địa chỉ giao: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.shipping_address}</strong></p>
                <p>🚚 Phương thức: <strong className="text-orange-600 dark:text-orange-400">{placedOrderInfo?.paymentMethod === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : placedOrderInfo?.paymentMethod === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Ví MoMo'}</strong></p>
                {placedOrderInfo?.orderNote && (
                  <p>📝 Ghi chú: <strong className="text-slate-900 dark:text-white">{placedOrderInfo?.orderNote}</strong></p>
                )}
              </div>

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl shadow-md transition-colors uppercase tracking-wider text-xs"
              >
                {lang === 'vi' ? 'Tiếp Tục Mua Sắm' : 'Continue Shopping'}
              </button>
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
