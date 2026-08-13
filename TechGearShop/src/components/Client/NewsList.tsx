import React, { useState, useEffect } from 'react';
import { 
  Newspaper, Calendar, User as UserIcon, ArrowLeft, X, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Search, SlidersHorizontal, Tag, Eye, Heart, 
  MessageSquare, Send, Reply, Trash2, ThumbsUp, Share2, Sparkles, Check
} from 'lucide-react';
import { NewsArticle, ArticleComment, User } from '../../types';

interface Props {
  news: NewsArticle[];
  selectedArticle: NewsArticle | null;
  onSelectArticle: (article: NewsArticle | null) => void;
  user?: User | null;
  onRefreshNews?: () => void;
  onRequireAuth?: () => void;
}

const CATEGORIES = [
  'Tất cả',
  'Đánh giá Gear',
  'Hướng dẫn Setup',
  'Kinh Nghiệm',
  'Tin Công Nghệ'
];

export const NewsList: React.FC<Props> = ({ 
  news, 
  selectedArticle, 
  onSelectArticle,
  user,
  onRefreshNews,
  onRequireAuth
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'likes' | 'title_asc'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Article Comments & Interactive State for Selected Article
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [articleLikes, setArticleLikes] = useState<number>(0);
  const [hasLikedArticle, setHasLikedArticle] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);

  // Comment Form State
  const [authorName, setAuthorName] = useState<string>(user?.name || '');
  const [commentContent, setCommentContent] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Keep authorName updated when user changes
  useEffect(() => {
    if (user?.name) {
      setAuthorName(user.name);
    }
  }, [user]);

  // Fetch or setup article details & comments when opening modal
  useEffect(() => {
    if (selectedArticle) {
      setArticleLikes(selectedArticle.likes || 0);
      setHasLikedArticle(false);
      setReplyingToId(null);
      setCommentContent('');
      setReplyContent('');

      // Increment view count on server & fetch comments
      fetch(`/api/news/${selectedArticle.id}`)
        .then(res => res.json())
        .then(updatedArticle => {
          if (updatedArticle && updatedArticle.views !== undefined) {
            selectedArticle.views = updatedArticle.views;
          }
        })
        .catch(err => console.error('Error fetching article detail:', err));

      loadComments(selectedArticle.id);
    }
  }, [selectedArticle?.id]);

  const loadComments = (articleId: number) => {
    setLoadingComments(true);
    fetch(`/api/news/${articleId}/comments`)
      .then(res => res.json())
      .then((data: ArticleComment[]) => {
        if (Array.isArray(data)) {
          setComments(data);
          let total = 0;
          data.forEach(c => {
            total += 1;
            if (c.replies) total += c.replies.length;
          });
          setCommentCount(total);
        }
      })
      .catch(err => console.error('Lỗi khi tải bình luận:', err))
      .finally(() => setLoadingComments(false));
  };

  // Handle article search & sorting
  const filteredArticles = news.filter(article => {
    // Category match
    if (selectedCategory !== 'Tất cả') {
      const catLower = selectedCategory.toLowerCase();
      if (!article.category || !article.category.toLowerCase().includes(catLower)) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = article.title.toLowerCase().includes(q);
      const matchExcerpt = article.excerpt.toLowerCase().includes(q);
      const matchContent = article.content.toLowerCase().includes(q);
      const matchAuthor = article.author ? article.author.toLowerCase().includes(q) : false;
      const matchTags = article.tags ? article.tags.some(t => t.toLowerCase().includes(q)) : false;
      return matchTitle || matchExcerpt || matchContent || matchAuthor || matchTags;
    }

    return true;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'title_asc') {
      return a.title.localeCompare(b.title, 'vi');
    }
    // Default 'newest'
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Pagination calculation
  const totalArticles = sortedArticles.length;
  const totalPages = Math.ceil(totalArticles / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentNews = sortedArticles.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Article Like
  const handleLikeArticle = () => {
    if (!selectedArticle || hasLikedArticle) return;
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert('Vui lòng đăng nhập để thích bài viết này!');
      }
      return;
    }
    setHasLikedArticle(true);
    setArticleLikes(prev => prev + 1);

    const token = localStorage.getItem('techgear_token');
    fetch(`/api/news/${selectedArticle.id}/like`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.likes) {
          setArticleLikes(data.likes);
          if (onRefreshNews) onRefreshNews();
        }
      })
      .catch(err => console.error('Lỗi khi thích bài viết:', err));
  };

  // Handle Share Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Submit Comment / Reply
  const handleSubmitComment = (parentId: number | null = null) => {
    if (!selectedArticle) return;
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert('Vui lòng đăng nhập để gửi bình luận!');
      }
      return;
    }
    const contentToSubmit = parentId ? replyContent : commentContent;

    if (!contentToSubmit.trim()) {
      alert('Vui lòng nhập nội dung bình luận!');
      return;
    }

    setSubmittingComment(true);
    const token = localStorage.getItem('techgear_token');

    fetch(`/api/news/${selectedArticle.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        content: contentToSubmit.trim(),
        user_name: user?.name || authorName || 'Khách Hàng',
        parent_id: parentId,
        avatar: user?.avatar || ''
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.comments) {
          setComments(data.comments);
          if (data.total_comments !== undefined) {
            setCommentCount(data.total_comments);
          }
          if (parentId) {
            setReplyContent('');
            setReplyingToId(null);
          } else {
            setCommentContent('');
          }
          if (onRefreshNews) onRefreshNews();
        } else if (data.message) {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Lỗi khi gửi bình luận:', err);
        alert('Gửi bình luận thất bại. Vui lòng thử lại!');
      })
      .finally(() => setSubmittingComment(false));
  };

  // Handle Like Comment
  const handleLikeComment = (commentId: number) => {
    if (!selectedArticle) return;
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert('Vui lòng đăng nhập để thích bình luận này!');
      }
      return;
    }
    const token = localStorage.getItem('techgear_token');
    fetch(`/api/news/${selectedArticle.id}/comments/${commentId}/like`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          loadComments(selectedArticle.id);
        }
      })
      .catch(err => console.error('Lỗi khi thích bình luận:', err));
  };

  // Handle Delete Comment
  const handleDeleteComment = (commentId: number) => {
    if (!selectedArticle) return;
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    const token = localStorage.getItem('techgear_token');
    fetch(`/api/news/${selectedArticle.id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.comments) {
          setComments(data.comments);
          if (data.total_comments !== undefined) {
            setCommentCount(data.total_comments);
          }
          if (onRefreshNews) onRefreshNews();
        } else if (data.message) {
          alert(data.message);
        }
      })
      .catch(err => console.error('Lỗi khi xóa bình luận:', err));
  };

  // Helper for Category Badge Color
  const getCategoryBadgeClass = (categoryName?: string) => {
    switch (categoryName) {
      case 'Đánh giá Gear':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'Hướng dẫn Setup':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Kinh Nghiệm':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Tin Công Nghệ':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
            <Newspaper className="w-4 h-4" />
            Tin Tức & Blog Công Nghệ TechGear
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">ĐÁNH GIÁ, SETUP & KINH NGHIỆM GEAR</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tổng hợp các bài đánh giá sâu bàn phím cơ custom, chuột gaming, tai nghe chống ồn và bí quyết bài trí không gian làm việc chuyên nghiệp.
          </p>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm bài viết, tác giả, từ khóa (ví dụ: Keychron, setup, tai nghe)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto min-w-[200px]">
            <SlidersHorizontal className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="views">Lượt xem nhiều nhất</option>
              <option value="likes">Yêu thích nhiều nhất</option>
              <option value="title_asc">Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-3">
          {CATEGORIES.map(category => {
            const isActive = selectedCategory === category;
            const count = category === 'Tất cả' 
              ? news.length 
              : news.filter(n => n.category && n.category.toLowerCase().includes(category.toLowerCase())).length;

            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-md shadow-orange-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive 
                    ? 'bg-slate-950/20 text-slate-950' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || selectedCategory !== 'Tất cả') && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-orange-50 dark:bg-orange-950/20 p-2.5 rounded-xl border border-orange-200 dark:border-orange-900/40">
            <span>
              Tìm thấy <strong className="text-orange-600 dark:text-orange-400 font-extrabold">{totalArticles}</strong> bài viết phù hợp
              {searchQuery && <> với từ khóa "<strong>{searchQuery}</strong>"</>}
              {selectedCategory !== 'Tất cả' && <> trong danh mục "<strong>{selectedCategory}</strong>"</>}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
                setCurrentPage(1);
              }}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 shrink-0">
              <button
                onClick={() => onSelectArticle(null)}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 hover:text-orange-500 transition-colors bg-white dark:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Chia sẻ bài viết"
                  className="p-2 text-slate-500 hover:text-orange-500 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
                </button>
                <button
                  onClick={() => onSelectArticle(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Article Header & Main Content */}
              <div className="space-y-4">
                {/* Category Pill */}
                {selectedArticle.category && (
                  <span className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-full border ${getCategoryBadgeClass(selectedArticle.category)}`}>
                    {selectedArticle.category}
                  </span>
                )}

                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {selectedArticle.title}
                </h2>

                {/* Article Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      {selectedArticle.created_at}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <UserIcon className="w-3.5 h-3.5 text-orange-500" />
                      {selectedArticle.author || 'Tác giả TechGear'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {selectedArticle.views || 0} lượt xem
                    </span>
                    <button
                      onClick={handleLikeArticle}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                        hasLikedArticle 
                          ? 'bg-rose-500 text-white border-rose-500 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLikedArticle ? 'fill-current' : ''}`} />
                      <span>{articleLikes}</span>
                    </button>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                  <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full aspect-video object-cover" />
                </div>

                {/* Excerpt */}
                <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-slate-800 dark:text-slate-200 font-semibold text-xs leading-relaxed italic">
                  "{selectedArticle.excerpt}"
                </div>

                {/* Full Article Content */}
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs space-y-3 whitespace-pre-line font-medium">
                  {selectedArticle.content}
                </div>

                {/* Article Tags */}
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <div className="pt-3 flex flex-wrap items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedArticle.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* COMMENTS & DISCUSSION SECTION */}
              <div className="pt-6 space-y-6">
                
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Bình Luận & Thảo Luận ({commentCount})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">Tự do trao đổi & hỏi đáp công nghệ</span>
                </div>

                {/* New Comment Box */}
                {!user ? (
                  <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>Bạn cần <strong>Đăng Nhập</strong> để gửi bình luận và tương tác bài viết này.</span>
                    </div>
                    <button
                      onClick={() => onRequireAuth ? onRequireAuth() : alert('Vui lòng đăng nhập!')}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl shadow-md transition-all shrink-0"
                    >
                      Đăng Nhập Ngay
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          (user.name || 'K').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 font-bold text-xs text-slate-900 dark:text-white">
                        {user.name} ({user.email})
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Viết bình luận hoặc đặt câu hỏi về bài viết này..."
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSubmitComment(null)}
                        disabled={submittingComment || !commentContent.trim()}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingComment ? 'Đang gửi...' : 'Gửi Bình Luận'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {loadingComments ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-orange-500" />
                    Đang tải danh sách bình luận...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        
                        {/* Parent Comment Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center overflow-hidden shrink-0">
                              {comment.avatar ? (
                                <img src={comment.avatar} alt={comment.user_name} className="w-full h-full object-cover" />
                              ) : (
                                comment.user_name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                                  {comment.user_name}
                                </span>
                                {comment.is_author && (
                                  <span className="px-1.5 py-0.2 bg-orange-500 text-slate-950 font-black text-[9px] rounded-md">
                                    Tác Giả
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{comment.created_at}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Delete comment button if user is admin or author */}
                            {(user?.role === 'SuperAdmin' || user?.role === 'Admin' || user?.role === 'Editor' || (user && user.id === comment.user_id)) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Xóa bình luận"
                                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Comment Content */}
                        <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed pl-10">
                          {comment.content}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-4 pl-10 text-[11px] text-slate-500">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className="flex items-center gap-1 hover:text-rose-500 transition-colors font-semibold"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Thích ({comment.likes || 0})</span>
                          </button>

                          <button
                            onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 hover:text-orange-500 transition-colors font-semibold"
                          >
                            <Reply className="w-3.5 h-3.5" />
                            <span>Trả lời</span>
                          </button>
                        </div>

                        {/* Reply Form (Inline) */}
                        {replyingToId === comment.id && (
                          <div className="ml-10 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                            <textarea
                              rows={2}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder={`Trả lời ${comment.user_name}...`}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setReplyingToId(null)}
                                className="px-3 py-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => handleSubmitComment(comment.id)}
                                disabled={submittingComment || !replyContent.trim()}
                                className="px-3 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm disabled:opacity-50"
                              >
                                <Send className="w-3 h-3" />
                                <span>Gửi</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-8 pl-4 border-l-2 border-orange-500/30 space-y-3 pt-2">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white font-bold text-[10px] flex items-center justify-center overflow-hidden shrink-0">
                                      {reply.avatar ? (
                                        <img src={reply.avatar} alt={reply.user_name} className="w-full h-full object-cover" />
                                      ) : (
                                        reply.user_name.charAt(0).toUpperCase()
                                      )}
                                    </div>
                                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                                      {reply.user_name}
                                    </span>
                                    {reply.is_author && (
                                      <span className="px-1.5 py-0.2 bg-orange-500 text-slate-950 font-black text-[8px] rounded-md">
                                        Tác Giả
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400">{reply.created_at}</span>
                                  </div>

                                  {(user?.role === 'SuperAdmin' || user?.role === 'Admin' || user?.role === 'Editor' || (user && user.id === reply.user_id)) && (
                                    <button
                                      onClick={() => handleDeleteComment(reply.id)}
                                      title="Xóa câu trả lời"
                                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>

                                <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed pl-8">
                                  {reply.content}
                                </p>

                                <div className="pl-8 pt-1">
                                  <button
                                    onClick={() => handleLikeComment(reply.id)}
                                    className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-rose-500 font-semibold"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                    <span>Thích ({reply.likes || 0})</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

      {/* News Articles Grid */}
      {currentNews.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Không tìm thấy bài viết phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để xem thêm bài viết.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Tất cả');
            }}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-md"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNews.map(article => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Image Header */}
              <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                {article.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryBadgeClass(article.category)}`}>
                      {article.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      {article.created_at}
                    </span>
                    <span>{article.author || 'TechGear'}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                {/* Metrics Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title="Lượt xem">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {article.views || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Yêu thích">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      {article.likes || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Bình luận">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                      {article.comments_count || 0}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Đọc tiếp →
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls Bar */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
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
      )}

    </div>
  );
};
