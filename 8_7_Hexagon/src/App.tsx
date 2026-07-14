import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';
import DynamicPage from './pages/DynamicPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vi/bai-viet" element={<Articles />} />
          <Route path="/vi/:category/:slug" element={<ArticleDetail />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/:slug" element={<DynamicPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
