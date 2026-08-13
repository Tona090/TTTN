import React from 'react';
import { X, FileText, CheckCircle2, ShoppingBag, Server, Database, Code, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfAnalysisModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Phân Tích File PDF Đồ Án Tốt Nghiệp & Định Hướng Ecommerce
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tài liệu đồ án Web Fullstack - Xây dựng Website Thương Mại Điện Tử
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          {/* Section 1: Summary of Requirements */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              1. Tóm Tắt Yêu Cầu Cốt Lõi Từ File PDF
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">💻 Kiến Trúc & Công Nghệ:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Frontend:</strong> ReactJS (Vite), React Router DOM, TailwindCSS, Axios/Fetch, State Management.</li>
                  <li><strong>Backend:</strong> NodeJS + ExpressJS, RESTful API, JWT Authentication, bcrypt, Multer Upload.</li>
                  <li><strong>Database:</strong> MySQL (Phân tầng Cơ sở dữ liệu 7+ bảng chính).</li>
                </ul>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white block mb-1">🎯 2 Phân Hệ Chính:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Client (Khách hàng):</strong> Trang chủ (Banner, SP Mới/Bán chạy/Giảm giá, News), Trang SP (Lọc giá/Danh mục, Phân trang, Tìm kiếm), Giỏ hàng, Chi tiết SP, Đăng ký/Đăng nhập JWT.</li>
                  <li><strong>Admin (Quản trị):</strong> Dashboard thống kê biểu đồ, Quản lý CRUD Sản Phẩm, Danh Mục, Banner, Tin Tức, Người Dùng (SuperAdmin/Admin/Editor), Cấu Hình Giao Diện.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Recommended Ecommerce Product Strategy */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
            <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-2 text-base">
              <ShoppingBag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              2. Gợi Ý Ngách Sản Phẩm Tốt Nhất Để Triển Khai (TechGear Studio)
            </h3>
            <p className="mb-3 text-xs">
              Dựa trên đặc thù đồ án tốt nghiệp Ngành Công Nghệ Thông Tin / Web Fullstack, ngách <strong>"Đồ Công Nghệ & Phụ Kiện Desk Setup (TechGear Studio)"</strong> là sự lựa chọn số 1 với các lý do:
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">🔥 Tính Hình Ảnh Cao</span>
                Bàn phím cơ Custom, chuột Ergonomic, tai nghe chống ồn có thiết kế hiện đại, dễ dàng gây ấn tượng mạnh với Hội đồng chấm đồ án ngay từ trang chủ.
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">🏷️ Thông Số Kỹ Thuật Phong Phú</span>
                Mỗi sản phẩm có đầy đủ giá gốc, giá khuyến mãi (Mới/Bán chạy/Giảm giá), cùng thông số kỹ thuật (Switch, Layout, Pin, Cảm biến) làm nổi bật tính chi tiết của database.
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">🌗 Dark/Light Mode Hoàn Hảo</span>
                Sản phẩm công nghệ kết hợp với tính năng chuyển đổi giao diện Sáng/Tối (Dark/Light mode) nâng tầm trải nghiệm như các trang e-commerce hàng đầu (Apple, Razer).
              </div>
            </div>
          </div>

          {/* Section 3: Database & API Blueprint */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 text-base">
              <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              3. Sơ Đồ Cơ Sở Dữ Liệu & API RESTful Đã Tích Hợp
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block mb-2">🗄️ Các Bảng Cơ Sở Dữ Liệu (Database Tables):</span>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
                  <div>- <span className="text-blue-600 dark:text-blue-400">users</span> (id, name, email, password_hash, role)</div>
                  <div>- <span className="text-blue-600 dark:text-blue-400">categories</span> (id, name, description, status)</div>
                  <div>- <span className="text-blue-600 dark:text-blue-400">products</span> (id, category_id, name, image, price, sale_price, quantity, is_new, is_sale, is_best)</div>
                  <div>- <span className="text-blue-600 dark:text-blue-400">banners</span> (id, title, image, link, status)</div>
                  <div>- <span className="text-blue-600 dark:text-blue-400">news</span> (id, title, image, content, created_at)</div>
                  <div>- <span className="text-blue-600 dark:text-blue-400">orders & order_items</span> (id, user_id, items, total_amount, status)</div>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block mb-2">⚡ API Endpoints Đã Sẵn Sàng (Express Backend):</span>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
                  <div><span className="text-emerald-600 font-bold">POST</span> /api/auth/register & /api/auth/login</div>
                  <div><span className="text-blue-600 font-bold">GET</span> /api/products (Hỗ trợ lọc giá, danh mục, phân trang)</div>
                  <div><span className="text-amber-600 font-bold">CRUD</span> /api/categories, /api/banners, /api/news</div>
                  <div><span className="text-purple-600 font-bold">CRUD</span> /api/users (Phân quyền SuperAdmin, Admin, Editor)</div>
                  <div><span className="text-indigo-600 font-bold">GET</span> /api/stats (Số liệu biểu đồ Recharts cho Dashboard)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tips for Defense / Graduation Showcase */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-2 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              4. Mẹo Báo Cáo Bảo Vệ Đồ Án Điểm Cao
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li><strong>Thao tác Phân quyền (Role Demo):</strong> Sử dụng tính năng "Đăng nhập nhanh 1-Click" sẵn có để minh họa sự khác biệt giữa tài khoản <em>Khách hàng (User)</em>, <em>Biên tập viên (Editor)</em>, và <em>Quản trị viên tối cao (SuperAdmin)</em>.</li>
              <li><strong>Demo Cấu Hình Giao Diện Động (Dynamic UI Settings):</strong> Vào phần Admin &gt; Cấu hình giao diện để bật/tắt mục Sản phẩm mới, Bán chạy, Giảm giá và thấy Trang chủ tự động phản hồi tức thì.</li>
              <li><strong>Biểu đồ Thống kê Dashboard:</strong> Nhấn mạnh việc sử dụng thư viện Recharts kết hợp với API thống kê tổng doanh thu, tổng đơn hàng và doanh số theo tháng.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
          >
            Đã Hiểu & Trải Nghiệm Website
          </button>
        </div>

      </div>
    </div>
  );
};
