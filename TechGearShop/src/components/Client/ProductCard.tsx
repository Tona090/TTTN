import React from 'react';
import { ShoppingBag, Eye, Star, Flame, Sparkles, Tag, Truck, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  product: Product;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onSelectProduct, onAddToCart }) => {
  const { lang, t } = useLanguage();

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  // Rating score and review count from product model or fallback
  const ratingScore = product.rating ?? ((product.id * 7) % 5 === 0 ? 4.8 : 4.9);
  const ratingCount = product.review_count ?? (24 + (product.id * 13) % 150);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-500/50 transition-all duration-300 flex flex-col h-full select-none">
      
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.is_sale && discountPercent > 0 && (
          <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded shadow-xs flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {lang === 'vi' ? `Giảm ${discountPercent}%` : `-${discountPercent}%`}
          </span>
        )}
        {product.is_new && (
          <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 rounded shadow-xs">
            {lang === 'vi' ? 'Hàng mới' : 'NEW'}
          </span>
        )}
        {product.is_best && (
          <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-orange-600 rounded shadow-xs">
            {lang === 'vi' ? 'Bán chạy' : 'BESTSELLER'}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div
        className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-pointer p-4 flex items-center justify-center group-hover:bg-slate-100/60 dark:group-hover:bg-slate-900/60 transition-colors"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View Button */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xl hover:bg-orange-500 hover:text-slate-950 transition-all flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Xem chi tiết' : 'View details'}</span>
          </button>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div>
          
          {/* Brand/Category & Ratings */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate max-w-[120px]">
              {product.category_name || 'TECHGEAR'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-500 dark:text-slate-400">({ratingCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-orange-500 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          {/* Subtitle / Specs Tag */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
            {product.description}
          </p>

          {/* Free Shipping Tag & Stock */}
          <div className="mt-2.5 flex items-center gap-2 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {lang === 'vi' ? 'FREESHIP 0đ' : 'FREE SHIPPING'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              {lang === 'vi' ? `Còn hàng (${product.stock})` : `In stock (${product.stock})`}
            </span>
          </div>

        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-base font-black text-orange-600 dark:text-orange-400 font-mono">
              {formatVND(product.sale_price ?? product.price)}
            </div>
            {product.sale_price && (
              <div className="text-[11px] text-slate-400 line-through font-mono">
                {formatVND(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md transition-colors flex items-center gap-1 shadow-2xs"
            title={lang === 'vi' ? 'Thêm vào giỏ hàng' : 'Add to cart'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Thêm giỏ' : 'Add cart'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

