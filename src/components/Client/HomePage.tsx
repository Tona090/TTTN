import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Tag,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Cpu,
  Laptop,
  Headphones as HeadphoneIcon,
  Monitor,
  MousePointer,
  Keyboard,
  Award,
  MessageSquare,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, Category, Banner, NewsArticle, SiteSettings } from '../../types';
import { getStoreMetadata, getBrandSettings } from '../../services/storeMetadata';

interface Props {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  news: NewsArticle[];
  settings: SiteSettings;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onNavigateTab: (tab: string, catId?: number) => void;
  onSelectNews: (article: NewsArticle) => void;
}

export const HomePage: React.FC<Props> = ({
  products,
  categories,
  banners,
  news,
  settings,
  onSelectProduct,
  onAddToCart,
  onNavigateTab,
  onSelectNews
}) => {
  const storeMeta = getStoreMetadata(settings);
  const brand = getBrandSettings(settings);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Shell Shocker deal countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  const activeBanners = banners.filter(b => b.status === 'active');

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  // Real-time countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const newProducts = products.filter(p => p.is_new).slice(0, 4);
  const bestProducts = products.filter(p => p.is_best).slice(0, 4);
  const saleProducts = products.filter(p => p.is_sale).slice(0, 4);

  // Category Icon Mapper
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('bàn phím') || lower.includes('keyboard')) return <Keyboard className="w-5 h-5 text-orange-500" />;
    if (lower.includes('chuột') || lower.includes('mouse')) return <MousePointer className="w-5 h-5 text-blue-500" />;
    if (lower.includes('tai nghe') || lower.includes('audio')) return <HeadphoneIcon className="w-5 h-5 text-purple-500" />;
    if (lower.includes('màn hình') || lower.includes('monitor')) return <Monitor className="w-5 h-5 text-emerald-500" />;
    if (lower.includes('laptop') || lower.includes('pc')) return <Laptop className="w-5 h-5 text-amber-500" />;
    return <Cpu className="w-5 h-5 text-orange-500" />;
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Newegg Hero Bento Grid (Carousel + Side Promos) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Banner Slider (8 Cols) */}
        <div className="lg:col-span-8 relative rounded-xl overflow-hidden shadow-lg bg-slate-900 min-h-[340px] md:min-h-[400px] flex items-center border border-slate-800">
          {activeBanners.length > 0 && (
            <>
              <div className="absolute inset-0">
                <img
                  src={activeBanners[currentBannerIndex]?.image}
                  alt={activeBanners[currentBannerIndex]?.title}
                  className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              </div>

              <div className="relative max-w-xl px-6 md:px-10 py-10 text-white space-y-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  SẢN PHẨM NỔI BẬT
                </span>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  {activeBanners[currentBannerIndex]?.title || settings.heroTitle}
                </h1>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {activeBanners[currentBannerIndex]?.subtitle || settings.heroSubtitle}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onNavigateTab('products')}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Xem Sản Phẩm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Slider Controls */}
              {activeBanners.length > 1 && (
                <div className="absolute right-4 bottom-4 flex items-center space-x-2 z-20">
                  <button
                    onClick={() => setCurrentBannerIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
                    className="p-2 rounded bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentBannerIndex(prev => (prev + 1) % activeBanners.length)}
                    className="p-2 rounded bg-slate-950/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side Promo Bento Cards (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />
            <div>
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-1">
                🔥 PC BUILDER COMBO
              </span>
              <h3 className="text-base font-extrabold leading-snug">
                Combo Mainboard + CPU Intel Gen 14 Sale 25%
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Tối ưu hiệu năng gaming & render đồ họa cao cấp
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>Khám phá Combo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
            <div>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">
                💻 LAPTOP & GEAR HIGH-END
              </span>
              <h3 className="text-base font-extrabold leading-snug">
                Màn Hình Gaming Ultrawide OLED 240Hz
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Tặng kèm Arm Màn Hình & Cáp DisplayPort 2.1
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Xem ưu đãi màn hình</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* 2. Newegg Signature SHELL SHOCKER - Flash Deals Section */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border-2 border-orange-500/80 p-5 shadow-2xl relative overflow-hidden">
        
        {/* Shell Shocker Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 bg-orange-500 text-slate-950 font-black rounded-lg text-sm flex items-center gap-1.5 uppercase tracking-wider shadow-md">
              <Flame className="w-4 h-4 fill-slate-950" />
              <span>SHELL SHOCKER DEALS</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white block">GIỜ VÀNG GIÁ SỐC</span>
              <span className="text-[10px] text-slate-400">Số lượng có hạn - Giảm sâu tới 45%</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 text-white text-xs font-bold">
            <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-slate-400">KẾT THÚC TRONG:</span>
            <div className="flex items-center gap-1 font-mono text-orange-400 text-sm">
              <span className="px-1.5 py-0.5 bg-slate-800 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
              <span className="px-1.5 py-0.5 bg-slate-800 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
              <span className="px-1.5 py-0.5 bg-slate-800 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Shell Shocker Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {saleProducts.map(product => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
              {/* Progress Bar overlay */}
              <div className="mt-2 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full"
                  style={{ width: `${65 + (product.id * 7) % 30}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>Đã bán {65 + (product.id * 7) % 30}%</span>
                <span className="text-orange-400">Còn lại {8 + (product.id * 3) % 15} cái</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 3. Newegg Categories Hardware Quick Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                DANH MỤC LINH KIỆN & GEAR
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tìm kiếm linh kiện chuẩn xác theo danh mục</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.filter(c => c.status === 'active').map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigateTab('products', cat.id)}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-all text-left group flex items-center space-x-3 shadow-sm hover:shadow-md"
            >
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.name)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors truncate">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {products.filter(p => p.category_id === cat.id).length} sản phẩm
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Section: Sản Phẩm Mới Về */}
      {settings.showNewProducts && newProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  SẢN PHẨM MỚI VỀ
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Các siêu phẩm công nghệ vừa ra mắt thị trường</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Section: Sản Phẩm Bán Chạy */}
      {settings.showBestProducts && bestProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  TOP SẢN PHẨM BÁN CHẠY
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Lựa chọn hàng đầu của các streamer & gamer chuyên nghiệp</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Section: Tin Tức Công Nghệ Blog */}
      {settings.showNewsSection && news.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  TIN TỨC & BÀI ĐÁNH GIÁ GEAR
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kinh nghiệm build PC, setup bàn làm việc & bài viết công nghệ</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('news')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <span>Tất cả bài viết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.slice(0, 3).map(article => (
              <div
                key={article.id}
                onClick={() => onSelectNews(article)}
                className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-orange-500/50 transition-all flex flex-col"
              >
                <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold">{article.created_at}</span>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors line-clamp-2 mt-1">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {article.excerpt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNews(article);
                    }}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 pt-2 hover:underline w-fit cursor-pointer"
                  >
                    <span>Đọc chi tiết</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Store Founder & Personal Touch Section (LỜI NHẮN TỪ CHỦ SHOP) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Founder Avatar / Badge */}
          <div className="shrink-0 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={storeMeta.founder.avatar}
                alt={storeMeta.founder.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-orange-500/80 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 text-slate-950 rounded-full shadow-lg" title="Đã xác thực Store Founder">
                <CheckCircle2 className="w-4 h-4 font-bold" />
              </div>
            </div>
            <h4 className="font-extrabold text-sm mt-3 text-slate-100">{storeMeta.founder.name}</h4>
            <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full mt-1 border border-orange-500/20">
              {storeMeta.founder.role}
            </span>
          </div>

          {/* Personal Message */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black uppercase text-orange-500 tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>LỜI NHẮN TỪ CHỦ CỬA HÀNG (FOUNDER'S COMMITMENT)</span>
            </div>
            <h3 className="text-lg md:text-xl font-black leading-snug text-slate-100">
              "{storeMeta.slogan}"
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {storeMeta.founder.message}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-bold text-slate-200">
              {storeMeta.founder.commitmentPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 Hardware Philosophy & Selection Rules */}
      {(brand.brand_philosophy || brand.hardware_selection_rule) && (
        <section className="bg-slate-900/90 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-400 tracking-wider">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>TRIẾT LÝ CHỌN LỰA HARDWARE (HARDWARE SELECTION PHILOSOPHY)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {brand.brand_philosophy && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  Triết Lý Lựa Chọn
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {brand.brand_philosophy}
                </p>
              </div>
            )}

            {brand.hardware_selection_rule && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Quy Chuẩn Kiểm Định
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {brand.hardware_selection_rule}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. Store Unique Selling Points (USPs) */}
      <section className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {storeMeta.usps.map((usp, idx) => {
          const iconsMap: Record<string, React.FC<{ className?: string }>> = {
            Award: Award,
            Truck: Truck,
            ShieldCheck: ShieldCheck,
            Wrench: Headphones,
            Headphones: Headphones,
            RotateCcw: RotateCcw
          };
          const IconComp = iconsMap[usp.icon] || ShieldCheck;
          const colors = ['text-orange-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400'];
          return (
            <div key={usp.id || idx} className="flex flex-col items-center">
              <IconComp className={`w-8 h-8 mb-2 ${colors[idx % colors.length]}`} />
              <h4 className="font-extrabold text-xs text-slate-100">{usp.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{usp.desc}</p>
            </div>
          );
        })}
      </section>

    </div>
  );
};

