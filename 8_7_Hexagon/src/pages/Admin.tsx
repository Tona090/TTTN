import React, { useState, useEffect } from 'react';
import { Puck } from '@puckeditor/core';
import '@puckeditor/core/dist/index.css';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  LayoutTemplate, 
  FileText, 
  Users, 
  Home, 
  Activity, 
  Plus, 
  Languages, 
  Calendar, 
  File, 
  Trash2, 
  Eye, 
  Copy, 
  Check, 
  Globe, 
  X 
} from 'lucide-react';

import { 
  HeroCustom, 
  AboutCustom, 
  ServicesCustom, 
  NewsCustom, 
  PartnersCustom, 
  ContactCustom 
} from '../components/CustomComponents';

// Puck configuration inputs mapping exactly to the requested background types, gradient directions, animations, and buttons
const commonFields = {
  backgroundType: {
    type: "select" as const,
    label: "Loại hình nền (Background Type)",
    options: [
      { value: 'color', label: 'Màu sắc (Color)' },
      { value: 'gradient', label: 'Gradient' },
      { value: 'image', label: 'Hình ảnh (Image)' },
      { value: 'image+gradient', label: 'Hình ảnh & Gradient' },
      { value: 'image+color', label: 'Hình ảnh & Màu sắc' }
    ]
  },
  bgColor: { type: "text" as const, label: "Màu nền / Màu phủ (Hex hoặc Tailwind class, ví dụ: #135237)" },
  gradientColor1: { type: "text" as const, label: "Màu Gradient bắt đầu (Hex, ví dụ: #135237)" },
  gradientColor2: { type: "text" as const, label: "Màu Gradient kết thúc (Hex, ví dụ: #41b67d)" },
  gradientDirection: {
    type: "select" as const,
    label: "Hướng Gradient (Gradient Direction)",
    options: [
      { value: 'to right', label: 'Trái → Phải (to right)' },
      { value: 'to left', label: 'Phải → Trái (to left)' },
      { value: 'to bottom', label: 'Trên → Dưới (to bottom)' },
      { value: 'to bottom right', label: 'Góc trên-trái → dưới-phải' },
      { value: 'to bottom left', label: 'Góc trên-phải → dưới-trái' }
    ]
  },
  backgroundImageUrl: { type: "text" as const, label: "URL Hình ảnh nền (Background Image URL)" },
  
  // Customizable texts
  title: { type: "text" as const, label: "Tiêu đề tùy chỉnh (Title Override)" },
  titleColor: { type: "text" as const, label: "Màu chữ tiêu đề (Hex)" },
  description: { type: "textarea" as const, label: "Mô tả ngắn tùy chỉnh" },
  descriptionColor: { type: "text" as const, label: "Màu chữ mô tả (Hex)" },
  
  // Animation switch
  animate: {
    type: "radio" as const,
    label: "Hiệu ứng chuyển động (Animation)",
    options: [
      { value: 'on', label: 'Bật (On)' },
      { value: 'off', label: 'Tắt (Off)' }
    ]
  },
  
  // Custom action buttons
  showButton: {
    type: "radio" as const,
    label: "Hiển thị nút bấm (Show Button)",
    options: [
      { value: 'on', label: 'Bật (On)' },
      { value: 'off', label: 'Tắt (Off)' }
    ]
  },
  buttonText: { type: "text" as const, label: "Chữ hiển thị trên nút" },
  buttonLink: { type: "text" as const, label: "Đường dẫn khi click nút (ví dụ: #lien-he)" },
  buttonBgColor: { type: "text" as const, label: "Màu nền nút bấm (Hex)" },
  buttonTextColor: { type: "text" as const, label: "Màu chữ nút bấm (Hex)" }
};

const puckConfig = {
  components: {
    Hero: {
      fields: commonFields,
      render: ({ ...props }) => <HeroCustom {...props} />
    },
    About: {
      fields: commonFields,
      render: ({ ...props }) => <AboutCustom {...props} />
    },
    Services: {
      fields: commonFields,
      render: ({ ...props }) => <ServicesCustom {...props} />
    },
    News: {
      fields: commonFields,
      render: ({ ...props }) => <NewsCustom {...props} />
    },
    Partners: {
      fields: commonFields,
      render: ({ ...props }) => <PartnersCustom {...props} />
    },
    Contact: {
      fields: commonFields,
      render: ({ ...props }) => <ContactCustom {...props} />
    }
  }
};

