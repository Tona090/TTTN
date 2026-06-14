import React from 'react';

// Hero component — banner với title, subtitle, buttons.
const AdminHero = ({ title, subtitle, buttons = [], background = {}, layout = {} }) => {
  const alignClass = layout.align === 'left' ? 'text-left' : layout.align === 'right' ? 'text-right' : 'text-center';
  const alignFlex = layout.align === 'left' ? 'justify-start' : layout.align === 'right' ? 'justify-end' : 'justify-center';
  const alignItems = layout.align === 'left' ? 'items-start' : layout.align === 'right' ? 'items-end' : 'items-center';

  const getBackgroundStyle = () => {
    const bg = background || {};
    if (bg.type === 'gradient') {
      return { background: `linear-gradient(${bg.gradientDirection || 'to bottom right'}, ${bg.gradientFrom || '#667eea'}, ${bg.gradientTo || '#764ba2'})` };
    }
    if (bg.type === 'image' && bg.imageUrl) {
      return { backgroundImage: `url('${bg.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { backgroundColor: bg.color || '#ffffff' };
  };

  const getButtonClass = (style) => {
    const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all';
    switch (style) {
      case 'primary': return `${base} bg-blue-600 text-white hover:bg-blue-700`;
      case 'outline': return `${base} border-2 border-white text-white hover:bg-white hover:text-gray-900`;
      default: return `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`;
    }
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden" style={getBackgroundStyle()}>
      <div className={`relative mx-auto max-w-7xl ${alignClass} flex flex-col ${alignItems}`}>
        {title && <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{title}</h1>}
        {subtitle && <p className="text-lg md:text-xl mb-6 opacity-90 text-white max-w-3xl">{subtitle}</p>}
        {buttons && buttons.length > 0 && (
          <div className={`flex flex-wrap ${alignFlex} gap-4 mb-8`}>
            {buttons.map((btn, idx) => (
              <a key={idx} href={btn.url || '#'} className={getButtonClass(btn.style || 'primary')}>
                {btn.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminHero;
