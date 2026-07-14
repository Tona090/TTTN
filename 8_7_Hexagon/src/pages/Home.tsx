import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import News from '../components/News';
import Partners from '../components/Partners';
import Contact from '../components/Contact';
import PageRenderer from '../components/CustomComponents';

interface PageItem {
  id: string;
  title: string;
  seoTitle: string;
  slug: string;
  lang: 'vi' | 'en';
  status: 'Đã xuất bản' | 'Nháp';
  updatedAt: string;
  content: any;
}

export default function Home() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'vi';
  const [customPage, setCustomPage] = useState<PageItem | null>(null);

  useEffect(() => {
    // Read the published pages from localStorage to see if there is a customized Home page
    const saved = localStorage.getItem('hexagon_cms_pages');
    if (saved) {
      try {
        const pages = JSON.parse(saved);
        if (Array.isArray(pages)) {
          // Find the home page ('/') that matches the active language
          const matched = pages.find(p => p && p.slug === '/' && p.lang === currentLang && p.status === 'Đã xuất bản');
          if (matched) {
            setCustomPage(matched);
            return;
          }
        }
        setCustomPage(null);
      } catch (e) {
        console.error("Error reading custom pages from localStorage", e);
        setCustomPage(null);
      }
    } else {
      setCustomPage(null);
    }
  }, [currentLang]);

  // If a custom page has been built and published in the Admin CMS, render it dynamically!
  if (customPage && customPage.content && Array.isArray(customPage.content.content)) {
    return (
      <main className="pt-20">
        <PageRenderer content={customPage.content.content} />
      </main>
    );
  }

  // Fallback to default static home page elements if no custom CMS content is published yet
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <News />
      <Partners />
      <Contact />
    </main>
  );
}