interface PageItem {
  id: string;
  title: string;
  seoTitle: string;
  slug: string;
  lang: 'vi' | 'en';
  status: 'Đã xuất bản' | 'Nháp';
  updatedAt: string;
  content: any;
}

const DEFAULT_PAGES: PageItem[] = [
  {
    id: 'home-vi',
    title: 'Trang Chủ',
    seoTitle: 'HEXAGON - Giải Pháp Công Nghệ Toàn Diện',
    slug: '/',
    lang: 'vi',
    status: 'Đã xuất bản',
    updatedAt: '09/07/2026',
    content: {
      content: [
        { id: 'hero-vi', type: 'Hero', props: { animate: 'on', showButton: 'on' } },
        { id: 'about-vi', type: 'About', props: { animate: 'on' } },
        { id: 'services-vi', type: 'Services', props: {} },
        { id: 'news-vi', type: 'News', props: {} },
        { id: 'partners-vi', type: 'Partners', props: { animate: 'off' } },
        { id: 'contact-vi', type: 'Contact', props: {} }
      ],
      root: {}
    }
  },
  {
    id: 'home-en',
    title: 'Home Page',
    seoTitle: 'HEXAGON - Comprehensive IT Solutions',
    slug: '/',
    lang: 'en',
    status: 'Đã xuất bản',
    updatedAt: '09/07/2026',
    content: {
      content: [
        { id: 'hero-en', type: 'Hero', props: { title: 'HEXAGON DIGITAL TECHNOLOGY', description: 'Driving digital transformation and infrastructure solutions.', animate: 'on', showButton: 'on', buttonText: 'Contact Us' } },
        { id: 'about-en', type: 'About', props: { title: 'ABOUT HEXAGON', description: 'Providing high-quality computing, systems integration, and professional installation.', animate: 'on' } },
        { id: 'services-en', type: 'Services', props: { title: 'OUR SERVICES', description: 'We design, install, and optimize secure technology spaces.' } },
        { id: 'news-en', type: 'News', props: { title: 'NEWS & MEDIA', description: 'Stay updated with the latest trends and tech releases.' } },
        { id: 'partners-en', type: 'Partners', props: { title: 'CLIENTS & PARTNERS', animate: 'off' } },
        { id: 'contact-en', type: 'Contact', props: { title: 'GET IN TOUCH', description: 'Connect with our team to configure your environment today.' } }
      ],
      root: {}
    }
  },
  {
    id: 'kiem-thu-vi',
    title: 'Kiểm Thử',
    seoTitle: 'Kiểm Thử Hệ Thống',
    slug: '/kiem-thu',
    lang: 'vi',
    status: 'Đã xuất bản',
    updatedAt: '01/07/2026',
    content: {
      content: [
        { id: 'kiem-thu-hero', type: 'Hero', props: { title: "Trang Kiểm Thử CMS", description: "Đây là trang mẫu được quản lý bằng Puck Editor.", animate: 'on' } },
        { id: 'kiem-thu-about', type: 'About', props: { title: "Chi Tiết Kiểm Thử", description: "Nội dung này có thể dễ dàng được dịch hoặc nhân bản sang tiếng Anh chỉ bằng một nút bấm!" } }
      ],
      root: {}
    }
  }
];

const sanitizePages = (items: PageItem[]): PageItem[] => {
  return items.map(p => {
    const rawContent = p.content?.content || [];
    let hasChanges = false;
    const processedContent = rawContent.map((block: any, idx: number) => {
      if (!block.id) {
        hasChanges = true;
        return {
          ...block,
          id: `${block.type || 'block'}-${idx}-${Math.random().toString(36).substr(2, 9)}`
        };
      }
      return block;
    });
    if (hasChanges || !p.content?.root) {
      return {
        ...p,
        content: {
          ...(p.content || {}),
          content: processedContent,
          root: p.content?.root || {}
        }
      };
    }
    return p;
  });
};

