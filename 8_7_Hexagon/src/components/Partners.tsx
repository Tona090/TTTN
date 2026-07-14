import { useTranslation } from 'react-i18next';

export default function Partners() {
  const { t } = useTranslation();
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
    <div className="bg-[#EBFAEA] py-12 text-center overflow-hidden relative z-10">
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#044f40] leading-tight mb-5">
          {t('partners.title')}
        </h2>
        <div className="group relative w-full overflow-hidden flex before:content-[''] before:absolute before:top-0 before:left-0 before:z-[2] before:pointer-events-none before:h-full before:w-[150px] before:bg-[linear-gradient(90deg,#EBFAEA_0%,rgba(235,250,234,0)_100%)] after:content-[''] after:absolute after:top-0 after:right-0 after:z-[2] after:pointer-events-none after:h-full after:w-[150px] after:bg-[linear-gradient(270deg,#EBFAEA_0%,rgba(235,250,234,0)_100%)]">
          <div className="flex gap-6 w-max animate-marquee-scroll group-hover:[animation-play-state:paused]">
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
