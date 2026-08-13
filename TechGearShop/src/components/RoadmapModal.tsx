import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Clock, ShieldCheck, ShoppingCart, Lock, Database, 
  BarChart3, Search, Sparkles, X, ChevronRight, Pin, Rocket, Info, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartCategory?: (catIndex: number) => void;
}

export const RoadmapModal: React.FC<Props> = ({ isOpen, onClose, onStartCategory }) => {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-orange-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/20 border border-orange-500/30 text-orange-400">
              <Pin className="w-6 h-6 rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-orange-500 text-slate-950 uppercase">
                  Ghim Lộ Trình
                </span>
                <span className="text-xs text-orange-400 font-semibold">TechGear Enterprise eCommerce</span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-0.5">
                {lang === 'vi' ? 'Lộ Trình Xây Dựng & Đưa System Vào Kinh Doanh' : 'Full Project Roadmap & Launch Milestones'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
            <Rocket className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                🎉 ĐÃ HOÀN THÀNH TOÀN BỘ 4 HẠNG MỤC DỰ ÁN DỰ THI/TỐT NGHIỆP ENTERPRISE
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Đã hoàn thành toàn bộ hệ thống e-Commerce bao gồm Tối ưu SEO On-Page, OpenGraph, Sitemap XML, Trợ Lý AI Gemini Tư Vấn PC & Viết Bài Marketing 24/7.
              </p>
            </div>
          </div>

          {/* Roadmap Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Hạng mục 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border-2 border-emerald-500 shadow-lg relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> HẠNG MỤC 1 (ĐÃ HOÀN THÀNH 100%)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tiến độ: 100%
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Hoàn Thiện Mua Hàng & Thanh Toán e-Commerce
              </h3>

              <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>1.1. Giao diện Đăng nhập Tối giản:</strong> Chuẩn responsive, tích hợp đăng nhập bằng Google & Facebook.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>1.2. Thanh toán Đa phương thức:</strong> COD, VietQR tự động, Ví MoMo mã QR, Mã giảm giá (Voucher).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>1.3. Quản lý Đơn hàng Chi tiết:</strong> Khách nhập đúng tên/SĐT/địa chỉ, theo dõi Timeline, tải hóa đơn PDF.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>1.4. Công cụ PC Builder:</strong> Kiểm tra độ tương thích socket, tính Watt, tải báo giá .TXT & 1-click thêm giỏ hàng.</span>
                </li>
              </ul>
            </div>

            {/* Hạng mục 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border-2 border-emerald-500 shadow-lg relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" /> HẠNG MỤC 2 (ĐÃ HOÀN THÀNH 100%)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tiến độ: 100%
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Hạ Tầng & Bảo Mật Toàn Diện Thực Tế
              </h3>

              <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>2.1. Biến Môi Trường (.env Secret):</strong> Cấu hình JWT_SECRET, Database URI & Port bảo mật trong file `.env`.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>2.2. Rate Limiting & Security Headers:</strong> Tích hợp middleware chống Spam/DDoS, XSS protection & OWASP standards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>2.3. Cơ sở Dữ liệu Độc lập & Bền vững:</strong> Tự động lưu/khôi phục dữ liệu đệm `data_store.json` không sợ mất khi restart.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>2.4. Phân Quyền RBAC Backend Chặt Chẽ:</strong> Chặn truy cập trái phép bằng JWT Token, kiểm tra vai trò SuperAdmin/Admin/Editor.</span>
                </li>
              </ul>
            </div>

            {/* Hạng mục 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border-2 border-emerald-500 shadow-lg relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> HẠNG MỤC 3 (ĐÃ HOÀN THÀNH 100%)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tiến độ: 100%
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Quản Trị Cửa Hàng & Vận Hành Bán Hàng
              </h3>

              <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>3.1. Quản lý Kho Hàng & Biến Thể SKU:</strong> Cảnh báo sắp hết/hết hàng realtime, nhập/xuất kho tự động, nhật ký giao dịch, mã SKU & cấu hình biến thể sản phẩm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>3.2. Báo Cáo Doanh Thu Theo Thời Gian:</strong> Đồ thị Area/Bar Recharts phân tích doanh thu & lợi nhuận theo Hôm nay/7 ngày/30 ngày, top sản phẩm bán chạy & xuất báo cáo CSV.</span>
                </li>
              </ul>
            </div>

            {/* Hạng mục 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border-2 border-emerald-500 shadow-lg relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> HẠNG MỤC 4 (ĐÃ HOÀN THÀNH 100%)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Tiến độ: 100%
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Tối Ưu SEO, AI Marketing & Tăng Trưởng
              </h3>

              <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>4.1. SEO On-page & OpenGraph:</strong> Cấu hình Meta Description, Keywords, Schema.org JSON-LD & tự động sinh `/sitemap.xml` & `/robots.txt`.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong>4.2. Trợ Lý AI Gemini Tư Vấn 24/7 & Viết Bài:</strong> Chatbot tư vấn PC Builder & gợi ý sản phẩm realtime, cùng công cụ viết mô tả sản phẩm chuẩn SEO bằng AI.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-orange-500" />
            <span>Lộ trình được ghim sẵn trong thanh Header để bạn theo dõi mọi lúc.</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Đã Hiểu & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
