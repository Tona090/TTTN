import React, { useState } from 'react';
import { Newspaper, Calendar, User as UserIcon, ArrowLeft, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { NewsArticle } from '../../types';

interface Props {
  news: NewsArticle[];
  selectedArticle: NewsArticle | null;
  onSelectArticle: (article: NewsArticle | null) => void;
}

export const NewsList: React.FC<Props> = ({ news, selectedArticle, onSelectArticle }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const totalArticles = news.length;
  const totalPages = Math.ceil(totalArticles / pageSize) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = news.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
            <Newspaper className="w-4 h-4" />
            Tin Tức & Blog Công Nghệ
          </span>
          <h1 className="text-2xl md:text-3xl font-black">ĐÁNH GIÁ & HƯỚNG DẪN SETUP</h1>
          <p className="text-xs text-slate-300">
            Tổng hợp tin tức công nghệ mới nhất, đánh giá chi tiết bàn phím cơ, tai nghe và kinh nghiệm tối ưu góc làm việc.
          </p>
        </div>
      </div>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => onSelectArticle(null)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:text-orange-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <button
                onClick={() => onSelectArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full aspect-video object-cover rounded-xl" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  {selectedArticle.created_at}
                </span>
                <span className="flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-orange-500" />
                  {selectedArticle.author || 'Tác giả TechGear'}
                </span>
              </div>

              <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                  {selectedArticle.excerpt}
                </p>
                <p className="whitespace-pre-line">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentNews.map(article => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
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
                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 mt-1">
                  {article.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {article.excerpt}
                </p>
              </div>
              <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                Xem chi tiết bài viết →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md font-extrabold border border-orange-500/20">
            Trang {currentPage} / {totalPages}
          </span>
          <span>
            Hiển thị <strong className="text-slate-900 dark:text-white">{currentNews.length}</strong> trên <strong className="text-slate-900 dark:text-white">{totalArticles}</strong> bài viết
          </span>

          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span>Bài / trang:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold focus:outline-none"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded-xl font-extrabold text-xs transition-all ${
                  currentPage === pageNum
                    ? 'bg-orange-500 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-orange-500 hover:text-slate-950 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

