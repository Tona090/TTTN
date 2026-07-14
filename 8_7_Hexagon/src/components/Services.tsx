import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();
  const services = [
    { 
      title: t('services.s1Title'), 
      desc: t('services.s1Desc'),
      image: 'https://beta.hexagon.xyz/dv01.svg',
    },
    { 
      title: t('services.s2Title'), 
      desc: t('services.s2Desc'),
      image: 'https://beta.hexagon.xyz/dv01.svg',
    },
    { 
      title: t('services.s3Title'), 
      desc: t('services.s3Desc'),
      image: 'https://beta.hexagon.xyz/test.svg',
    },
    { 
      title: t('services.s4Title'), 
      desc: t('services.s4Desc'),
      image: 'https://beta.hexagon.xyz/test.svg',
    }
  ];

  return (
    <section id="dich-vu" className="py-12 bg-[#EBFAEA]">
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#044f40] leading-tight">{t('services.title')}</h2>
          <p className="text-gray-700 mt-2 text-sm sm:text-base leading-relaxed px-4">
            {t('services.desc')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
      </div>
    </section>
  );
}
