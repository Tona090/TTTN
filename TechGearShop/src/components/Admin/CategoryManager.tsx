import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, X } from 'lucide-react';
import { Category } from '../../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description);
    setStatus(c.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name, description, status });
      } else {
        await createCategory({ name, description, status });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Lỗi thao tác danh mục');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa danh mục');
      }
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản Lý Danh Mục (CRUD)</h1>
          <p className="text-slate-500">Thêm, sửa, xóa các nhóm danh mục sản phẩm của website.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tên Danh Mục</th>
              <th className="p-3">Mô tả</th>
              <th className="p-3">Số sản phẩm</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Đang tải danh mục...</td></tr>
            ) : categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-mono font-bold">#{c.id}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{c.name}</td>
                <td className="p-3 text-slate-500 max-w-xs truncate">{c.description}</td>
                <td className="p-3 font-bold">{c.productCount || 0} SP</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleOpenEdit(c)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editingCategory ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Mô tả ngắn</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Trạng thái</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="active">Hoạt động (Active)</option>
                  <option value="inactive">Ẩn (Inactive)</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
