import { Link, useParams } from 'react-router-dom';
import { mockArticles } from '../data/mockArticles';
import { useTranslation } from 'react-i18next';

export default function ArticleDetail() {
  const { category, slug } = useParams();
  const { t } = useTranslation();
  
  // Find the article matching the slug
  const article = mockArticles.find(a => a.slug === slug) || mockArticles[0];

  return (
    <main className="min-h-screen bg-white">
      <div className="container max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-yellow-600 transition-colors">{t('articles.home')}</Link>
          <span>&gt;</span>
          <Link to="/vi/bai-viet" className="hover:text-yellow-600 transition-colors">{t('articles.articles')}</Link>
          <span>&gt;</span>
          <span className="capitalize hover:text-yellow-600 cursor-pointer">{article.categoryName}</span>
          <span>&gt;</span>
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </div>
        
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-6">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {article.time}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: article.content }}>
        </article>

        {/* Share Section */}
        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center gap-4">
          <span className="font-semibold text-gray-900">{t('articles.share')}</span>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
