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
  Pin
} from 'lucide-react';
import { User, SiteSettings, Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getStoreMetadata } from '../services/storeMetadata';

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
      
      {/* 1. Top Utility Ribbon (Newegg Style Top Bar) */}
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[11px] py-1 px-4 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <Phone className="w-3 h-3 text-orange-500" />
              <span>{t('nav.hotline', 'Hotline')}: <strong className="text-slate-900 dark:text-white">{storeMeta.contact.hotline}</strong></span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-md">
              <Truck className="w-3 h-3 shrink-0" />
              <span className="truncate">{storeMeta.slogan}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLang}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1.5 transition-all text-[10px] shadow-sm"
              title="Đổi ngôn ngữ / Switch Language"
            >
              <Globe className="w-3 h-3 text-orange-500" />
              <span>{lang === 'vi' ? '🇻🇳 VI | EN' : '🇺🇸 EN | VI'}</span>
            </button>

            {/* Pinned Project Roadmap Button */}
            {onOpenRoadmapModal && (
              <button
                onClick={onOpenRoadmapModal}
                className="px-2 py-0.5 rounded bg-orange-500/10 dark:bg-orange-500/20 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 font-black flex items-center gap-1 transition-all text-[10px] shadow-sm animate-pulse"
                title="Ghim Lộ Trình Phát Triển eCommerce"
              >
                <Pin className="w-3 h-3 text-orange-500 rotate-12" />
                <span>📌 Ghim Lộ Trình</span>
              </button>
            )}

            <button
              onClick={onOpenPdfModal}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{t('nav.pdf_report', 'Báo Cáo Đồ Án PDF')}</span>
            </button>

            {user && (
              <button
                onClick={() => {
                  setActiveView('client');
                  setCurrentTab('orders');
                }}
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <PackageCheck className="w-3 h-3 text-blue-500" />
                <span>{t('nav.track_order', 'Tra Cứu Đơn Hàng')}</span>
              </button>
            )}

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors font-medium"
              title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {darkMode ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-600" />}
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
              className="flex items-center space-x-2 text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-amber-300">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                    {settings.logoText || 'TECHGEAR'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    STORE
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                  Tech Hardware & Gear Hub
                </span>
              </div>
            </button>
          </div>

          {/* Newegg-style Mega Search Bar */}
          {activeView === 'client' && (
            <div className="hidden md:flex flex-1 max-w-2xl items-center relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all">
              
              {/* Category Dropdown Selector */}
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 py-2.5 border-r border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                <select
                  value={selectedCategorySearch}
                  onChange={(e) => {
                    setSelectedCategorySearch(e.target.value);
                    if (onSelectCategory) {
                      onSelectCategory(e.target.value === 'all' ? undefined : Number(e.target.value));
                    }
                    if (currentTab !== 'products') setCurrentTab('products');
                  }}
                  className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-semibold text-xs"
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
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
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
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-200"
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

      {/* 3. Secondary Nav Ribbon (Newegg Category Bar) */}
      {activeView === 'client' && (
        <div className="bg-slate-100/90 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/60 hidden md:block text-xs font-bold">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            
            <div className="flex items-center space-x-1">
              {/* Category Picker Quick Dropdown */}
              <button
                onClick={() => setCurrentTab('products')}
                className="px-4 py-2.5 bg-orange-500 text-slate-950 font-black flex items-center gap-2 hover:bg-orange-600 transition-colors uppercase tracking-wider"
              >
                <Layers className="w-4 h-4" />
                <span>{t('nav.all_categories', 'TẤT CẢ DANH MỤC')}</span>
              </button>

              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                  currentTab === 'home' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {t('nav.home', 'TRANG CHỦ')}
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className={`px-3 py-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ${
                  currentTab === 'products' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {lang === 'vi' ? 'SẢN PHẨM & GEAR' : 'PRODUCTS & GEAR'}
              </button>

              <button
                onClick={() => setCurrentTab('products')}
                className="px-3 py-2.5 text-orange-400 hover:text-orange-300 flex items-center gap-1 animate-pulse"
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>SHELL SHOCKER DEALS</span>
              </button>

              <button
                onClick={() => setCurrentTab('pcbuilder')}
                className={`px-3 py-2.5 hover:text-blue-300 flex items-center gap-1 transition-colors ${
                  currentTab === 'pcbuilder' ? 'text-blue-400 border-b-2 border-blue-400 font-extrabold' : 'text-blue-400'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>{t('nav.pcbuilder', 'XÂY DỰNG PC')}</span>
              </button>

              <button
                onClick={() => setCurrentTab('news')}
                className={`px-3 py-2.5 hover:text-orange-400 transition-colors ${
                  currentTab === 'news' ? 'text-orange-400 border-b-2 border-orange-500' : 'text-slate-200'
                }`}
              >
                {t('nav.news', 'TIN TỨC BLOG')}
              </button>

            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'vi' ? 'Chính Hãng 100% | Cam Kết Đổi Trả 30 Ngày' : '100% Authentic | 30-Day Easy Returns'}</span>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && activeView === 'client' && (
        <div className="md:hidden py-4 px-4 bg-slate-900 border-t border-slate-800 space-y-3">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-400">{t('common.language', 'Ngôn ngữ')}:</span>
            <button
              onClick={toggleLang}
              className="px-3 py-1 rounded bg-slate-800 text-orange-400 font-bold flex items-center gap-1 text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}</span>
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'products') setCurrentTab('products');
            }}
            placeholder={t('nav.search_placeholder', 'Tìm kiếm bàn phím, laptop, VGA...')}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white mb-2"
          />
          <div className="flex flex-col space-y-1 text-xs font-bold">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              {t('nav.home', 'Trang Chủ')}
            </button>
            <button
              onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              {lang === 'vi' ? 'Danh Mục Sản Phẩm & Gear' : 'Product Categories & Gear'}
            </button>
            <button
              onClick={() => { setCurrentTab('pcbuilder'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-blue-400 flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>{t('nav.pcbuilder', 'Xây Dựng Cấu Hình PC')}</span>
            </button>
            <button
              onClick={() => { setCurrentTab('products'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-orange-400 flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Shell Shocker deals</span>
            </button>
            <button
              onClick={() => { setCurrentTab('news'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              {t('nav.news', 'Tin Tức & Đánh Giá')}
            </button>
            {!user && (
              <button
                onClick={() => { setActiveView('auth'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-orange-400 font-bold flex items-center gap-1.5"
              >
                <UserIcon className="w-4 h-4 text-orange-400" />
                <span>{t('nav.login', 'Đăng Nhập')}</span>
              </button>
            )}
            {user && (
              <button
                onClick={() => { setCurrentTab('orders'); setMobileMenuOpen(false); }}
                className="text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-blue-400"
              >
                {t('nav.track_order', 'Đơn Hàng Của Tôi')}
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
};