export default function Admin() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('pages');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);

  // Core Pages state
  const [pages, setPages] = useState<PageItem[]>(() => {
    let rawPages = DEFAULT_PAGES;
    try {
      const saved = localStorage.getItem('hexagon_cms_pages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          rawPages = parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse pages from localStorage:", e);
    }
    return sanitizePages(rawPages);
  });

  // Filter States
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  // Modal State for New Page creation
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newLang, setNewLang] = useState<'vi' | 'en'>('vi');
  const [newSeoTitle, setNewSeoTitle] = useState('');

  // Modal State for Edit Page settings
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingPage, setSettingPage] = useState<PageItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editLang, setEditLang] = useState<'vi' | 'en'>('vi');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editStatus, setEditStatus] = useState<'Đã xuất bản' | 'Nháp'>('Nháp');

  // Custom non-blocking dialog state (iframe-friendly alternative to alert/confirm)
  const [customAlert, setCustomAlert] = useState<{
    isOpen: boolean;
    type: 'info' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setCustomAlert({
      isOpen: true,
      type: 'info',
      title,
      message,
      onConfirm
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setCustomAlert({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  // Persist to localstorage whenever pages list updates
  useEffect(() => {
    localStorage.setItem('hexagon_cms_pages', JSON.stringify(pages));
  }, [pages]);

  // Sync i18n language with the page language being edited
  useEffect(() => {
    if (isEditorOpen && editingPage) {
      if (typeof window !== 'undefined') {
        (window as any).__HEXAGON_CMS_LANG__ = editingPage.lang;
      }
      i18n.changeLanguage(editingPage.lang);
    } else {
      if (typeof window !== 'undefined') {
        (window as any).__HEXAGON_CMS_LANG__ = 'vi';
      }
      i18n.changeLanguage('vi'); // Default back to Vietnamese when exiting editor
    }
  }, [isEditorOpen, editingPage, i18n]);

  const handleOpenSettings = (page: PageItem) => {
    setSettingPage(page);
    setEditTitle(page.title);
    setEditSlug(page.slug);
    setEditLang(page.lang);
    setEditSeoTitle(page.seoTitle || '');
    setEditStatus(page.status);
    setIsSettingsModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editSlug.trim()) {
      showAlert("Vui lòng điền đủ thông tin", "Vui lòng điền đầy đủ Tiêu đề và Đường dẫn.");
      return;
    }

    let formattedSlug = editSlug.trim();
    if (!formattedSlug.startsWith('/')) {
      formattedSlug = '/' + formattedSlug;
    }

    setPages(prev => prev.map(p => {
      if (p.id === settingPage?.id) {
        return {
          ...p,
          title: editTitle.trim(),
          seoTitle: editSeoTitle.trim() || `${editTitle.trim()} - Hexagon`,
          slug: formattedSlug,
          lang: editLang,
          status: editStatus,
          updatedAt: new Date().toLocaleDateString('vi-VN')
        };
      }
      return p;
    }));

    setIsSettingsModalOpen(false);
    setSettingPage(null);
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      showAlert("Vui lòng điền đủ thông tin", "Vui lòng điền đầy đủ Tiêu đề và Đường dẫn.");
      return;
    }

    // Format slug
    let formattedSlug = newSlug.trim();
    if (!formattedSlug.startsWith('/')) {
      formattedSlug = '/' + formattedSlug;
    }

    const timestamp = Date.now();
    const newPage: PageItem = {
      id: 'page-' + timestamp,
      title: newTitle.trim(),
      seoTitle: newSeoTitle.trim() || `${newTitle.trim()} - Hexagon`,
      slug: formattedSlug,
      lang: newLang,
      status: 'Nháp',
      updatedAt: new Date().toLocaleDateString('vi-VN'),
      content: {
        content: [
          { id: `hero-${timestamp}`, type: 'Hero', props: { title: newTitle.trim() } },
          { id: `about-${timestamp}`, type: 'About', props: {} }
        ],
        root: {}
      }
    };

    setPages(prev => [newPage, ...prev]);
    setIsNewPageModalOpen(false);
    
    // Clear form inputs
    setNewTitle('');
    setNewSlug('');
    setNewLang('vi');
    setNewSeoTitle('');
    
    // Prompt to open editor immediately using custom non-blocking modal
    showConfirm(
      "Khởi tạo thành công",
      `Đã tạo trang "${newPage.title}" thành công!\n\nBạn có muốn mở trình soạn thảo Puck để thiết kế trang ngay bây giờ không?`,
      () => {
        setEditingPage(newPage);
        setIsEditorOpen(true);
      }
    );
  };

  const handleDeletePage = (id: string, title: string) => {
    showConfirm(
      "Xóa trang giao diện",
      `Bạn có chắc chắn muốn xóa trang "${title}"?\n\nThao tác này không thể hoàn tác.`,
      () => {
        setPages(prev => prev.filter(p => p.id !== id));
      }
    );
  };

  // Clone translation handler (multi-language duplicate)
  const handleCloneTranslation = (page: PageItem) => {
    const targetLang = page.lang === 'vi' ? 'en' : 'vi';
    const targetLangName = targetLang === 'vi' ? 'Tiếng Việt (VI)' : 'Tiếng Anh (EN)';
    
    showConfirm(
      "Tạo Bản Dịch",
      `Bạn có muốn tạo bản dịch ${targetLangName} cho trang "${page.title}"?\n\nNội dung thiết kế hiện tại sẽ được nhân bản sang ngôn ngữ mới để bạn dễ dàng dịch nghĩa và tùy biến.`,
      () => {
        const clonedPage: PageItem = {
          ...page,
          id: 'page-' + Date.now(),
          title: `${page.title} (Bản dịch ${targetLang.toUpperCase()})`,
          seoTitle: `SEO: ${page.seoTitle} (${targetLang.toUpperCase()})`,
          lang: targetLang,
          updatedAt: new Date().toLocaleDateString('vi-VN'),
          status: 'Đã xuất bản'
        };

        setPages(prev => [clonedPage, ...prev]);
        
        // Show next option to open immediately with a small delay for state transition
        setTimeout(() => {
          showConfirm(
            "Nhân bản thành công",
            `Đã nhân bản trang thành công sang ngôn ngữ ${targetLang.toUpperCase()}!\n\nBạn có muốn mở ngay Puck Editor để dịch nội dung sang tiếng ${targetLang === 'vi' ? 'Việt' : 'Anh'} không?`,
            () => {
              setEditingPage(clonedPage);
              setIsEditorOpen(true);
            }
          );
        }, 300);
      }
    );
  };

  // Filter pages list
  const filteredPages = pages.filter(p => {
    if (filterLang !== 'all' && p.lang !== filterLang) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterDate) {
      // Basic date formatting check dd/mm/yyyy
      const dateParts = filterDate.split('-'); // yyyy-mm-dd
      if (dateParts.length === 3) {
        const formattedFilterDate = `${parseInt(dateParts[2])}/${parseInt(dateParts[1])}/${dateParts[0]}`;
        return p.updatedAt === formattedFilterDate;
      }
    }
    return true;
  });

  if (isEditorOpen && editingPage) {
    const safePuckData = editingPage.content || { content: [], root: {} };

    return (
      <div className="w-screen h-screen flex flex-col bg-white">
        <div className="w-full bg-[#135237] px-6 py-3 flex items-center justify-between shadow-md z-50">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" />
              Hexagon Visual Builder
            </span>
            <span className="text-emerald-100 text-xs px-2.5 py-1 rounded bg-white/10 font-medium">
              Đang chỉnh sửa: {editingPage.title} ({editingPage.lang.toUpperCase()})
            </span>
          </div>
          <button 
            onClick={() => {
              setIsEditorOpen(false);
              setEditingPage(null);
            }} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            Quay lại Admin
          </button>
        </div>
        <div className="flex-1 w-full overflow-hidden relative">
          <Puck 
            config={puckConfig} 
            data={safePuckData} 
            onPublish={(data) => {
              const updated = pages.map(p => {
                if (p.id === editingPage.id) {
                  return {
                    ...p,
                    content: data,
                    status: 'Đã xuất bản' as const,
                    updatedAt: new Date().toLocaleDateString('vi-VN')
                  };
                }
                return p;
              });
              setPages(updated);
              showAlert("Đã xuất bản", "Đã xuất bản trang thành công!");
              setIsEditorOpen(false);
              setEditingPage(null);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#135237] text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <img src="https://beta.hexagon.xyz/assets/images/logo-hhc.png" alt="Hexagon" className="h-8 w-auto brightness-0 invert" />
          <span className="font-bold text-lg tracking-wider ml-2">HEXAGON ADMIN</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-white/15 text-white font-medium shadow-inner' : 'text-emerald-100 hover:bg-white/5 hover:text-white'}`}
          >
            <Activity className="w-5 h-5" />
            Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === 'pages' ? 'bg-white/15 text-white font-medium shadow-inner' : 'text-emerald-100 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutTemplate className="w-5 h-5" />
            Quản lý Pages (Puck)
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === 'posts' ? 'bg-white/15 text-white font-medium shadow-inner' : 'text-emerald-100 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            Bài viết
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === 'users' ? 'bg-white/15 text-white font-medium shadow-inner' : 'text-emerald-100 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            Người dùng
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-emerald-100 hover:text-white hover:bg-white/5 transition-colors">
            <Home className="w-4 h-4" />
            Xem trang web
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 z-10">
          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === 'dashboard' ? 'Tổng quan hệ thống' : 
             activeTab === 'pages' ? 'Quản lý giao diện' : 
             activeTab === 'posts' ? 'Quản lý bài viết' : 'Người dùng'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Lượt truy cập', value: '1,532', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Bài viết', value: '24', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Trang giao diện', value: (pages || []).length.toString(), icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Thành viên', value: '8', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
                  <div className="space-y-4">
                    {[
                      { text: 'Xuất bản giao diện Trang chủ (English)', time: 'Vừa xong', icon: LayoutTemplate, color: 'text-purple-600' },
                      { text: 'Khởi tạo trang mẫu "Kiểm Thử" tiếng Việt', time: '1 ngày trước', icon: FileText, color: 'text-emerald-600' },
                      { text: 'Chỉnh sửa liên kết trang và ngôn ngữ', time: '2 ngày trước', icon: Users, color: 'text-blue-600' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className={`mt-0.5 ${act.color}`}>
                          <act.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{act.text}</div>
                          <div className="text-xs text-gray-500 mt-1">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pages' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Visual Header precisely matched from screenshot */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-7 h-7 text-[#135237]" />
                      Quản lý Pages
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Tạo và quản lý các trang với PUCK Visual Builder</p>
                  </div>
                  <button 
                    onClick={() => setIsNewPageModalOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Tạo Page Mới
                  </button>
                </div>

                {/* Filters card precisely styled like image 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ngôn ngữ</label>
                      <select 
                        value={filterLang} 
                        onChange={(e) => setFilterLang(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#135237]"
                      >
                        <option value="all">Tất cả</option>
                        <option value="vi">Tiếng Việt (VI)</option>
                        <option value="en">English (EN)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#135237]"
                      >
                        <option value="all">Tất cả</option>
                        <option value="Đã xuất bản">Đã xuất bản</option>
                        <option value="Nháp">Nháp</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày cập nhật</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#135237]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table containing the page rows precisely structured like screenshots */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu đề</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ngôn ngữ</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cập nhật</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredPages.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                              Không tìm thấy trang nào phù hợp với bộ lọc.
                            </td>
                          </tr>
                        ) : (
                          filteredPages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gray-50 group-hover:bg-emerald-50 text-[#135237] rounded-lg transition-colors">
                                    <File className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 text-sm">{page.title}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">SEO: {page.seoTitle || page.title}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono border border-gray-200/50">
                                  {page.slug}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                                  {page.lang.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                  page.status === 'Đã xuất bản' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {page.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {page.updatedAt}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {/* Multi-language Translation Clone precisely structured */}
                                  <button 
                                    onClick={() => handleCloneTranslation(page)}
                                    title={page.lang === 'vi' ? 'Tạo bản dịch EN' : 'Tạo bản dịch VI'}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                                  >
                                    <Languages className="w-4 h-4" />
                                  </button>
                                  
                                  {/* Open Puck Editor */}
                                  <button 
                                    onClick={() => {
                                      setEditingPage(page);
                                      setIsEditorOpen(true);
                                    }} 
                                    title="Chỉnh sửa với Puck"
                                    className="p-2 text-gray-400 hover:text-[#135237] hover:bg-emerald-50 rounded-lg transition-colors"
                                  >
                                    <LayoutTemplate className="w-4 h-4" />
                                  </button>

                                  {/* Edit settings */}
                                  <button 
                                    onClick={() => handleOpenSettings(page)}
                                    title="Chỉnh sửa thông tin trang"
                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </button>
                                  
                                  {/* Delete Page */}
                                  <button 
                                    onClick={() => handleDeletePage(page.id, page.title)}
                                    title="Xóa trang"
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
            
            {(activeTab === 'posts' || activeTab === 'users') && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tính năng đang phát triển</h3>
                <p className="text-gray-500">Module này sẽ sớm được ra mắt trong các phiên bản cập nhật tiếp theo.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Creation Modal */}
      {isNewPageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#135237] text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tạo Trang Giao Diện Mới
              </h3>
              <button 
                onClick={() => setIsNewPageModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePage} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề trang (Title)</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: Kiểm Thử, Về Chúng Tôi"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    // Generate basic slug automatically
                    const autoSlug = '/' + e.target.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/đ/g, "d")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-");
                    setNewSlug(autoSlug);
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#135237]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn (Slug)</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: /ve-chung-toi"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#135237]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngôn ngữ (Language)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="newLang" 
                      checked={newLang === 'vi'}
                      onChange={() => setNewLang('vi')}
                      className="text-[#135237] focus:ring-[#135237]"
                    />
                    Tiếng Việt (VI)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="newLang" 
                      checked={newLang === 'en'}
                      onChange={() => setNewLang('en')}
                      className="text-[#135237] focus:ring-[#135237]"
                    />
                    English (EN)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề SEO (Tùy chọn)</label>
                <input 
                  type="text"
                  placeholder="Tiêu đề hiển thị trên thanh tab trình duyệt"
                  value={newSeoTitle}
                  onChange={(e) => setNewSeoTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#135237]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewPageModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  Khởi tạo trang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {isSettingsModalOpen && settingPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Chỉnh Sửa Thông Tin Trang
              </h3>
              <button 
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setSettingPage(null);
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề trang (Title)</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: Kiểm Thử, Về Chúng Tôi"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn (Slug)</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: /ve-chung-toi"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngôn ngữ (Language)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editLang" 
                      checked={editLang === 'vi'}
                      onChange={() => setEditLang('vi')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    Tiếng Việt (VI)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editLang" 
                      checked={editLang === 'en'}
                      onChange={() => setEditLang('en')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    English (EN)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái (Status)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editStatus" 
                      checked={editStatus === 'Đã xuất bản'}
                      onChange={() => setEditStatus('Đã xuất bản')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    Đã xuất bản (Published)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editStatus" 
                      checked={editStatus === 'Nháp'}
                      onChange={() => setEditStatus('Nháp')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    Nháp (Draft)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề SEO (SEO Title)</label>
                <input 
                  type="text"
                  placeholder="Tiêu đề hiển thị trên thanh tab trình duyệt"
                  value={editSeoTitle}
                  onChange={(e) => setEditSeoTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsSettingsModalOpen(false);
                    setSettingPage(null);
                  }}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Dialog Alert / Confirm Modal (iframe-friendly) */}
      {customAlert?.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className={`px-6 py-4 text-white flex items-center justify-between ${
              customAlert.type === 'confirm' 
                ? (customAlert.title.toLowerCase().includes('xóa') ? 'bg-red-600' : 'bg-blue-600') 
                : 'bg-[#135237]'
            }`}>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {customAlert.type === 'confirm' ? (
                  customAlert.title.toLowerCase().includes('xóa') ? <Trash2 className="w-5 h-5" /> : <Languages className="w-5 h-5 animate-pulse" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                {customAlert.title}
              </h3>
              <button 
                onClick={() => {
                  setCustomAlert(null);
                  if (customAlert.onCancel) customAlert.onCancel();
                }}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {customAlert.message}
              </p>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                {customAlert.type === 'confirm' && (
                  <button 
                    type="button"
                    onClick={() => {
                      setCustomAlert(null);
                      if (customAlert.onCancel) customAlert.onCancel();
                    }}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => {
                    const confirmAction = customAlert.onConfirm;
                    setCustomAlert(null);
                    if (confirmAction) confirmAction();
                  }}
                  className={`px-5 py-2 text-white rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer ${
                    customAlert.type === 'confirm'
                      ? (customAlert.title.toLowerCase().includes('xóa') ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700')
                      : 'bg-[#135237] hover:bg-[#0f402b]'
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
