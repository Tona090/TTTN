import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Banner } from '../../types';
import { fetchBanners, createBanner, updateBanner, deleteBanner } from '../../services/api';

export const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await fetchBanners();
      setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImage('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80');
    setLink('/products');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImage(b.image);
    setLink(b.link);
    setStatus(b.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, { title, subtitle, image, link, status });
      } else {
        await createBanner({ title, subtitle, image, link, status });
      }
      setIsModalOpen(false);
      loadBanners();
    } catch (err: any) {
      alert(err.message || 'Lỗi banner');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xóa banner này?')) {
      try {
        await deleteBanner(id);
        loadBanners();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa banner');
      }
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản Lý Banner Carousel (CRUD)</h1>
          <p className="text-slate-500">Quản lý danh sách hình ảnh slider quảng cáo trang chủ.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Banner Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-400">Đang tải banner...</div>
        ) : banners.map(b => (
          <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                b.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
              }`}>
                {b.status}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.title}</h3>
              <p className="text-slate-500 line-clamp-2 text-[11px]">{b.subtitle}</p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-mono text-[10px]">Link: {b.link}</span>
                <div className="flex space-x-1">
                  <button onClick={() => handleOpenEdit(b)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editingBanner ? 'Sửa Banner' : 'Thêm Banner'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Tiêu đề Banner *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Phụ đề (Subtitle)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Link ảnh (URL) *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Đường dẫn khi click (Link)</label>
                <input
                  type="text"
                  value={link}
                  onChange={e => setLink(e.target.value)}
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
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Lưu Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
