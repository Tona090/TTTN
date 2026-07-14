import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full pb-3 bg-[#0D5939] border-t border-[#0D5939]">
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          {t('footer.copy')} <span className="text-gray-300 font-medium">Hexagon Corporation</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
