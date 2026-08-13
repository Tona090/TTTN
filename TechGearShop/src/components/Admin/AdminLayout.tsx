import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Box,
  TrendingUp,
  Layers,
  Image,
  Newspaper,
  Users,
  Settings,
  Store,
  ShieldCheck,
  ShieldAlert,
  LogIn
} from 'lucide-react';
import { User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { TechGearLogo } from '../TechGearLogo';

interface Props {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({
  user,
  activeTab,
  setActiveTab,
  onExitAdmin,
  children
}) => {
  const { lang, t } = useLanguage();
  const canAccessAdmin = user && ['SuperAdmin', 'Admin', 'Editor'].includes(user.role);

  const menuItems = [
    { id: 'dashboard', labelVi: 'Dashboard Thống Kê', labelEn: 'Dashboard Overview', icon: LayoutDashboard, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'orders', labelVi: 'Quản Lý Đơn Hàng', labelEn: 'Order Management', icon: ShoppingCart, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'inventory', labelVi: 'Quản Lý Kho & SKU', labelEn: 'Inventory & SKU', icon: Box, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'analytics', labelVi: 'Báo Cáo Doanh Thu', labelEn: 'Revenue Analytics', icon: TrendingUp, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'products', labelVi: 'Quản Lý Sản Phẩm', labelEn: 'Product Management', icon: Package, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'categories', labelVi: 'Quản Lý Danh Mục', labelEn: 'Category Management', icon: Layers, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'banners', labelVi: 'Quản Lý Banner', labelEn: 'Banner Management', icon: Image, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'news', labelVi: 'Quản Lý Tin Tức', labelEn: 'News & Blog Management', icon: Newspaper, roleNeeded: ['SuperAdmin', 'Admin', 'Editor'] },
    { id: 'users', labelVi: 'Quản Lý Người Dùng', labelEn: 'User Management', icon: Users, roleNeeded: ['SuperAdmin', 'Admin'] },
    { id: 'settings', labelVi: 'Cài Đặt Hệ Thống & Shop', labelEn: 'System & Shop Settings', icon: Settings, roleNeeded: ['SuperAdmin', 'Admin'] }
  ];

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-xs">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              {lang === 'vi' ? 'TRUY CẬP BỊ TỪ CHỐI (403)' : 'ACCESS DENIED (403)'}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'vi' 
                ? <>Tài khoản hiện tại của bạn <strong className="text-orange-400">({user ? user.role : 'Chưa đăng nhập'})</strong> không có thẩm quyền truy cập Bảng Quản Trị Admin.</>
                : <>Your current account <strong className="text-orange-400">({user ? user.role : 'Not logged in'})</strong> does not have permission to access the Admin Panel.</>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 text-left space-y-1">
            <span className="font-extrabold text-orange-400 block">{lang === 'vi' ? '💡 Yêu cầu phân quyền tối thiểu:' : '💡 Minimum required role:'}</span>
            <p>{lang === 'vi' ? 'Trang này dành riêng cho các tài khoản có vai trò SuperAdmin, Admin hoặc Editor.' : 'This page is reserved for accounts with SuperAdmin, Admin, or Editor roles.'}</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onExitAdmin}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Quay Lại Trang Mua Hàng' : 'Back to Shopping'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex text-slate-800 dark:text-slate-100">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <TechGearLogo variant="full" size="sm" showSubtitle={false} />
        </div>

        {/* Current User Badge */}
        {user && (
          <div className="px-6 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center space-x-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="truncate">
              <span className="font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">{user.role}</span>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-4 space-y-1 flex-1 text-xs font-semibold">
          {menuItems.map(item => {
            if (user && !item.roleNeeded.includes(user.role)) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Back to Client Storefront */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Xem Trang Khách Hàng' : 'View Storefront'}</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        
        {/* Mobile Horizontal Menu Bar */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 text-xs font-semibold scrollbar-none">
          {menuItems.map(item => {
            if (user && !item.roleNeeded.includes(user.role)) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  isActive ? 'bg-blue-600 text-white font-bold' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {lang === 'vi' ? item.labelVi : item.labelEn}
              </button>
            );
          })}
        </div>

        {children}
      </main>

    </div>
  );
};
