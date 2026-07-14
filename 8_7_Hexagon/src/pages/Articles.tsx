import { Link } from 'react-router-dom';
import { mockArticles } from '../data/mockArticles';
import { useTranslation } from 'react-i18next';

export default function Articles() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb & Title */}
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-yellow-600 transition-colors">{t('articles.home')}</Link>
          <span>&gt;</span>
          <span className="text-gray-900">{t('articles.news')}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4 tracking-tight">{t('articles.title')}</h1>
        <p className="text-gray-600">{t('articles.desc')}</p>
        <div className="w-16 h-1 bg-yellow-400 mt-4 rounded-full"></div>
      </div>

      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockArticles.map((item) => (
                <Link to={`/vi/${item.category}/${item.slug}`} key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full w-max mb-3">
                      {item.categoryName}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {item.time}
                        </span>
                      </div>
                      <span className="text-yellow-600 text-xs font-semibold group-hover:underline">{t('articles.viewMore')} &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-[#1D6A49] text-white p-4 text-center font-bold text-lg tracking-wide uppercase">
                {t('articles.ourServices')}
              </div>
              <div className="p-6 relative">
                <div className="mb-4 h-40 bg-gray-100 rounded-lg overflow-hidden relative group">
                  <img src="https://beta.hexagon.xyz/dv01.svg" className="w-full h-full object-cover" alt="Service" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>
                  
                  {/* Controls */}
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">Giải pháp công nghệ</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Phát triển và triển khai các giải pháp phần mềm tùy chỉnh, tối ưu vận hành doanh nghiệp, nâng cao hiệu suất, đáp ứng linh hoạt theo nhu cầu và đìn...
                </p>
                <a href="#" className="text-yellow-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  {t('articles.learnMore')} &gt;
                </a>
                
                {/* Dots */}
                <div className="flex justify-center gap-1 mt-6 mb-4">
                  <span className="w-4 h-1.5 rounded-full bg-yellow-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                </div>
              </div>
              <div className="border-t border-gray-100 p-4 text-center">
                <a href="/#dich-vu" className="text-yellow-600 text-sm font-bold hover:underline">
                  {t('articles.viewAllServices')} &gt;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
