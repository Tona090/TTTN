import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <section id="gioi-thieu" className="py-16 lg:py-24 bg-[#FFFFFF]">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="w-full h-full flex items-center justify-center order-2 md:order-1 relative">
            <div className="relative p-3 w-full">
              <div className="absolute -inset-4 bg-[#bcf0d4] rounded-2xl transform -rotate-2"></div>
              {/* Replace with placeholder or target image if accessible */}
              <img src="https://beta.hexagon.xyz/assets/images/VPX16.jpg" alt="Văn phòng Hexagon" className="relative rounded-lg shadow-2xl object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] w-full" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'; }} />
            </div>
            <div className="absolute -bottom-4 right-4 md:bottom-8 md:-right-8 bg-white p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-[280px] z-10 transition-transform hover:-translate-y-2 duration-300">
              <p className="text-sm md:text-base italic text-gray-900 font-medium leading-relaxed">{t('about.quote')}</p>
              <p className="text-yellow-500 text-xs mt-2 font-bold uppercase tracking-wider text-right">{t('about.quoteAuthor')}</p>
            </div>
          </div>
          <div className="text-left order-1 md:order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#044f40] mb-4 leading-tight">{t('about.title')}</h2>
            <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
              {t('about.desc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="bg-[#EBFAEA] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="flex items-baseline gap-0.5 text-3xl sm:text-4xl font-bold text-[#1D6A49] mb-2"><span>100</span><span>+</span></div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{t('about.stat1')}</p>
              </div>
              <div className="bg-[#EBFAEA] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="flex items-baseline gap-0.5 text-3xl sm:text-4xl font-bold text-[#1D6A49] mb-2"><span>30</span><span>+</span></div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{t('about.stat2')}</p>
              </div>
              <div className="bg-[#EBFAEA] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="flex items-baseline gap-0.5 text-3xl sm:text-4xl font-bold text-[#1D6A49] mb-2"><span>25</span><span>+</span></div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{t('about.stat3')}</p>
              </div>
              <div className="bg-[#EBFAEA] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="flex items-baseline gap-0.5 text-3xl sm:text-4xl font-bold text-[#1D6A49] mb-2"><span>24/7</span></div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{t('about.stat4')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
