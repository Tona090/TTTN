import React from 'react';

interface TechGearLogoProps {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  className?: string;
}

export const TechGearLogo: React.FC<TechGearLogoProps> = ({
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  // Dimensions scaling
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[9.5px]', gap: 'gap-2.5' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-[11px]', gap: 'gap-3' },
    xl: { icon: 'w-20 h-20', text: 'text-4xl', sub: 'text-[13px]', gap: 'gap-4' },
    '2xl': { icon: 'w-28 h-28', text: 'text-5xl', sub: 'text-[15px]', gap: 'gap-5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Vector SVG of the exact TG Hexagon Brand Logo
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize.icon} shrink-0 drop-shadow-md select-none transition-transform hover:scale-105`}
    >
      {/* Outer Hexagon Frame - Split Orange/White Stroke */}
      {/* Orange Stroke Part (Left & Bottom) */}
      <path
        d="M 100 12 L 20 58 L 20 142 L 100 188"
        stroke="#F97316"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* White/Bright Stroke Part (Top & Right) */}
      <path
        d="M 100 12 L 180 58 L 180 142 L 100 188"
        stroke="#F8FAFC"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:stroke-white stroke-slate-800"
      />

      {/* Outer Accent Glow / Cut lines */}
      <path
        d="M 68 182 L 100 190 L 132 182"
        stroke="#F97316"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Monogram 'T' (Orange Geometric Shape) */}
      <path
        d="M 30 52 H 145 L 125 78 H 98 V 158 H 66 V 78 H 50 L 30 52 Z"
        fill="#F97316"
      />

      {/* Monogram 'G' (White Geometric Shape) */}
      <path
        d="M 102 78 L 165 78 L 165 106 H 126 L 106 132 H 165 V 158 H 92 L 134 104 H 102 V 78 Z"
        fill="#F8FAFC"
        className="dark:fill-white fill-slate-900"
      />

      {/* Inner Accent Notch */}
      <polygon points="126,106 165,106 142,132" fill="#F97316" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
      {/* Hexagon Monogram */}
      {LogoIcon}

      {/* Brand Name Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          {/* Main Brand Wordmark: TECH (Orange) GEAR (White/Dark) */}
          <div className={`font-black tracking-wider uppercase font-sans leading-none flex items-center ${currentSize.text}`}>
            <span className="text-orange-500 dark:text-orange-500 drop-shadow-xs">TECH</span>
            <span className="text-slate-900 dark:text-white drop-shadow-xs">GEAR</span>
          </div>

          {/* Subtitle / Tagline */}
          {showSubtitle && (
            <div
              className={`font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 leading-none ${currentSize.sub}`}
            >
              <span>PC GEAR</span>
              <span className="text-orange-500 font-black">•</span>
              <span>LAPTOP</span>
              <span className="text-orange-500 font-black">•</span>
              <span>GAMING</span>
              <span className="text-orange-500 font-black">•</span>
              <span>ACCESSORIES</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
