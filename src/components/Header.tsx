import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Moon,
  Sun,
  LayoutDashboard,
  Store,
  FileText,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Flame,
  Zap,
  Phone,
  Truck,
  Cpu,
  Layers,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  Globe,
  Pin,
  Tag
} from 'lucide-react';
import { User, SiteSettings, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getStoreMetadata } from '../services/storeMetadata';
import { TechGearLogo } from './TechGearLogo';

interface Props {
  user: User | null;
  cartCount: number;
  settings: SiteSettings;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeView: 'client' | 'admin';
  setActiveView: (view: 'client' | 'admin') => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onOpenPdfModal: () => void;
  onOpenRoadmapModal?: () => void;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categories?: Category[];
  onSelectCategory?: (catId: number | undefined) => void;
}

export const Header: React.FC<Props> = ({
  user,
  cartCount,
  settings,
  darkMode,
  setDarkMode,
  activeView,
  setActiveView,
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenCart,
  onOpenPdfModal,
  onOpenRoadmapModal,
  onLogout,
  searchQuery,
  setSearchQuery,
  categories = [],
  onSelectCategory
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategorySearch, setSelectedCategorySearch] = useState<string>('all');

  const canAccessAdmin = user && ['SuperAdmin', 'Admin', 'Editor'].includes(user.role);
  const storeMeta = getStoreMetadata(settings);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 shadow-md select-none transition-colors">
      
      {/* 1. Top Utility Ribbon */}
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[11px] py-1.5 px-4 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('nav.hotline', 'Hotline')}: <strong className="text-slate-900 dark:text-white font-bold">{storeMeta.contact.hotline}</strong></span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-md">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{storeMeta.slogan}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => {
                setActiveView('client');
                setCurrentTab('order-tracking');
              }}
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors font-medium text-orange-600 dark:text-orange-400 font-bold"
              title="Theo dõi & Tra cứu đơn hàng theo thời gian thực"
            >
              <PackageCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('nav.track_order', 'Theo Dõi Đơn Hàng')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1 transition-all text-[10px] shadow-2xs"
              title="Đổi ngôn ngữ / Switch Language"
            >
              <Globe className="w-3 h-3 text-orange-500" />
              <span>{lang === 'vi' ? 'VI | EN' : 'EN | VI'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors font-medium"
              title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden sm:inline">{darkMode ? t('nav.dark_mode', 'Giao diện Tối') : t('nav.light_mode', 'Giao diện Sáng')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar (Logo, Mega Search, Actions) */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setActiveView('client');
                setCurrentTab('home');
              }}
              className="flex items-center text-left group hover:opacity-95 transition-opacity"
            >
              <TechGearLogo variant="full" size="md" showSubtitle={true} />
            </button>
          </div>

          {/* Search Bar */}
          {activeView === 'client' && (
            <div className="hidden md:flex flex-1 max-w-2xl items-center relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all shadow-2xs">
              
              {/* Category Dropdown Selector */}
              <div className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs px-3 py-2.5 border-r border-slate-200 dark:border-slate-800 font-medium flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                <select
                  value={selectedCategorySearch}
                  onChange={(e) => {
                    setSelectedCategorySearch(e.target.value);
                    if (onSelectCategory) {
                      onSelectCategory(e.target.value === 'all' ? undefined : Number(e.target.value));
                    }
                    if (currentTab !== 'products') setCurrentTab('products');
                  }}
                  className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium text-xs"
                >
                  <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{lang === 'vi' ? 'Tất cả danh mục' : 'All Categories'}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Input field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'products') setCurrentTab('products');
                }}
                placeholder={t('nav.search_placeholder', 'Tìm kiếm laptop, card màn hình, CPU, gear gaming...')}
                className="w-full px-4 py-2 text-xs bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />

              {/* Search Button */}
              <button
                onClick={() => {
                  if (currentTab !== 'products') setCurrentTab('products');
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden lg:inline">{lang === 'vi' ? 'TÌM KIẾM' : 'SEARCH'}</span>
              </button>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">

            {/* Switch Between Client Storefront & Admin Portal */}
            {canAccessAdmin && (
              <button
                onClick={() => setActiveView(activeView === 'client' ? 'admin' : 'client')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
                  activeView === 'admin'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {activeView === 'client' ? (
                  <>
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    <span className="hidden sm:inline">{t('nav.admin', 'QUẢN TRỊ ADMIN')}</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-emerald-500" />
                    <span className="hidden sm:inline">{lang === 'vi' ? 'Trang Bán Hàng' : 'Storefront'}</span>
                  </>
                )}
              </button>
            )}

            {/* Shopping Cart Button */}
            {activeView === 'client' && (
              <button
                onClick={onOpenCart}
                className="relative px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm group"
                title={t('nav.cart', 'Giỏ hàng')}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 w-5 h-5 bg-orange-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-none">{t('nav.cart', 'Giỏ hàng')}</span>
                  <span className="font-bold text-xs text-orange-600 dark:text-orange-400">{cartCount} {t('nav.items', 'sản phẩm')}</span>
                </div>
              </button>
            )}

            {/* User Account Portal */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        {lang === 'vi' ? 'Vai trò' : 'Role'}: {user.role}
                      </span>
                    </div>

                    {canAccessAdmin && (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-500" />
                        <span>{t('nav.admin', 'Bảng Quản Trị')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout', 'Đăng Xuất')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-lg text-xs shadow-md transition-all flex items-center space-x-1.5 whitespace-nowrap flex-shrink-0"
              >
                <UserIcon className="w-4 h-4 flex-shrink-0" />
                <span>{t('nav.login', 'ĐĂNG NHẬP')}</span>
              </button>
            )}

            {/* Mobile Navigation Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* 3. Secondary Nav Ribbon (Category & Quick Links) */}
      {activeView === 'client' && (
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 hidden md:block text-xs font-semibold">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            
            <div className="flex items-center space-x-1">
              {/* Category Picker Quick Dropdown */}
              <button
                onClick={() => setCurrentTab('products')}
                className="px-4 py-2.5 bg-orange-600 text-white font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors tracking-wide rounded-t-sm"
              >
                <Layers className="w-4 h-4" />
                <span>{t('nav.all_categories', 'TẤT CẢ DANH MỤC')}</span>
              </button>

              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3.5 py-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                  currentTab === 'home' ? 'text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {t('nav.home', 'TRANG CHỦ')}
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className={`px-3.5 py-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                  currentTab === 'products' ? 'text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {lang === 'vi' ? 'SẢN PHẨM & GEAR' : 'PRODUCTS & GEAR'}
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className="px-3.5 py-2.5 text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1.5 font-bold"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>KHUYẾN MÃI HOT</span>
              </button>

              <button
                onClick={() => setCurrentTab('pcbuilder')}
                className={`px-3.5 py-2.5 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors ${
                  currentTab === 'pcbuilder' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                <span>{t('nav.pcbuilder', 'XÂY DỰNG PC')}</span>
              </button>

              <button
                onClick={() => setCurrentTab('news')}
                className={`px-3.5 py-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                  currentTab === 'news' ? 'text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {t('nav.news', 'TIN TỨC')}
              </button>

              <button
                onClick={() => setCurrentTab('orders')}
                className={`px-3.5 py-2.5 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors ${
                  currentTab === 'orders' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 font-bold' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>TRA CỨU ĐƠN</span>
              </button>

            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'vi' ? 'Cam kết chính hãng 100% • Bảo hành tận tâm' : '100% Authentic • Official Warranty'}</span>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && activeView === 'client' && (
        <div className="md:hidden py-4 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3 shadow-lg transition-colors">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('common.language', 'Ngôn ngữ')}:</span>
            <button
              onClick={toggleLang}
              className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab !== 'products') setCurrentTab('products');
              }}
              placeholder={t('nav.search_placeholder', 'Tìm kiếm bàn phím, laptop, VGA...')}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex flex-col space-y-1 text-xs font-semibold">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentTab === 'home'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {t('nav.home', 'Trang Chủ')}
            </button>
            <button
              onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentTab === 'products'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Sản Phẩm & Gear Gaming' : 'Products & Gaming Gear'}
            </button>
            <button
              onClick={() => { setCurrentTab('pcbuilder'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                currentTab === 'pcbuilder'
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>{t('nav.pcbuilder', 'Xây Dựng Cấu Hình PC')}</span>
            </button>
            <button
              onClick={() => { setCurrentTab('news'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
                currentTab === 'news'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {t('nav.news', 'Tin Tức & Bài Viết')}
            </button>
            <button
              onClick={() => { setCurrentTab('orders'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                currentTab === 'orders'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('nav.track_order', 'Tra Cứu Đơn Hàng')}</span>
            </button>
            {!user && (
              <button
                onClick={() => { setActiveView('auth'); setMobileMenuOpen(false); }}
                className="mt-2 text-center px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('nav.login', 'Đăng Nhập / Đăng Ký')}</span>
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};


