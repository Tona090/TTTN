import { Link } from 'react-router-dom';
import { mockArticles } from '../data/mockArticles';
import { useTranslation } from 'react-i18next';

export default function News() {
  const newsList = mockArticles.slice(0, 5);
  const { t } = useTranslation();

  return (
    <section id="tin-tuc" className="py-16 md:py-24 bg-white">
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#044f40] leading-tight">{t('news.title')}</h2>
          <p className="text-gray-700 mt-2 text-sm sm:text-base leading-relaxed px-4">
            {t('news.desc')}
          </p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {newsList.map((item, idx) => {
            const colSpanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
            
            return (
              <Link to={`/vi/${item.category}/${item.slug}`} key={idx} className={`${colSpanClass} group bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-yellow-400/50`}>
                <div className="overflow-hidden h-48 sm:h-52">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">{item.desc}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {item.date}
                      </span>
                    </div>
                    <span className="text-yellow-600 text-xs font-semibold group-hover:underline">
                      {t('services.viewDetail')} &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/vi/bai-viet" className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg bg-gradient-to-r from-[#008374] to-[#89BA16] hover:from-[#007164] hover:to-[#78A614] hover:ring-2 hover:ring-green-500 transition-all duration-200">
            {t('news.viewAll')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
