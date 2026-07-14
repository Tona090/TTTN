import React from 'react';
import { useTranslation as useOriginalTranslation } from 'react-i18next';
import { Link, useInRouterContext } from 'react-router-dom';
import TypeAnimation from './TypeAnimation';
import { mockArticles } from '../data/mockArticles';

export function useTranslation() {
  const result = useOriginalTranslation();
  const { i18n } = result;

  if (typeof window !== 'undefined') {
    const activeLang = (window as any).__HEXAGON_CMS_LANG__ || (window.parent && (window.parent as any).__HEXAGON_CMS_LANG__);
    if (activeLang && i18n.language !== activeLang) {
      i18n.changeLanguage(activeLang);
    }
  }

  return result;
}

export function SafeLink({ to, children, className, ...props }: any) {
  const inRouter = useInRouterContext();

  if (!to) {
    return <span className={className} {...props}>{children}</span>;
  }

  // If it's an anchor, mailto, tel, or external link, use a normal <a> tag
  if (to.startsWith('#') || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) {
    return <a href={to} className={className} {...props}>{children}</a>;
  }

  if (inRouter) {
    return <Link to={to} className={className} {...props}>{children}</Link>;
  } else {
    return <a href={to} className={className} {...props}>{children}</a>;
  }
}

export interface CustomProps {
  backgroundType?: 'color' | 'gradient' | 'image' | 'image+gradient' | 'image+color';
  bgColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: 'to right' | 'to left' | 'to bottom' | 'to bottom right' | 'to bottom left';
  backgroundImageUrl?: string;
  
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  
  animate?: 'on' | 'off';
  
