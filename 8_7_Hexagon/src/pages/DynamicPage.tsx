import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageRenderer from '../components/CustomComponents';
import { LayoutTemplate, AlertCircle } from 'lucide-react';

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

export default function DynamicPage() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'vi';
  const [pageData, setPageData] = useState<PageItem | null>(null);

  // Derive slug from pathname
  const rawSlug = location.pathname;

  useEffect(() => {
    const saved = localStorage.getItem('hexagon_cms_pages');
    if (saved) {
      try {
        const pages = JSON.parse(saved);
        if (Array.isArray(pages)) {
          // Find matching page with matching slug and language
          // Support both exact matching (e.g. /kiem-thu) and stripping language prefixes if any
          let matched = pages.find(p => p && p.slug === rawSlug && p.lang === currentLang && p.status === 'Đã xuất bản');
          
          if (!matched) {
            // Fallback: check if slug exists in any language as a fallback
            matched = pages.find(p => p && p.slug === rawSlug && p.status === 'Đã xuất bản');
          }

          if (matched) {
            setPageData(matched);
            if (i18n.language !== matched.lang) {
              i18n.changeLanguage(matched.lang);
            }
            // Set browser tab title dynamically from the SEO Title!
            document.title = matched.seoTitle || matched.title;
            return;
          }
        }
        setPageData(null);
      } catch (e) {
        console.error(e);
        setPageData(null);
      }
    } else {
      setPageData(null);
    }
  }, [rawSlug, currentLang]);

  if (pageData && pageData.content && Array.isArray(pageData.content.content)) {
    return (
      <main className="pt-20">
        <PageRenderer content={pageData.content.content} />
      </main>
    );
  }

  // Beautiful 404/Not Found state if page isn't in localStorage
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#135237]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trang chưa được thiết kế</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Đường dẫn <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">{rawSlug}</code> chưa được cấu hình hoặc xuất bản cho ngôn ngữ <strong>{currentLang.toUpperCase()}</strong> trong hệ thống quản lý giao diện.
        </p>
        <div className="flex flex-col gap-3">
          <Link 
            to="/admin" 
            className="w-full py-3 bg-[#135237] hover:bg-[#0f442d] text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <LayoutTemplate className="w-4 h-4" />
            Đến Admin thiết kế trang
          </Link>
          <Link 
            to="/" 
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors text-sm"
          >
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
