import React, { useEffect } from 'react';
import { Product, SiteSettings } from '../../types';

interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  product?: Product;
  settings?: SiteSettings | null;
}

export const SEOHead: React.FC<Props> = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  product,
  settings
}) => {
  const siteName = settings?.site_name || 'TechGear Studio';
  const defaultDesc = settings?.meta_description || 'TechGear Studio - Chuyên cung cấp Bàn phím cơ, Chuột Gaming, Tai nghe, Màn hình và Công cụ PC Builder chất lượng cao.';
  const defaultKeywords = settings?.meta_keywords || 'techgear, bàn phím cơ, chuột gaming, pc builder, tai nghe gaming, màn hình 144hz';

  const metaTitle = title ? `${title} | ${siteName}` : `${siteName} - Cửa Hàng Phụ Kiện Công Nghệ & PC Builder Enterprise`;
  const metaDescription = description || defaultDesc;
  const metaKeywords = keywords || defaultKeywords;
  const image = ogImage || product?.image || settings?.og_image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200';
  const url = canonicalUrl || window.location.href;

  useEffect(() => {
    // 1. Update Document Title
    document.title = metaTitle;

    // 2. Helper to set or update meta tag
    const updateMetaTag = (nameAttr: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    updateMetaTag('name', 'description', metaDescription);
    updateMetaTag('name', 'keywords', metaKeywords);

    // OpenGraph Meta
    updateMetaTag('property', 'og:title', metaTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', product ? 'product' : 'website');
    updateMetaTag('property', 'og:site_name', siteName);

    // Twitter Card Meta
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', metaTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', image);

    // 3. Inject Schema.org JSON-LD Structured Data
    const schemaId = 'techgear-json-ld';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const jsonLdData = product ? {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.name,
      'image': [product.image],
      'description': product.description || metaDescription,
      'sku': product.sku || `SKU-${product.id}`,
      'brand': {
        '@type': 'Brand',
        'name': 'TechGear'
      },
      'offers': {
        '@context': 'https://schema.org/',
        '@type': 'Offer',
        'priceCurrency': 'VND',
        'price': product.price,
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'url': url
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': siteName,
      'url': url,
      'logo': image,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': settings?.contact_phone || '1900-8888',
        'contactType': 'customer service'
      }
    };

    schemaScript.text = JSON.stringify(jsonLdData);

  }, [metaTitle, metaDescription, metaKeywords, image, url, product, siteName]);

  return null;
};
