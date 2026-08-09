import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import { SiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { TechGearLogo } from './TechGearLogo';

interface Props {
  settings: SiteSettings;
  onNavigateTab?: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigateTab }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-xs select-none transition-colors">
      
      {/* Service Guarantees Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-2xs">
            <Truck className="w-5 h-5 text-orange-600 mb-1.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">{lang === 'vi' ? 'Giao Hàng Hỏa Tốc 2H' : '2-Hour Express Delivery'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'vi' ? 'Miễn phí cho đơn từ 2.000.000đ' : 'Free for orders over $100'}</span>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">{lang === 'vi' ? 'Chính Hãng 100%' : '100% Authentic Products'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'vi' ? 'Bảo hành 24-36 tháng 1 đổi 1' : '24-36 months official warranty'}</span>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-2xs">
            <RotateCcw className="w-5 h-5 text-amber-600 mb-1.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">{lang === 'vi' ? '1 Đổi 1 Trong 30 Ngày' : '30-Day Easy Exchange'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'vi' ? 'Đổi trả siêu tốc nếu lỗi NSX' : 'Fast replacement for defect items'}</span>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center shadow-2xs">
            <Headphones className="w-5 h-5 text-blue-600 mb-1.5" />
            <span className="font-bold text-slate-900 dark:text-white text-xs">{lang === 'vi' ? 'Hỗ Trợ Kỹ Thuật 24/7' : '24/7 Technical Support'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'vi' ? 'Tư vấn setup & build PC chuyên nghiệp' : 'Professional PC setup & build advice'}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center">
            <TechGearLogo variant="full" size="md" showSubtitle={true} />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {lang === 'vi' 
              ? 'Hệ thống bán lẻ linh kiện PC, Laptop Gaming & Bàn Phím Cơ hàng đầu.' 
              : 'Leading retail store for PC components, gaming laptops & custom mechanical keyboards.'}
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p>📍 {settings.address || (lang === 'vi' ? '123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh' : '123 Tech Street, District 1, Ho Chi Minh City')}</p>
            <p>📞 Hotline: <strong className="text-orange-600 dark:text-orange-400">{settings.hotline || '1900-TECHGEAR'}</strong></p>
            <p>✉️ Email: {settings.email || 'support@techgear.vn'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 text-orange-600 dark:text-orange-400">
            {lang === 'vi' ? 'DANH MỤC NỔI BẬT' : 'FEATURED CATEGORIES'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{lang === 'vi' ? 'Bàn Phím Cơ Custom High-End' : 'Custom Mechanical Keyboards'}</a></li>
            <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{lang === 'vi' ? 'Chuột Gaming Ultra-Light' : 'Ultra-Light Gaming Mice'}</a></li>
            <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{lang === 'vi' ? 'Tai Nghe Chống Ồn Active ANC' : 'ANC Noise-Canceling Headsets'}</a></li>
            <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{lang === 'vi' ? 'Màn Hình Ultrawide OLED 240Hz' : '240Hz Ultrawide OLED Monitors'}</a></li>
            <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{lang === 'vi' ? 'VGA RTX Series & CPU Combos' : 'RTX Graphics Cards & CPU Combos'}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 text-blue-600 dark:text-blue-400">
            {lang === 'vi' ? 'HỖ TRỢ KHÁCH HÀNG' : 'CUSTOMER SUPPORT'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigateTab && onNavigateTab('orders')}
                className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline transition-colors flex items-center gap-1"
              >
                <span>🔍 {lang === 'vi' ? 'Tra Cứu Đơn Hàng Vãng Lai' : 'Track Guest Order'}</span>
              </button>
            </li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lang === 'vi' ? 'Chính Sách Bảo Hành & Đổi Trả' : 'Warranty & Return Policy'}</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lang === 'vi' ? 'Hướng Dẫn Mua Hàng & Build PC' : 'Buying & PC Building Guide'}</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lang === 'vi' ? 'Phương Thức Thanh Toán & Trả Góp' : 'Payment & Installment Methods'}</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lang === 'vi' ? 'Chính Sách Vận Chuyển Giao Hàng' : 'Shipping & Delivery Policy'}</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{lang === 'vi' ? 'Bảo Mật Thông Tin Khách Hàng' : 'Customer Privacy Policy'}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3 text-emerald-600 dark:text-emerald-400">
            {lang === 'vi' ? 'ĐĂNG KÝ NHẬN VOUCHER DEALS' : 'SUBSCRIBE FOR DEALS'}
          </h4>
          <p className="text-xs mb-3 text-slate-600 dark:text-slate-400">
            {lang === 'vi' ? 'Nhận thông báo mã giảm giá 15% cho đơn hàng tiếp theo.' : 'Get instant 15% discount code for your next order.'}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder={lang === 'vi' ? 'Nhập email của bạn...' : 'Enter your email...'}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-lg transition-colors text-xs uppercase">
              {lang === 'vi' ? 'GỬI' : 'SEND'}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1.5 font-bold">
              {lang === 'vi' ? 'HỖ TRỢ THANH TOÁN:' : 'PAYMENT METHODS:'}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-700 dark:text-slate-300 font-bold">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">VISA</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">MASTERCARD</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-pink-600 dark:text-pink-400">MOMO</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-blue-600 dark:text-blue-400">VNPAY</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-950 transition-colors">
        <p>
          © 2026 {settings.logoText || 'TECHGEAR'} Store. Tất cả quyền được bảo lưu. Hệ thống phân phối linh kiện PC & Gear hàng đầu.
        </p>
      </div>

    </footer>
  );
};

