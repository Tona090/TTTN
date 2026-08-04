import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Newspaper, X } from 'lucide-react';
import { NewsArticle } from '../../types';
import { fetchNews, createNews, updateNews, deleteNews } from '../../services/api';

export const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenAdd = () => {
    setEditingNews(null);
    setTitle('');
    setImage('https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80');
    setExcerpt('');
    setContent('');
    setAuthor('Admin TechGear');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: NewsArticle) => {
    setEditingNews(n);
    setTitle(n.title);
    setImage(n.image);
    setExcerpt(n.excerpt);
    setContent(n.content);
    setAuthor(n.author || 'Admin TechGear');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateNews(editingNews.id, { title, image, excerpt, content, author });
      } else {
        await createNews({ title, image, excerpt, content, author });
      }
      setIsModalOpen(false);
      loadNews();
    } catch (err: any) {
      alert(err.message || 'Lỗi tin tức');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xóa bài viết này?')) {
      try {
        await deleteNews(id);
        loadNews();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa bài viết');
      }
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản Lý Tin Tức (CRUD)</h1>
          <p className="text-slate-500">Đăng bài viết công nghệ, hướng dẫn setup và khuyến mãi.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bài Viết Mới</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3">Bài viết</th>
              <th className="p-3">Tác giả</th>
              <th className="p-3">Ngày đăng</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">Đang tải bài viết...</td></tr>
            ) : news.map(n => (
              <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <img src={n.image} alt={n.title} className="w-12 h-10 object-cover rounded-xl bg-slate-100" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block max-w-sm truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 max-w-sm truncate block">{n.excerpt}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-semibold">{n.author || 'Admin'}</td>
                <td className="p-3 text-slate-400">{n.created_at}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleOpenEdit(n)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg">
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
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editingNews ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Tác giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Link ảnh thumbnail (URL) *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Mô tả trích dẫn (Excerpt)</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Nội dung bài viết *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Lưu Bài Viết</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
