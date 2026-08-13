import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, defaultText?: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header & Nav
    'nav.home': 'TRANG CHỦ',
    'nav.pcbuilder': 'XÂY DỰNG PC',
    'nav.news': 'TIN TỨC BLOG',
    'nav.admin': 'QUẢN TRỊ ADMIN',
    'nav.login': 'ĐĂNG NHẬP',
    'nav.register': 'ĐĂNG KÝ',
    'nav.logout': 'Đăng Xuất',
    'nav.cart': 'Giỏ hàng',
    'nav.items': 'sản phẩm',
    'nav.search_placeholder': 'Tìm kiếm laptop, card màn hình, CPU, gear gaming...',
    'nav.all_categories': 'DANH MỤC SẢN PHẨM',
    'nav.pdf_report': 'Báo Cáo Đồ Án PDF',
    'nav.light_mode': 'Giao diện Sáng',
    'nav.dark_mode': 'Giao diện Tối',
    'nav.hotline': 'Hotline Tư Vấn',
    'nav.track_order': 'Tra Cứu Đơn Hàng',

    // Product & Store
    'store.hero_title': 'Hệ Thống Linh Kiện & Gaming Gear Hàng Đầu',
    'store.filter_category': 'Danh mục',
    'store.filter_price': 'Khoảng giá',
    'store.sort_by': 'Sắp xếp theo',
    'store.price_asc': 'Giá: Thấp đến Cao',
    'store.price_desc': 'Giá: Cao đến Thấp',
    'store.newest': 'Mới nhất',
    'store.best_seller': 'Bán chạy nhất',
    'store.add_to_cart': 'Thêm Vào Giỏ',
    'store.buy_now': 'Mua Ngay',
    'store.view_detail': 'Xem Chi Tiết',
    'store.in_stock': 'Còn hàng',
    'store.out_of_stock': 'Hết hàng',
    'store.specs': 'Thông số kỹ thuật',
    'store.warranty': 'Bảo hành',
    'store.months': 'tháng',

    // Cart Modal
    'cart.title': 'Giỏ Hàng Của Bạn',
    'cart.empty': 'Giỏ hàng đang trống',
    'cart.empty_desc': 'Hãy chọn những sản phẩm gaming gear hoặc linh kiện ưng ý nhé!',
    'cart.total': 'Tổng tiền thanh toán:',
    'cart.checkout': 'Tiến Hành Thanh Toán',
    'cart.continue': 'Tiếp Tục Mua Hàng',
    'cart.remove': 'Xóa',

    // PC Builder
    'pc.title': 'Công Cụ Tự Xây Dựng Cấu Hình PC',
    'pc.subtitle': 'Tự do lựa chọn linh kiện tương thích, tối ưu hiệu năng và ngân sách của bạn',
    'pc.total_price': 'Tổng Chi Phí:',
    'pc.total_wattage': 'Công Suất Tiêu Thụ:',
    'pc.psu_recommend': 'Nguồn Khuyên Dùng:',
    'pc.add_all_cart': 'Thêm Tất Cả Vào Giỏ Hàng',
    'pc.clear_build': 'Làm Mới Cấu Hình',
    'pc.export_pdf': 'Xuất File Cấu Hình PDF',
    'pc.select_component': 'Chọn Linh Kiện',
    'pc.change_component': 'Đổi Linh Kiện',

    // Auth
    'auth.title': 'Đăng Nhập Tài Khoản',
    'auth.register_title': 'Đăng Ký Thành Viên Mới',
    'auth.email': 'Địa chỉ Email',
    'auth.password': 'Mật khẩu',
    'auth.confirm_password': 'Xác nhận lại mật khẩu',
    'auth.fullname': 'Họ và Tên',
    'auth.submit_login': 'XÁC NHẬN ĐĂNG NHẬP',
    'auth.submit_register': 'HOÀN TẤT ĐĂNG KÝ',
    'auth.role_notice': 'Tự động nhận phân quyền vai trò theo tài khoản đăng nhập.',

    // Admin Layout
    'admin.dashboard': 'Dashboard Thống Kê',
    'admin.products': 'Quản Lý Sản Phẩm',
    'admin.orders': 'Quản Lý Đơn Hàng',
    'admin.users': 'Quản Lý Người Dùng',
    'admin.banners': 'Quản Lý Banner Banner',
    'admin.settings': 'Cấu Hình Giao Diện',
    'admin.exit': 'Quay Lại Trang Mua Hàng',
    'admin.access_denied': 'TRUY CẬP BỊ TỪ CHỐI (403)',

    // Common
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.status': 'Trạng thái',
    'common.action': 'Thao tác',
    'common.search': 'Tìm kiếm',
    'common.success': 'Thành công',
    'common.error': 'Có lỗi xảy ra',
    'common.language': 'Ngôn ngữ',
  },
  en: {
    // Header & Nav
    'nav.home': 'HOME',
    'nav.pcbuilder': 'PC BUILDER',
    'nav.news': 'NEWS & BLOG',
    'nav.admin': 'ADMIN PANEL',
    'nav.login': 'LOG IN',
    'nav.register': 'REGISTER',
    'nav.logout': 'Log Out',
    'nav.cart': 'Cart',
    'nav.items': 'items',
    'nav.search_placeholder': 'Search laptops, graphics cards, CPUs, gaming gear...',
    'nav.all_categories': 'CATEGORIES',
    'nav.pdf_report': 'Project Report PDF',
    'nav.light_mode': 'Light Mode',
    'nav.dark_mode': 'Dark Mode',
    'nav.hotline': 'Support Hotline',
    'nav.track_order': 'Track Order',

    // Product & Store
    'store.hero_title': 'Premium PC Components & Gaming Gear Store',
    'store.filter_category': 'Category',
    'store.filter_price': 'Price Range',
    'store.sort_by': 'Sort By',
    'store.price_asc': 'Price: Low to High',
    'store.price_desc': 'Price: High to Low',
    'store.newest': 'Newest Arrivals',
    'store.best_seller': 'Best Sellers',
    'store.add_to_cart': 'Add to Cart',
    'store.buy_now': 'Buy Now',
    'store.view_detail': 'View Details',
    'store.in_stock': 'In Stock',
    'store.out_of_stock': 'Out of Stock',
    'store.specs': 'Specifications',
    'store.warranty': 'Warranty',
    'store.months': 'months',

    // Cart Modal
    'cart.title': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty_desc': 'Explore our gaming gear and components to add items to your cart!',
    'cart.total': 'Total Amount:',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continue': 'Continue Shopping',
    'cart.remove': 'Remove',

    // PC Builder
    'pc.title': 'Custom PC Builder Tool',
    'pc.subtitle': 'Pick compatible components, optimize performance, and tailor your budget',
    'pc.total_price': 'Total Estimated Cost:',
    'pc.total_wattage': 'Total Power Draw:',
    'pc.psu_recommend': 'Recommended PSU:',
    'pc.add_all_cart': 'Add All Components to Cart',
    'pc.clear_build': 'Reset Build',
    'pc.export_pdf': 'Export Build Sheet (PDF)',
    'pc.select_component': 'Select Component',
    'pc.change_component': 'Change Component',

    // Auth
    'auth.title': 'Account Sign In',
    'auth.register_title': 'Create New Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.fullname': 'Full Name',
    'auth.submit_login': 'SIGN IN',
    'auth.submit_register': 'COMPLETE REGISTRATION',
    'auth.role_notice': 'Automatic role-based permissions assigned upon login.',

    // Admin Layout
    'admin.dashboard': 'Analytics Dashboard',
    'admin.products': 'Product Management',
    'admin.orders': 'Order Management',
    'admin.users': 'User Management',
    'admin.banners': 'Banner Settings',
    'admin.settings': 'Store Customization',
    'admin.exit': 'Return to Storefront',
    'admin.access_denied': 'ACCESS DENIED (403)',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.status': 'Status',
    'common.action': 'Actions',
    'common.search': 'Search',
    'common.success': 'Success',
    'common.error': 'An error occurred',
    'common.language': 'Language',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('techgear_lang');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('techgear_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const t = (key: string, defaultText?: string) => {
    return translations[lang][key] || defaultText || translations['vi'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
