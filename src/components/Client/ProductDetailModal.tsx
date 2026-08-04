import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Sparkles, Star } from 'lucide-react';
import { Product } from '../../types';
import { fetchProductById } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { ProductReviewCard } from './ProductReviewCard';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product: initialProduct,
  onClose,
  onAddToCart,
  onSelectProduct
}) => {
  const { lang, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  useEffect(() => {
    setProduct(initialProduct);
    setQuantity(1);
    if (initialProduct) {
      fetchProductById(initialProduct.id)
        .then(data => {
          setProduct(data.product);
          setRelated(data.related);
        })
        .catch(console.error);
    }
  }, [initialProduct]);

  if (!product) return null;

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {lang === 'vi' ? 'Chi Tiết Sản Phẩm' : 'Product Details'} • {product.category_name}
          </span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Product Image */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'vi' ? 'Bảo hành 24 tháng' : '24 Months Warranty'}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>{lang === 'vi' ? 'Giao hàng nhanh 2H' : 'Fast 2-Hour Express'}</span>
                </div>
              </div>
            </div>

            {/* Product Details Column */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h2>

                {/* Rating Badge */}
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-3.5 h-3.5 ${
                          st <= Math.round(product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {product.rating ?? 5.0} / 5.0
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="text-blue-500 hover:underline text-[11px] font-semibold"
                  >
                    ({product.review_count ?? 0} {lang === 'vi' ? 'đánh giá' : 'reviews'})
                  </button>
                </div>

                {/* Price Display */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-baseline gap-3">
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {formatVND(product.sale_price ?? product.price)}
                  </span>
                  {product.sale_price && (
                    <>
                      <span className="text-xs text-slate-400 line-through">
                        {formatVND(product.price)}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-md">
                        {lang === 'vi' ? `Giảm ${discountPercent}%` : `Save ${discountPercent}%`}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-4">
                  <ProductReviewCard description={product.description} productName={product.name} />
                </div>

                {/* Specs list */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      {lang === 'vi' ? 'Thông số kỹ thuật:' : 'Technical Specifications:'}
                    </span>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-[11px]">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity & Cart Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'vi' ? 'Số lượng mua:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold hover:bg-slate-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                      className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 font-bold hover:bg-slate-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{lang === 'vi' ? 'Đã Thêm Vào Giỏ Hàng!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'vi' ? 'Thêm Vào Giỏ Hàng' : 'Add to Cart'} • {formatVND((product.sale_price ?? product.price) * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Related Products Section */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                {lang === 'vi' ? 'Sản Phẩm Liên Quan' : 'Related Products'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {related.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                    }}
                    className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <img src={rel.image} alt={rel.name} className="w-full aspect-square object-cover rounded-lg mb-1.5" />
                    <h4 className="font-bold text-[11px] text-slate-900 dark:text-white line-clamp-1">{rel.name}</h4>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {formatVND(rel.sale_price ?? rel.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
