import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, SlidersHorizontal, Layers } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, Category } from '../../types';
import { fetchProducts } from '../../services/api';

interface Props {
  categories: Category[];
  initialCategoryId?: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductList: React.FC<Props> = ({
  categories,
  initialCategoryId,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onAddToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(initialCategoryId || 'all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(30000000);
  const [sortOption, setSortOption] = useState<string>('default');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [loading, setLoading] = useState<boolean>(true);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({
        category_id: selectedCategory,
        search: searchQuery,
        minPrice,
        maxPrice,
        sort: sortOption,
        page,
        limit: pageSize
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, sortOption, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== page) {
      setPage(newPage);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(30000000);
    setSortOption('default');
    setPage(1);
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div ref={topRef} className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-950 dark:text-white shadow-lg relative overflow-hidden flex flex-col justify-center border border-amber-300 dark:border-slate-800 transition-colors">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="px-3 py-1 bg-slate-950 text-white dark:bg-orange-500 dark:text-slate-950 text-[10px] font-black rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-sm">
            <Layers className="w-3.5 h-3.5 fill-white dark:fill-slate-950" />
            {selectedCategory === 'all'
              ? 'TẤT CẢ SẢN PHẨM'
              : categories.find(c => c.id === selectedCategory)?.name.toUpperCase() || 'DANH MỤC LỰA CHỌN'}
          </span>
          <h1 className="text-2xl md:text-3xl font-black">CỬA HÀNG THIẾT BỊ TECHGEAR STORE</h1>
          <p className="text-xs text-slate-900/90 dark:text-slate-300 font-medium">
            Khám phá trọn bộ bàn phím cơ, chuột không dây, tai nghe chống ồn chính hãng bảo hành 24-36 tháng.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên sản phẩm, từ khóa..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Selector */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val === 'all' ? 'all' : Number(val));
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="default">Sắp xếp mặc định</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
              <option value="name_asc">Tên: A - Z</option>
              <option value="name_desc">Tên: Z - A</option>
            </select>
          </div>

        </div>

        {/* Price Slider Filter Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Khoảng giá lọc:</span>
            <span className="font-extrabold text-orange-600 dark:text-orange-400 font-mono">
              {formatVND(minPrice)} - {formatVND(maxPrice)}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <input
              type="range"
              min="0"
              max="30000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              className="w-full sm:w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
          Đang tải danh sách sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Không tìm thấy sản phẩm phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Vui lòng thử tìm kiếm lại hoặc mở rộng khoảng giá lọc.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Advanced Clear Pagination Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Left Stats & Per-Page Limit */}
        <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md font-extrabold border border-orange-500/20">
            Trang {pagination.page} / {pagination.totalPages || 1}
          </span>
          <span>
            Hiển thị <strong className="text-slate-900 dark:text-white">{products.length}</strong> trên tổng số <strong className="text-slate-900 dark:text-white">{pagination.total}</strong> sản phẩm
          </span>

          <div className="flex items-center gap-1.5 ml-0 md:ml-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span>Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-orange-500"
            >
              <option value={4}>4 / trang</option>
              <option value={8}>8 / trang</option>
              <option value={12}>12 / trang</option>
              <option value={16}>16 / trang</option>
              <option value={24}>24 / trang</option>
            </select>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(1)}
            title="Trang đầu tiên"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Prev Page */}
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            title="Trang trước"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Numeric Page Buttons */}
          <div className="flex items-center space-x-1 px-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded-xl font-extrabold text-xs transition-all ${
                  page === pageNum
                    ? 'bg-orange-500 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Page */}
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            title="Trang sau"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.totalPages)}
            title="Trang cuối cùng"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

