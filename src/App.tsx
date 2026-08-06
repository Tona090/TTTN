/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PdfAnalysisModal } from './components/PdfAnalysisModal';
import { RoadmapModal } from './components/RoadmapModal';
import { HomePage } from './components/Client/HomePage';
import { ProductList } from './components/Client/ProductList';
import { ProductDetailModal } from './components/Client/ProductDetailModal';
import { ProductDetailPage } from './components/Client/ProductDetailPage';
import { CartDrawer } from './components/Client/CartDrawer';
import { NewsList } from './components/Client/NewsList';
import { OrdersList } from './components/Client/OrdersList';
import { PcBuilder } from './components/Client/PcBuilder';
import { AuthPage } from './components/Client/AuthPage';
import { AIChatAssistant } from './components/Client/AIChatAssistant';
import { SEOHead } from './components/Client/SEOHead';

import { AdminLayout } from './components/Admin/AdminLayout';
import { Dashboard } from './components/Admin/Dashboard';
import { OrderManager } from './components/Admin/OrderManager';
import { InventoryManager } from './components/Admin/InventoryManager';
import { AnalyticsManager } from './components/Admin/AnalyticsManager';
import { ProductManager } from './components/Admin/ProductManager';
import { CategoryManager } from './components/Admin/CategoryManager';
import { BannerManager } from './components/Admin/BannerManager';
import { NewsManager } from './components/Admin/NewsManager';
import { UserManager } from './components/Admin/UserManager';
import { SiteSettingsManager } from './components/Admin/SiteSettingsManager';

import {
  fetchProducts,
  fetchCategories,
  fetchBanners,
  fetchNews,
  fetchSettings,
  getCurrentUser
} from './services/api';
import { Product, Category, Banner, NewsArticle, User, SiteSettings } from './types';
import { initialSettings } from './data/mockData';

export default function App() {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'client' | 'admin' | 'auth'>('client');
  const [clientTab, setClientTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('techgear_theme');
    if (saved !== null) return saved === 'dark';
    return false; // Default to bright, clean light theme
  });

  // Storefront Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);

  // Filtering & Selection State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false); // Open on demand via header link
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);

  // Load initial app state
  const loadInitialData = async () => {
    try {
      const u = await getCurrentUser();
      if (u) setUser(u);

      const [pRes, cRes, bRes, nRes, sRes] = await Promise.all([
        fetchProducts({ limit: 100 }),
        fetchCategories(),
        fetchBanners(),
        fetchNews(),
        fetchSettings()
      ]);

      setProducts(pRes.products);
      setCategories(cRes);
      setBanners(bRes);
      setNews(nRes);
      setSettings(sRes);
    } catch (err) {
      console.error('Error initializing app:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Sync Dark Mode class with <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('techgear_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('techgear_theme', 'light');
    }
  }, [darkMode]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: number, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setClientTab('product-detail');
  };

  const handleLogout = () => {
    localStorage.removeItem('techgear_token');
    setUser(null);
    setActiveView('client');
  };

  const handleNavigateTab = (tab: string, catId?: number) => {
    if (tab === 'auth') {
      setActiveView('auth');
      return;
    }
    if (tab === 'news') {
      setSelectedNewsArticle(null);
    }
    setClientTab(tab);
    if (activeView !== 'client') setActiveView('client');
    if (catId !== undefined) {
      setSelectedCategoryId(catId);
    } else {
      setSelectedCategoryId(undefined);
    }
  };

  const cartTotalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-orange-50/15 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <SEOHead 
        settings={settings} 
        product={clientTab === 'product-detail' ? (selectedProduct || undefined) : undefined} 
      />
      
      {activeView === 'auth' ? (
        /* Standalone Auth & Permissions Portal Page */
        <AuthPage
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          settings={settings}
          onBack={() => setActiveView('client')}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            loadInitialData();
            if (['SuperAdmin', 'Admin', 'Editor'].includes(loggedUser.role)) {
              setActiveView('admin');
            } else {
              setActiveView('client');
              setClientTab('home');
            }
          }}
          onNavigateTab={handleNavigateTab}
        />
      ) : activeView === 'client' ? (
        <div className="flex flex-col min-h-screen">
          
          {/* Main Top Header */}
          <Header
            user={user}
            cartCount={cartTotalCount}
            settings={settings}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            activeView={activeView}
            setActiveView={setActiveView}
            currentTab={clientTab}
            setCurrentTab={(tab) => handleNavigateTab(tab)}
            onOpenAuth={() => setActiveView('auth')}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
            onOpenRoadmapModal={() => setIsRoadmapModalOpen(true)}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            onSelectCategory={(catId) => {
              setSelectedCategoryId(catId);
              setClientTab('products');
            }}
          />

          {/* Client Content Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {clientTab === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                banners={banners}
                news={news}
                settings={settings}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onNavigateTab={handleNavigateTab}
                onSelectNews={(article) => {
                  setSelectedNewsArticle(article);
                  setClientTab('news');
                }}
              />
            )}

            {clientTab === 'products' && (
              <ProductList
                categories={categories}
                initialCategoryId={selectedCategoryId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
              />
            )}

            {clientTab === 'product-detail' && (
              <ProductDetailPage
                product={selectedProduct}
                onBack={() => {
                  setSelectedProduct(null);
                  setClientTab('products');
                }}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {clientTab === 'news' && (
              <NewsList
                news={news}
                selectedArticle={selectedNewsArticle}
                onSelectArticle={setSelectedNewsArticle}
              />
            )}

            {clientTab === 'orders' && (
              <OrdersList user={user} />
            )}

            {clientTab === 'pcbuilder' && (
              <PcBuilder onAddToCart={handleAddToCart} />
            )}
          </main>

          {/* Footer */}
          <Footer settings={settings} onNavigateTab={(tab) => handleNavigateTab(tab)} />

          {/* AI Advisor Chatbot Floating Widget */}
          <AIChatAssistant
            onAddToCart={handleAddToCart}
            onOpenProductDetail={(prod) => {
              setSelectedProduct(prod);
              setClientTab('product-detail');
            }}
          />

        </div>
      ) : (
        /* Admin View Portal */
        <AdminLayout
          user={user}
          activeTab={adminTab}
          setActiveTab={setAdminTab}
          onExitAdmin={() => {
            fetchSettings().then(setSettings).catch(console.error);
            setActiveView('client');
          }}
        >
          {adminTab === 'dashboard' && <Dashboard />}
          {adminTab === 'orders' && <OrderManager />}
          {adminTab === 'inventory' && <InventoryManager />}
          {adminTab === 'analytics' && <AnalyticsManager />}
          {adminTab === 'products' && <ProductManager />}
          {adminTab === 'categories' && <CategoryManager />}
          {adminTab === 'banners' && <BannerManager />}
          {adminTab === 'news' && <NewsManager />}
          {adminTab === 'users' && <UserManager currentUser={user} />}
          {adminTab === 'settings' && (
            <SiteSettingsManager
              onSettingsUpdated={(updated) => setSettings(updated)}
            />
          )}
        </AdminLayout>
      )}

      {/* Global Modals & Drawers */}
      <RoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
      />

      <PdfAnalysisModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          loadInitialData();
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        user={user}
        settings={settings}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setActiveView('auth');
        }}
      />

    </div>
  );
}
