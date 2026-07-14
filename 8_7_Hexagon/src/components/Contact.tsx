import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section id="lien-he" className="py-10 lg:py-24 bg-slate-50" style={{ scrollMarginTop: '72px' }}>
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col lg:mt-10 gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#044f40] mb-2">{t('contact.title')}</h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {t('contact.desc')}
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-500/10">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#044f40] text-sm">{t('contact.hq')}</p>
                  <p className="text-black text-sm">{t('contact.address')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-500/10">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#044f40] text-sm">Email</p>
                  <p className="text-black text-sm"><a href="mailto:info@hexagon.xyz">info@hexagon.xyz</a></p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-500/10">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#044f40] text-sm">Hotline</p>
                  <p className="text-black text-sm">096 446 0333</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold rounded-lg transition-all duration-300 border border-teal-500/30 hover:border-teal-500/50 text-sm shadow-sm">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold rounded-lg transition-all duration-300 border border-teal-500/30 hover:border-teal-500/50 text-sm shadow-sm">LinkedIn</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold rounded-lg transition-all duration-300 border border-teal-500/30 hover:border-teal-500/50 text-sm shadow-sm">YouTube</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold rounded-lg transition-all duration-300 border border-teal-500/30 hover:border-teal-500/50 text-sm shadow-sm">Zalo</a>
            </div>
          </div>
          <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div className="relative text-right w-full h-full">
              <div className="overflow-hidden bg-none w-full h-full">
                <iframe className="w-full h-full" src="https://maps.google.com/maps?width=600&height=400&hl=en&q=615%20%C3%82u%20C%C6%A1&t=p&z=14&ie=UTF8&iwloc=B&output=embed"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
