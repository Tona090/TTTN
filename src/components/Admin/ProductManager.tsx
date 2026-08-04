import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Flame, Tag, Check, X, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Product, Category } from '../../types';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories, generateAIDescription } from '../../services/api';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category_id, setCategoryId] = useState<number>(1);
  const [image, setImage] = useState('');
  const [price, setPrice] = useState<number>(1000000);
  const [salePrice, setSalePrice] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [isBest, setIsBest] = useState(false);
  const [subImages, setSubImages] = useState<string[]>([]);
  const [newSubImageUrl, setNewSubImageUrl] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên sản phẩm trước khi tạo mô tả AI.');
      return;
    }
    setGeneratingAI(true);
    try {
      const selectedCat = categories.find(c => c.id === category_id)?.name;
      const res = await generateAIDescription({
        productName: name,
        categoryName: selectedCat,
        price,
        keywords: 'Chính hãng TechGear, bảo hành 24 tháng, thiết kế cao cấp'
      });
      if (res.description) {
        setDescription(res.description);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo mô tả AI');
    } finally {
      setGeneratingAI(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetchProducts({ limit: 100 }), fetchCategories()]);
      setProducts(pRes.products);
      setCategories(cRes);
      if (cRes.length > 0) setCategoryId(cRes[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setImage('https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80');
    setSubImages([]);
    setNewSubImageUrl('');
    setPrice(2000000);
    setSalePrice('');
    setQuantity(20);
    setDescription('');
    setIsNew(true);
    setIsSale(false);
    setIsBest(false);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.category_id);
    setImage(p.image);
    setSubImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setNewSubImageUrl('');
    setPrice(p.price);
    setSalePrice(p.sale_price ? String(p.sale_price) : '');
    setQuantity(p.quantity);
    setDescription(p.description);
    setIsNew(p.is_new);
    setIsSale(p.is_sale);
    setIsBest(p.is_best);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleAddSubImage = () => {
    if (!newSubImageUrl.trim()) return;
    setSubImages(prev => [...prev, newSubImageUrl.trim()]);
    setNewSubImageUrl('');
  };

  const handleRemoveSubImage = (index: number) => {
    setSubImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const payload = {
      name,
      category_id: Number(category_id),
      image,
      images: subImages,
      price: Number(price),
      sale_price: salePrice ? Number(salePrice) : null,
      quantity: Number(quantity),
      description,
      is_new: isNew,
      is_sale: isSale,
      is_best: isBest
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Lỗi lưu sản phẩm');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const formatVND = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản Lý Sản Phẩm (CRUD)</h1>
          <p className="text-slate-500">Thêm, sửa, xóa sản phẩm và gắn nhãn Sản phẩm Mới, Bán Chạy, Giảm Giá.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc danh mục..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Giá bán</th>
                <th className="p-3">Tồn kho</th>
                <th className="p-3">Nhãn đánh dấu</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-400">Đang tải sản phẩm...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-400">Không có sản phẩm nào.</td></tr>
              ) : (
                paginatedProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl bg-slate-100" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block max-w-xs truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{p.category_name}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-blue-600 dark:text-blue-400">{formatVND(p.sale_price ?? p.price)}</div>
                      {p.sale_price && <div className="text-[10px] text-slate-400 line-through">{formatVND(p.price)}</div>}
                    </td>
                    <td className="p-3 font-bold">{p.quantity} cái</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {p.is_new && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">Mới</span>}
                        {p.is_sale && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">Sale</span>}
                        {p.is_best && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">Bán Chạy</span>}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md font-extrabold border border-blue-500/20">
              Trang {currentPage} / {totalPages}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Hiển thị <strong>{paginatedProducts.length}</strong> trên <strong>{filteredProducts.length}</strong> sản phẩm
            </span>
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              <span>Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
              >
                <option value={5}>5 / trang</option>
                <option value={8}>8 / trang</option>
                <option value={12}>12 / trang</option>
                <option value={20}>20 / trang</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[28px] h-7 px-1.5 rounded-lg font-extrabold text-xs transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              {actionError && <div className="p-2 text-red-600 bg-red-50 rounded-lg">{actionError}</div>}

              <div>
                <label className="block font-bold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Danh mục *</label>
                  <select
                    value={category_id}
                    onChange={e => setCategoryId(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Giá gốc (VND) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Giá khuyến mãi (Để trống nếu không sale)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={e => setSalePrice(e.target.value)}
                    placeholder="VD: 2500000"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Link hình ảnh chính (URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                  />
                  {image && (
                    <img src={image} alt="" className="w-9 h-9 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shrink-0" />
                  )}
                </div>
              </div>

              {/* Sub Images / Gallery Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-xs">
                    Bộ sưu tập ảnh phụ ({subImages.length} ảnh)
                  </label>
                  <span className="text-[10px] text-slate-500">Hiển thị ở trang Chi tiết sản phẩm</span>
                </div>

                {/* Sub Images Thumbnails */}
                {subImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {subImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSubImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow"
                          title="Xóa ảnh phụ này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] italic text-slate-400">Chưa có ảnh phụ. Thêm link bên dưới để tạo album ảnh chi tiết.</p>
                )}

                {/* Add Sub Image Input Box */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={newSubImageUrl}
                    onChange={e => setNewSubImageUrl(e.target.value)}
                    placeholder="Dán URL ảnh phụ mới vào đây..."
                    className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubImage}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Ảnh</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold">Mô tả sản phẩm</label>
                  <button
                    type="button"
                    disabled={generatingAI}
                    onClick={handleGenerateAI}
                    className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                    <span>{generatingAI ? 'AI Đang Viết...' : 'Viết Mô Tả AI Marketing'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Nhập mô tả sản phẩm hoặc nhấn 'Viết Mô Tả AI Marketing' để tạo tự động..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-xs leading-relaxed"
                />
              </div>

              {/* Toggles for Flags */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
                <span className="font-bold block mb-1">Đánh dấu hiển thị trang chủ:</span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} />
                    <span className="font-semibold text-emerald-600">Sản phẩm mới (is_new)</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={isSale} onChange={e => setIsSale(e.target.checked)} />
                    <span className="font-semibold text-red-600">Sản phẩm sale (is_sale)</span>
                  </label>

                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input type="checkbox" checked={isBest} onChange={e => setIsBest(e.target.checked)} />
                    <span className="font-semibold text-amber-600">Bán chạy (is_best)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Lưu Sản Phẩm
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
