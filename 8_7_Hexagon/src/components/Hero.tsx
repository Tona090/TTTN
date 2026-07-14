import TypeAnimation from './TypeAnimation';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="trang-chu" className="fullscreen-section relative isolate flex items-center pt-24 pb-12 overflow-hidden bg-gradient-to-br from-[#135237] via-[#196B49] to-[#41b67d] min-h-screen">
      <video autoPlay loop muted playsInline className="video-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.12 }}>
        <source src="https://beta.hexagon.xyz/assets/videos/hero-video-nenok.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-6 lg:pr-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#d97706] bg-transparent backdrop-blur-sm">
              <span className="text-[#f59e0b] text-sm font-bold tracking-wider uppercase">{t('hero.subtitle')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              <TypeAnimation sequence={[t('hero.type1'), t('hero.type2'), t('hero.type3'), t('hero.type4')]} />
              <br />
              <span className="inline-block mt-2" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a8e6d8 55%, #F7931E 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-xl">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <a href="#dich-vu" className="px-8 py-3.5 bg-[linear-gradient(to_right,#ff9902,#f2d337)] hover:brightness-110 !text-white rounded-lg transition-all shadow-lg text-center shadow-yellow-500/30">
                {t('hero.explore')}
              </a>
              <a href="#lien-he" className="px-8 py-3.5 bg-[#3B7B61]/30 hover:bg-[#3B7B61]/50 border border-white/20 !text-white rounded-lg transition-colors backdrop-blur-sm text-center">
                {t('hero.contact')}
              </a>
            </div>
          </div>
          <div className="relative w-full flex justify-center">
            <div className="relative w-full max-w-none aspect-square">
              <img src="https://metik.vn/wp-content/uploads/2026/06/globalmyc.webp" alt="Hexagon Global" className="w-full h-full object-contain" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex justify-center animate-bounce z-20">
        <a href="#gioi-thieu" className="text-gray-300 hover:text-white flex flex-col items-center gap-1 transition-colors">
          <span className="text-sm font-medium tracking-wide">{t('hero.scroll')}</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </a>
      </div>
    </section>
  );
}