  showButton?: 'on' | 'off';
  buttonText?: string;
  buttonLink?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export function getBackgroundStyle(props: CustomProps) {
  const type = props.backgroundType || 'color';
  const bg = props.bgColor || '';
  const g1 = props.gradientColor1 || '#135237';
  const g2 = props.gradientColor2 || '#0f442d';
  const dir = props.gradientDirection || 'to bottom';
  const img = props.backgroundImageUrl || '';

  let style: React.CSSProperties = {};

  if (type === 'color' && bg) {
    style.backgroundColor = bg;
    style.backgroundImage = 'none';
  } else if (type === 'gradient') {
    style.background = `linear-gradient(${dir}, ${g1}, ${g2})`;
  } else if (type === 'image' && img) {
    style.backgroundImage = `url(${img})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  } else if (type === 'image+gradient' && img) {
    style.backgroundImage = `linear-gradient(${dir}, ${g1}aa, ${g2}dd), url(${img})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  } else if (type === 'image+color' && img) {
    const solidBg = bg || '#135237';
    style.backgroundImage = `linear-gradient(${solidBg}aa, ${solidBg}f2), url(${img})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  return style;
}

export function HeroCustom(props: CustomProps) {
  const { t } = useTranslation();
  const title = props.title || t('hero.title');
  const desc = props.description || t('hero.desc');
  const animate = props.animate === 'on';
  
  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'gradient',
    bgColor: props.bgColor,
    gradientColor1: props.gradientColor1 || '#135237',
    gradientColor2: props.gradientColor2 || '#41b67d',
    gradientDirection: props.gradientDirection || 'to bottom right',
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : {};
  const descStyle: React.CSSProperties = props.descriptionColor ? { color: props.descriptionColor } : {};

  return (
    <section 
      id="trang-chu" 
      className={`fullscreen-section relative isolate flex items-center pt-24 pb-12 overflow-hidden min-h-screen transition-all duration-500`}
      style={bgStyle}
    >
      <video autoPlay loop muted playsInline className="video-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: props.backgroundType === 'image' ? 0 : 0.12 }}>
        <source src="https://beta.hexagon.xyz/assets/videos/hero-video-nenok.mp4" type="video/mp4" />
      </video>
      <div className={`container max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mt-16 ${animate ? 'animate-[pulse_4s_infinite]' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-6 lg:pr-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#d97706] bg-transparent backdrop-blur-sm">
              <span className="text-[#f59e0b] text-sm font-bold tracking-wider uppercase">{t('hero.subtitle')}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              <TypeAnimation sequence={[t('hero.type1'), t('hero.type2'), t('hero.type3'), t('hero.type4')]} />
              <br />
              <span className="inline-block mt-2" style={props.titleColor ? titleStyle : { background: 'linear-gradient(135deg, #ffffff 0%, #a8e6d8 55%, #F7931E 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                {title}
              </span>
            </h1>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-xl" style={descStyle}>
              {desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <a href="#dich-vu" className="px-8 py-3.5 bg-[linear-gradient(to_right,#ff9902,#f2d337)] hover:brightness-110 !text-white rounded-lg transition-all shadow-lg text-center shadow-yellow-500/30">
                {t('hero.explore')}
              </a>
              {props.showButton === 'on' && (
                <a 
                  href={props.buttonLink || "#lien-he"} 
                  className="px-8 py-3.5 border rounded-lg transition-colors backdrop-blur-sm text-center"
                  style={{
                    backgroundColor: props.buttonBgColor || 'rgba(59, 123, 97, 0.3)',
                    color: props.buttonTextColor || '#ffffff',
                    borderColor: props.buttonBgColor || 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {props.buttonText || t('hero.contact')}
                </a>
              )}
            </div>
          </div>
          <div className={`relative w-full flex justify-center ${animate ? 'hover:scale-105 transition-transform duration-500' : ''}`}>
            <div className="relative w-full max-w-none aspect-square">
              <img src="https://metik.vn/wp-content/uploads/2026/06/globalmyc.webp" alt="Hexagon Global" className="w-full h-full object-contain" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutCustom(props: CustomProps) {
  const { t } = useTranslation();
  const title = props.title || t('about.title');
  const desc = props.description || t('about.desc');
  const animate = props.animate === 'on';

  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'color',
    bgColor: props.bgColor || '#FFFFFF',
    gradientColor1: props.gradientColor1,
    gradientColor2: props.gradientColor2,
    gradientDirection: props.gradientDirection,
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : { color: '#044f40' };
  const descStyle: React.CSSProperties = props.descriptionColor ? { color: props.descriptionColor } : { color: '#374151' };

  return (
    <section id="gioi-thieu" className="py-16 lg:py-24" style={bgStyle}>
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="w-full h-full flex items-center justify-center order-2 md:order-1 relative">
            <div className={`relative p-3 w-full ${animate ? 'animate-bounce [animation-duration:10s]' : ''}`}>
              <div className="absolute -inset-4 bg-[#bcf0d4] rounded-2xl transform -rotate-2"></div>
              <img src="https://beta.hexagon.xyz/assets/images/VPX16.jpg" alt="Văn phòng Hexagon" className="relative rounded-lg shadow-2xl object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] w-full" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'; }} />
            </div>
            <div className="absolute -bottom-4 right-4 md:bottom-8 md:-right-8 bg-white p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-[280px] z-10 transition-transform hover:-translate-y-2 duration-300">
              <p className="text-sm md:text-base italic text-gray-900 font-medium leading-relaxed">{t('about.quote')}</p>
              <p className="text-yellow-500 text-xs mt-2 font-bold uppercase tracking-wider text-right">{t('about.quoteAuthor')}</p>
            </div>
          </div>
          <div className="text-left order-1 md:order-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight" style={titleStyle}>{title}</h2>
            <p className="mb-6 text-sm sm:text-base leading-relaxed" style={descStyle}>
              {desc}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              {[
                { count: '100+', label: t('about.stat1') },
                { count: '30+', label: t('about.stat2') },
                { count: '25+', label: t('about.stat3') },
                { count: '24/7', label: t('about.stat4') }
              ].map((stat, i) => (
                <div key={i} className="bg-[#EBFAEA] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                  <div className="flex items-baseline gap-0.5 text-3xl sm:text-4xl font-bold text-[#1D6A49] mb-2"><span>{stat.count}</span></div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>

            {props.showButton === 'on' && (
              <div className="mt-8">
                <a 
                  href={props.buttonLink || "#lien-he"} 
                  className="inline-block px-6 py-3 rounded-lg font-bold shadow-md hover:brightness-110 transition-all text-sm"
                  style={{
                    backgroundColor: props.buttonBgColor || '#1D6A49',
                    color: props.buttonTextColor || '#ffffff'
                  }}
                >
                  {props.buttonText || "Chi tiết"}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesCustom(props: CustomProps) {
  const { t } = useTranslation();
  const title = props.title || t('services.title');
  const desc = props.description || t('services.desc');
  const animate = props.animate === 'on';

  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'color',
    bgColor: props.bgColor || '#EBFAEA',
    gradientColor1: props.gradientColor1,
    gradientColor2: props.gradientColor2,
    gradientDirection: props.gradientDirection,
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : { color: '#044f40' };
  const descStyle: React.CSSProperties = props.descriptionColor ? { color: props.descriptionColor } : { color: '#374151' };

  const services = [
    { title: t('services.s1Title'), desc: t('services.s1Desc'), image: 'https://beta.hexagon.xyz/dv01.svg' },
    { title: t('services.s2Title'), desc: t('services.s2Desc'), image: 'https://beta.hexagon.xyz/dv01.svg' },
    { title: t('services.s3Title'), desc: t('services.s3Desc'), image: 'https://beta.hexagon.xyz/test.svg' },
    { title: t('services.s4Title'), desc: t('services.s4Desc'), image: 'https://beta.hexagon.xyz/test.svg' }
  ];

  return (
    <section id="dich-vu" className="py-12" style={bgStyle}>
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={titleStyle}>{title}</h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed px-4" style={descStyle}>
            {desc}
          </p>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 ${animate ? 'animate-[pulse_10s_infinite]' : ''}`}>
          {services.map((service, idx) => (
            <a href="#" key={idx} className="group relative block w-full h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-2 bg-[linear-gradient(180deg,#76B873_0%,#2F7D4A_50%,#055D00_100%)]">
              <img src={service.image} alt={service.title} className="absolute bottom-6 left-1/2 -translate-x-1/2 h-[300px] pt-20 w-auto max-w-[70%] object-contain" />
              <img src="https://beta-api.hexagon.xyz/uploads/hovermyc-1-1782467371060-195987948.png" alt="" aria-hidden="true" loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out [will-change:opacity] group-hover:opacity-100" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <div className="transform translate-y-0">
                  <h3 className="text-xl font-bold mb-0 group-hover:mb-3 transition-all duration-300 text-white group-hover:text-[#044f40]">{service.title}</h3>
                  <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                    <p className="text-gray-800 text-sm mb-4 line-clamp-3">{service.desc}</p>
                    <span className="inline-block text-blue-600 font-bold text-sm">{t('services.viewDetail')} &rarr;</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        {props.showButton === 'on' && (
          <div className="text-center mt-8">
            <a 
              href={props.buttonLink || "#"} 
              className="inline-block px-8 py-3 rounded-lg font-bold shadow-md hover:brightness-110 transition-all text-sm"
              style={{
                backgroundColor: props.buttonBgColor || '#2F7D4A',
                color: props.buttonTextColor || '#ffffff'
              }}
            >
              {props.buttonText || "Xem tất cả"}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export function NewsCustom(props: CustomProps) {
  const { t } = useTranslation();
  const newsList = mockArticles.slice(0, 5);
  const title = props.title || t('news.title');
  const desc = props.description || t('news.desc');
  const animate = props.animate === 'on';

  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'color',
    bgColor: props.bgColor || '#ffffff',
    gradientColor1: props.gradientColor1,
    gradientColor2: props.gradientColor2,
    gradientDirection: props.gradientDirection,
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : { color: '#044f40' };
  const descStyle: React.CSSProperties = props.descriptionColor ? { color: props.descriptionColor } : { color: '#374151' };

  return (
    <section id="tin-tuc" className="py-16 md:py-24" style={bgStyle}>
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={titleStyle}>{title}</h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed px-4" style={descStyle}>
            {desc}
          </p>
          <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 ${animate ? 'hover:scale-[1.01] transition-transform duration-700' : ''}`}>
          {newsList.map((item, idx) => {
            const colSpanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
            
            return (
              <SafeLink to={`/vi/${item.category}/${item.slug}`} key={idx} className={`${colSpanClass} group bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-yellow-400/50`}>
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
              </SafeLink>
            );
          })}
        </div>
        
        {(props.showButton === 'on' || !props.showButton) && (
          <div className="text-center mt-10">
            <SafeLink 
              to={props.buttonLink || "/vi/bai-viet"} 
              className="inline-flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg transition-all duration-200"
              style={{
                background: props.buttonBgColor ? props.buttonBgColor : 'linear-gradient(to right, #008374, #89BA16)',
                color: props.buttonTextColor || '#ffffff'
              }}
            >
              {props.buttonText || t('news.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </SafeLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function PartnersCustom(props: CustomProps) {
  const { t } = useTranslation();
  const title = props.title || t('partners.title');
  const animate = props.animate === 'on';

  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'color',
    bgColor: props.bgColor || '#EBFAEA',
    gradientColor1: props.gradientColor1,
    gradientColor2: props.gradientColor2,
    gradientDirection: props.gradientDirection,
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : { color: '#044f40' };

  const partners = [
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi E.png', alt: 'Logo Khối E' },
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi C.png', alt: 'Logo Khối C' },
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi D.png', alt: 'Logo Khối D' },
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/Happy Food.png', alt: 'Logo Happy Food' },
    { 
      type: 'svg', 
      content: (
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: 'block', margin: '0 auto 4px' }}>
            <path d="M 15 25 C 25 15, 38 15, 40 20 C 42 15, 55 15, 65 25 C 55 18, 42 18, 40 23 C 38 18, 25 18, 15 25 Z" fill="#22c55e"></path>
            <path d="M 18 18 C 26 10, 38 10, 40 15 C 42 10, 54 10, 62 18 C 54 12, 42 12, 40 17 C 38 12, 26 12, 18 18 Z" fill="#eab308"></path>
            <path d="M 22 11 C 28 5, 38 5, 40 10 C 42 5, 52 5, 58 11 C 52 7, 42 7, 40 12 C 38 7, 28 7, 22 11 Z" fill="#22c55e"></path>
          </svg>
          <div className="text-[11px] font-extrabold tracking-[0.08em] text-[#15803d]">ECOBOOK</div>
        </div>
      )
    },
    {
      type: 'svg',
      content: (
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: 'block', margin: '0 auto 4px' }}>
            <path d="M 20 12 C 30 5, 50 5, 60 12 C 55 18, 45 18, 40 18 C 35 18, 25 18, 20 12 Z" fill="#15803d"></path>
            <path d="M 22 17 C 30 11, 50 11, 58 17 C 53 23, 47 23, 40 23 C 33 23, 27 23, 22 17 Z" fill="#eab308"></path>
            <path d="M 25 22 C 32 17, 48 17, 55 22 C 50 30, 45 32, 40 32 C 35 32, 30 30, 25 22 Z" fill="#15803d"></path>
          </svg>
          <div className="text-[11px] font-extrabold tracking-[0.08em] text-[#15803d]">COMOON</div>
        </div>
      )
    },
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/B.png', alt: 'Binh Minh' },
    { type: 'img', src: 'https://webdemo.hexagon.xyz/medias/Logo Khoi F.png', alt: 'Logo Khối F' },
  ];

  return (
    <div className="py-12 text-center overflow-hidden relative z-10" style={bgStyle}>
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-5" style={titleStyle}>
          {title}
        </h2>
        <div className="group relative w-full overflow-hidden flex before:content-[''] before:absolute before:top-0 before:left-0 before:z-[2] before:pointer-events-none before:h-full before:w-[150px] before:bg-[linear-gradient(90deg,rgba(235,250,234,0.95)_0%,rgba(235,250,234,0)_100%)] after:content-[''] after:absolute after:top-0 after:right-0 after:z-[2] after:pointer-events-none after:h-full after:w-[150px] after:bg-[linear-gradient(270deg,rgba(235,250,234,0.95)_0%,rgba(235,250,234,0)_100%)]">
          <div className={`flex gap-6 w-max ${animate ? 'animate-pulse' : 'animate-marquee-scroll'} group-hover:[animation-play-state:paused]`}>
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl w-[180px] h-[108px] flex flex-col items-center justify-center p-4 shrink-0 shadow-[0_4px_12px_rgba(10,37,64,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,37,64,0.08)]"
              >
                {partner.type === 'img' ? (
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="max-h-16 max-w-[140px] object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  partner.content
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactCustom(props: CustomProps) {
  const { t } = useTranslation();
  const title = props.title || t('contact.title');
  const desc = props.description || t('contact.desc');
  const animate = props.animate === 'on';

  const bgStyle = getBackgroundStyle({
    backgroundType: props.backgroundType || 'color',
    bgColor: props.bgColor || 'rgb(248, 250, 252)',
    gradientColor1: props.gradientColor1,
    gradientColor2: props.gradientColor2,
    gradientDirection: props.gradientDirection,
    backgroundImageUrl: props.backgroundImageUrl,
  });

  const titleStyle: React.CSSProperties = props.titleColor ? { color: props.titleColor } : { color: '#044f40' };
  const descStyle: React.CSSProperties = props.descriptionColor ? { color: props.descriptionColor } : { color: '#374151' };

  return (
    <section id="lien-he" className="py-10 lg:py-24" style={{ ...bgStyle, scrollMarginTop: '72px' }}>
      <div className={`container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full ${animate ? 'animate-pulse' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col lg:mt-10 gap-6 text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={titleStyle}>{title}</h2>
              <p className="text-sm sm:text-base leading-relaxed" style={descStyle}>
                {desc}
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
                <iframe className="w-full h-full animate-[fadeIn_1.2s_ease-out]" src="https://maps.google.com/maps?width=600&height=400&hl=en&q=615%20%C3%82u%20C%C6%A1&t=p&z=14&ie=UTF8&iwloc=B&output=embed"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PageRenderer({ content }: { content: any }) {
  if (!content || !Array.isArray(content)) return null;

  return (
    <div>
      {content.map((block: any, idx: number) => {
        const type = block.type;
        const props = block.props || {};

        switch (type) {
          case 'Hero':
            return <HeroCustom key={block.id || idx} {...props} />;
          case 'About':
            return <AboutCustom key={block.id || idx} {...props} />;
          case 'Services':
            return <ServicesCustom key={block.id || idx} {...props} />;
          case 'News':
            return <NewsCustom key={block.id || idx} {...props} />;
          case 'Partners':
            return <PartnersCustom key={block.id || idx} {...props} />;
          case 'Contact':
            return <ContactCustom key={block.id || idx} {...props} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
