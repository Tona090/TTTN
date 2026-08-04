import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  History, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Edit3, 
  Sliders, 
  RefreshCw,
  Box,
  DollarSign,
  Tag,
  X
} from 'lucide-react';
import { Product, StockLogItem } from '../../types';
import { fetchProducts, fetchStockLogs, adjustProductStock, updateProductSkuVariants } from '../../services/api';

export const InventoryManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'low' | 'out' | 'logs'>('all');

  // Modals
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out' | 'adjust'>('in');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustNote, setAdjustNote] = useState<string>('');
  const [adjustSku, setAdjustSku] = useState<string>('');
  const [submittingAdjust, setSubmittingAdjust] = useState<boolean>(false);

  // Variant Modal
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const [variantSku, setVariantSku] = useState<string>('');
  const [variantCostPrice, setVariantCostPrice] = useState<number>(0);
  const [variantsList, setVariantsList] = useState<{ name: string; options: string[] }[]>([]);
  const [newVarName, setNewVarName] = useState<string>('');
  const [newVarOptions, setNewVarOptions] = useState<string>('');
  const [submittingVariants, setSubmittingVariants] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, logsRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchStockLogs()
      ]);
      setProducts(prodRes.products);
      setStockLogs(logsRes);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối dữ liệu kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Stats calculation
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filterTab === 'low') return p.quantity > 0 && p.quantity <= 5;
    if (filterTab === 'out') return p.quantity === 0;
    return true;
  });

  // Handle Stock Adjustment Submit
  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAdjust) return;

    setSubmittingAdjust(true);
    try {
      const res = await adjustProductStock({
        productId: selectedProductForAdjust.id,
        type: adjustType,
        quantityChange: adjustQuantity,
        note: adjustNote,
        sku: adjustSku
      });

      // Update local state
      setProducts(prev => prev.map(p => p.id === res.product.id ? res.product : p));
      setStockLogs(res.logs);
      setSelectedProductForAdjust(null);
      showToast(`Đã cập nhật kho cho "${res.product.name}" thành công!`);
    } catch (err: any) {
      alert(err.message || 'Không thể điều chỉnh tồn kho');
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Open Variant Modal
  const handleOpenVariantModal = (p: Product) => {
    setSelectedProductForVariant(p);
    setVariantSku(p.sku || `SKU-${p.id}`);
    setVariantCostPrice(p.cost_price || Math.round(p.price * 0.65));
    setVariantsList(p.variants || []);
    setNewVarName('');
    setNewVarOptions('');
  };

  const handleAddVariantItem = () => {
    if (!newVarName.trim() || !newVarOptions.trim()) return;
    const opts = newVarOptions.split(',').map(o => o.trim()).filter(Boolean);
    if (opts.length === 0) return;

    setVariantsList(prev => [...prev, { name: newVarName.trim(), options: opts }]);
    setNewVarName('');
    setNewVarOptions('');
  };

  const handleRemoveVariantItem = (index: number) => {
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveVariants = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForVariant) return;

    setSubmittingVariants(true);
    try {
      const updated = await updateProductSkuVariants(selectedProductForVariant.id, {
        sku: variantSku,
        cost_price: variantCostPrice,
        variants: variantsList
      });

      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setSelectedProductForVariant(null);
      showToast(`Đã cập nhật SKU và biến thể cho "${updated.name}"`);
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật biến thể');
    } finally {
      setSubmittingVariants(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Box className="w-7 h-7 text-emerald-600" />
            Quản Lý Kho Hàng & Biến Thể SKU
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi số lượng tồn kho realtime, nhập/xuất kho, cấu hình mã SKU và biến thể sản phẩm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm Mới Data
          </button>
        </div>
      </div>

      {/* Toast Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Tồn Kho</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalQuantity.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">sp</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Giá Trị Kho Hàng</p>
            <p className="text-xl font-bold text-slate-800 mt-1">{totalValue.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-500">đ</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Sắp Hết Hàng (≤ 5)</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{lowStockCount} <span className="text-sm font-normal text-amber-600">mặt hàng</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-100 bg-red-50/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-red-800 uppercase tracking-wider">Đã Hết Hàng (0)</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount} <span className="text-sm font-normal text-red-500">mặt hàng</span></p>
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition whitespace-nowrap ${
              filterTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả Sản Phẩm ({products.length})
          </button>
          <button
            onClick={() => setFilterTab('low')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'low' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-amber-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Sắp Hết Hàng ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterTab('out')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'out' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-600 hover:text-red-600'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Hết Hàng ({outOfStockCount})
          </button>
          <button
            onClick={() => setFilterTab('logs')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              filterTab === 'logs' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Lịch Sử Nhập/Xuất ({stockLogs.length})
          </button>
        </div>

        {/* Search input */}
        {filterTab !== 'logs' && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Tên, SKU, Danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filterTab !== 'logs' ? (
        /* Inventory Table */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Mã SKU</th>
                  <th className="p-4">Danh Mục</th>
                  <th className="p-4 text-right">Giá Bán</th>
                  <th className="p-4 text-center">Tồn Kho</th>
                  <th className="p-4">Biến Thể</th>
                  <th className="p-4 text-center">Thao Tác Kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => {
                    const isOut = p.quantity === 0;
                    const isLow = p.quantity > 0 && p.quantity <= 5;
                    const variantCount = p.variants?.length || 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        {/* Product info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                              <p className="text-xs text-slate-400">ID: #{p.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="p-4">
                          <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                            {p.sku || `SKU-${p.id}`}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="p-4 text-slate-600 text-xs font-medium">
                          {p.category_name || 'Khác'}
                        </td>

                        {/* Price */}
                        <td className="p-4 text-right font-semibold text-slate-800">
                          {(p.sale_price || p.price).toLocaleString('vi-VN')} đ
                        </td>

                        {/* Quantity Badge */}
                        <td className="p-4 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                              <XCircle className="w-3.5 h-3.5" /> Hết Hàng (0)
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5" /> Sắp Hết ({p.quantity})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Còn Hàng ({p.quantity})
                            </span>
                          )}
                        </td>

                        {/* Variants Preview */}
                        <td className="p-4">
                          {variantCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                              <Layers className="w-3.5 h-3.5" /> {variantCount} biến thể
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Chưa có</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProductForAdjust(p);
                                setAdjustType('in');
                                setAdjustQuantity(10);
                                setAdjustNote('Nhập hàng bổ sung kho');
                                setAdjustSku(p.sku || `SKU-${p.id}`);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition"
                              title="Nhập / Điều chỉnh kho"
                            >
                              <Plus className="w-3.5 h-3.5" /> Kho
                            </button>

                            <button
                              onClick={() => handleOpenVariantModal(p)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg transition"
                              title="Cấu hình SKU & Biến thể"
                            >
                              <Sliders className="w-3.5 h-3.5" /> SKU & Biến thể
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Stock History Log Tab */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Lịch Sử Nhật Ký Biến Động Kho Hàng
            </h2>
            <span className="text-xs text-slate-500 font-medium">Tổng số: {stockLogs.length} giao dịch</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Thời Gian</th>
                  <th className="p-3">Sản Phẩm & SKU</th>
                  <th className="p-3 text-center">Loại Thao Tác</th>
                  <th className="p-3 text-center">Số Lượng</th>
                  <th className="p-3 text-center">Tồn Sau Thao Tác</th>
                  <th className="p-3">Ghi Chú</th>
                  <th className="p-3">Người Thực Hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {stockLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Chưa có lịch sử biến động kho hàng nào.
                    </td>
                  </tr>
                ) : (
                  stockLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {log.created_at}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800 line-clamp-1">{log.product_name}</p>
                        <span className="font-mono text-[11px] text-slate-500">{log.sku}</span>
                      </td>
                      <td className="p-3 text-center">
                        {log.type === 'in' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" /> Nhập Kho
                          </span>
                        ) : log.type === 'out' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                            <TrendingDown className="w-3 h-3" /> Xuất Kho
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                            <ArrowUpDown className="w-3 h-3" /> Kiểm Điều Chỉnh
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span className={log.quantity_change > 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-semibold text-slate-800">
                        {log.new_quantity}
                      </td>
                      <td className="p-3 text-xs text-slate-600 max-w-xs truncate">
                        {log.note || 'Không có ghi chú'}
                      </td>
                      <td className="p-3 text-xs text-slate-500 font-medium">
                        {log.created_by}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Box className="w-5 h-5 text-emerald-600" />
                Cập Nhật Kho Hàng
              </h3>
              <button
                onClick={() => setSelectedProductForAdjust(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sản Phẩm</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedProductForAdjust.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Tồn kho hiện tại: <span className="font-bold text-slate-800">{selectedProductForAdjust.quantity}</span> chiếc
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Loại Thao Tác Kho</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('in')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1 ${
                      adjustType === 'in'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Nhập Kho (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('out')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1 ${
                      adjustType === 'out'
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> Xuất Kho (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjust')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1 ${
                      adjustType === 'adjust'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" /> Đặt Lại (=)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  {adjustType === 'adjust' ? 'Số Lượng Tồn Chuẩn Mới' : 'Số Lượng Thay Đổi'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mã SKU San Phẩm</label>
                <input
                  type="text"
                  value={adjustSku}
                  onChange={(e) => setAdjustSku(e.target.value)}
                  placeholder="Ví dụ: KB-NUPHY-A75V2"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Ghi Chú Nhập/Xuất Kho</label>
                <textarea
                  rows={2}
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Ví dụ: Nhập hàng đợt 2 từ nhà phân phối chính hãng..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductForAdjust(null)}
                  className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="px-5 py-2 text-sm text-white font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  {submittingAdjust ? 'Đang lưu...' : 'Xác Nhận Lưu Kho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKU & Variant Config Modal */}
      {selectedProductForVariant && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                Cấu Hình SKU & Biến Thể
              </h3>
              <button
                onClick={() => setSelectedProductForVariant(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVariants} className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sản Phẩm</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedProductForVariant.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mã SKU Quản Lý</label>
                  <input
                    type="text"
                    required
                    value={variantSku}
                    onChange={(e) => setVariantSku(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Giá Vốn Nhập Kho (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={variantCostPrice}
                    onChange={(e) => setVariantCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Existing Variants List */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Danh Sách Biến Thể Đã Cấu Hình</label>
                {variantsList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Sản phẩm này chưa được gán biến thể nào (Ví dụ: Switch, Màu sắc).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {variantsList.map((v, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{v.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {v.options.map((opt, oIdx) => (
                              <span key={oIdx} className="text-[11px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantItem(idx)}
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Variant Row */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Thêm Thuộc Tính Biến Thể Mới
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Tên thuộc tính (VD: Switch)"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Các tùy chọn, cách nhau bởi phẩy (VD: Red, Blue, Brown)"
                    value={newVarOptions}
                    onChange={(e) => setNewVarOptions(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddVariantItem}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  + Thêm Biến Thể Vào Danh Sách
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProductForVariant(null)}
                  className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingVariants}
                  className="px-5 py-2 text-sm text-white font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                >
                  {submittingVariants ? 'Đang lưu...' : 'Lưu SKU & Biến Thể'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
