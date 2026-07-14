import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isHome = location.pathname === '/';
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isVi = i18n.language === 'vi';
  const isEn = i18n.language === 'en';

  return (
    <header id="navbar" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1A6B49]">
      <nav className="mx-auto py-2 flex justify-between items-center" style={{ paddingInline: 'clamp(1.5rem, 5vw, 5rem)' }}>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16">
            <Link to="/" className="block h-full">
              <div className="w-full h-full flex items-center justify-center text-white">
                <img src="https://beta.hexagon.xyz/assets/images/logo-hhc.png" alt="Hexagon Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </Link>
          </div>
          <span className="text-xl font-bold text-white">HEXAGON</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {isHome ? (
            <>
              <a href="#trang-chu" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.home')}</a>
              <a href="#gioi-thieu" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.about')}</a>
              <a href="#dich-vu" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.services')}</a>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.home')}</Link>
              <Link to="/#gioi-thieu" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.about')}</Link>
              <Link to="/#dich-vu" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.services')}</Link>
            </>
          )}
          <Link to="/vi/bai-viet" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.news')}</Link>
          <a href="https://support.hexagon.xyz/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.support')}</a>
          {isHome ? (
            <a href="#lien-he" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.contact')}</a>
          ) : (
            <Link to="/#lien-he" className="text-gray-300 hover:text-yellow-500 transition">{t('nav.contact')}</Link>
          )}
          
          <div className="flex items-center gap-2 ml-4">
            <button type="button" title="Tiếng Việt" onClick={() => changeLanguage('vi')} style={{ opacity: isVi ? 1 : 0.45, transition: 'opacity 0.2s' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
                <defs><clipPath id="vn-a"><path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z"></path></clipPath></defs>
                <g fillRule="evenodd" clipPath="url(#vn-a)" transform="translate(80)scale(.9375)">
                  <path fill="#da251d" d="M-128 0h768v512h-768z"></path>
                  <path fill="#ff0" d="M349.6 381 260 314.3l-89 67.3L204 272l-89-67.7 110.1-1 34.2-109.4L294 203l110.1.1-88.5 68.4 33.9 109.6z"></path>
                </g>
              </svg>
            </button>
            <button type="button" title="English" onClick={() => changeLanguage('en')} style={{ opacity: isEn ? 1 : 0.45, transition: 'opacity 0.2s' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
                <path fill="#012169" d="M0 0h640v480H0z"></path>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"></path>
                <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"></path>
                <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"></path>
                <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden fixed top-20 left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-40 transition-all pb-4 py-2">
          {isHome ? (
            <>
              <a href="#trang-chu" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.home')}</a>
              <a href="#gioi-thieu" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.about')}</a>
              <a href="#dich-vu" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.services')}</a>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.home')}</Link>
              <Link to="/#gioi-thieu" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.about')}</Link>
              <Link to="/#dich-vu" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.services')}</Link>
            </>
          )}
          <Link to="/vi/bai-viet" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.news')}</Link>
          <a href="https://support.hexagon.xyz/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.support')}</a>
          {isHome ? (
            <a href="#lien-he" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.contact')}</a>
          ) : (
            <Link to="/#lien-he" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50">{t('nav.contact')}</Link>
          )}
          
          <div className="flex items-center gap-4 px-6 pt-4 mt-2 pb-2 border-t border-gray-100">
            <button type="button" title="Tiếng Việt" onClick={() => changeLanguage('vi')} style={{ opacity: isVi ? 1 : 0.45 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
                <defs><clipPath id="vn-a-mob"><path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z"></path></clipPath></defs>
                <g fillRule="evenodd" clipPath="url(#vn-a-mob)" transform="translate(80)scale(.9375)">
                  <path fill="#da251d" d="M-128 0h768v512h-768z"></path>
                  <path fill="#ff0" d="M349.6 381 260 314.3l-89 67.3L204 272l-89-67.7 110.1-1 34.2-109.4L294 203l110.1.1-88.5 68.4 33.9 109.6z"></path>
                </g>
              </svg>
            </button>
            <button type="button" title="English" onClick={() => changeLanguage('en')} style={{ opacity: isEn ? 1 : 0.45 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
                <path fill="#012169" d="M0 0h640v480H0z"></path>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"></path>
                <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"></path>
                <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"></path>
                <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
