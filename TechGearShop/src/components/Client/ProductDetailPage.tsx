import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, 
  Sparkles, Star, ThumbsUp, MessageSquare, Clock, Cpu, Share2, 
  Heart, Zap, HelpCircle, CheckCircle2, ChevronRight, Layers, CreditCard,
  Maximize2, Plus, Minus, Sliders, Calculator, Copy, Tag, Eye, Info,
  CheckSquare, Square, Gift, PhoneCall, User as UserIcon
} from 'lucide-react';
import { User, Product, Review, ReviewSummary } from '../../types';
import { fetchProductById, fetchProductReviews, submitProductReview, deleteProductReview } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { ProductReviewCard } from './ProductReviewCard';

interface Props {
  product: Product | null;
  onBack: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onSelectProduct: (p: Product) => void;
  onOpenCart?: () => void;
  user?: User | null;
  onRequireAuth?: () => void;
}

export const ProductDetailPage: React.FC<Props> = ({
  product: initialProduct,
  onBack,
  onAddToCart,
  onSelectProduct,
  onOpenCart,
  user,
  onRequireAuth
}) => {
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'calculator' | 'reviews' | 'qa' | 'policy'>('overview');
  const [activeImage, setActiveImage] = useState<string>('');
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isCompared, setIsCompared] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Variant selector states
  const [selectedWattage, setSelectedWattage] = useState<string>('750W');
  const [selectedEdition, setSelectedEdition] = useState<string>('Standard Black');
  const [selectedProtectionPlan, setSelectedProtectionPlan] = useState<number>(0); // 0: none, 1: 2yr, 2: 3yr

  // Bundle Frequently Bought Together
  const [bundleAccessories, setBundleAccessories] = useState<{ [key: string]: boolean }>({
    accessory1: true,
    accessory2: false
  });

  // Wattage Calculator State (PC Builder Tool)
  const [calcCpu, setCalcCpu] = useState<string>('i9-14900K');
  const [calcGpu, setCalcGpu] = useState<string>('RTX 4090');

  const { lang, t } = useLanguage();

  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewSummary | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // Review submission state
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Q&A state
  const [qaSearch, setQaSearch] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [qaSubmitted, setQaSubmitted] = useState<boolean>(false);

  const topRef = useRef<HTMLDivElement>(null);

  const loadReviews = (productId: number) => {
    setLoadingReviews(true);
    fetchProductReviews(productId)
      .then(data => {
        setReviewsList(data.reviews || []);
        setReviewStats({
          average_rating: data.average_rating,
          total_reviews: data.total_reviews,
          rating_breakdown: data.rating_breakdown,
          has_purchased: data.has_purchased
        });
        setHasPurchased(!!data.has_purchased);
      })
      .catch(console.error)
      .finally(() => setLoadingReviews(false));
  };

  useEffect(() => {
    setProduct(initialProduct);
    setQuantity(1);
    if (initialProduct) {
      setActiveImage(initialProduct.image);
      fetchProductById(initialProduct.id)
        .then(data => {
          setProduct(data.product);
          setRelated(data.related);
        })
        .catch(console.error);

      loadReviews(initialProduct.id);
    }
  }, [initialProduct]);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm font-bold text-slate-500">Chưa chọn sản phẩm nào để xem chi tiết.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Cửa Hàng</span>
        </button>
      </div>
    );
  }

  // Category & Product Type Identification
  const nameLower = (product.name || '').toLowerCase();
  const categoryLower = (product.category_name || '').toLowerCase();
  const descLower = (product.description || '').toLowerCase();

  // Check if product is specifically a Power Supply Unit (PSU)
  const isPsu =
    categoryLower.includes('nguồn') ||
    categoryLower.includes('psu') ||
    categoryLower.includes('power supply') ||
    nameLower.includes('nguồn') ||
    nameLower.includes('psu') ||
    nameLower.includes('power supply') ||
    Boolean(product.specs?.['Wattage']) ||
    Boolean(product.specs?.['Công suất']);

  // Check if product is a PC Hardware Component (PSU, CPU, GPU/VGA, Mainboard, RAM, Cooler)
  const isHardware =
    isPsu ||
    categoryLower.includes('linh kiện') ||
    categoryLower.includes('hardware') ||
    categoryLower.includes('cpu') ||
    categoryLower.includes('vga') ||
    categoryLower.includes('card đồ họa') ||
    categoryLower.includes('mainboard') ||
    categoryLower.includes('bo mạch') ||
    categoryLower.includes('ram') ||
    categoryLower.includes('tản nhiệt') ||
    categoryLower.includes('ổ cứng') ||
    categoryLower.includes('ssd');

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const basePrice = product.sale_price ?? product.price;

  // Dynamic Protection Plan Costs
  const protectionCost = isPsu
    ? (selectedProtectionPlan === 1 ? 250000 : selectedProtectionPlan === 2 ? 450000 : 0)
    : (selectedProtectionPlan === 1 ? 150000 : selectedProtectionPlan === 2 ? 300000 : 0);

  // Dynamic Accessory Costs
  const bundleAcc1Price = isPsu ? 350000 : 150000;
  const bundleAcc2Price = 100000;
  const bundleCost = (bundleAccessories.accessory1 ? bundleAcc1Price : 0) + (bundleAccessories.accessory2 ? bundleAcc2Price : 0);

  const finalUnitPrice = basePrice + protectionCost;

  const discountPercent = product.sale_price
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAdd = (openCartAfter = false) => {
    onAddToCart({ ...product, price: finalUnitPrice }, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
    if (openCartAfter && onOpenCart) {
      onOpenCart();
    }
  };

  const handleSelectRelated = (p: Product) => {
    onSelectProduct(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert(lang === 'vi' ? 'Vui lòng đăng nhập để viết đánh giá sản phẩm!' : 'Please log in to write a review!');
      }
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewError(null);

    try {
      const res = await submitProductReview(product.id, {
        rating: userRating,
        comment: reviewComment,
        user_name: user.name || reviewAuthor
      });

      setReviewsList(res.summary.reviews || []);
      setReviewStats({
        average_rating: res.summary.average_rating,
        total_reviews: res.summary.total_reviews,
        rating_breakdown: res.summary.rating_breakdown,
        has_purchased: res.summary.has_purchased
      });
      setHasPurchased(!!res.summary.has_purchased);
      setReviewSubmitted(true);
      setReviewComment('');
      setReviewAuthor('');
      setTimeout(() => setReviewSubmitted(false), 5000);
    } catch (err: any) {
      setReviewError(err.message || 'Lỗi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!product) return;
    if (!confirm(lang === 'vi' ? 'Bạn có chắc chắn muốn xóa đánh giá này?' : 'Are you sure you want to delete this review?')) return;

    try {
      const res = await deleteProductReview(product.id, reviewId);
      setReviewsList(res.summary.reviews || []);
      setReviewStats({
        average_rating: res.summary.average_rating,
        total_reviews: res.summary.total_reviews,
        rating_breakdown: res.summary.rating_breakdown,
        has_purchased: res.summary.has_purchased
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa đánh giá');
    }
  };

  const handleAskQa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert(lang === 'vi' ? 'Vui lòng đăng nhập để đặt câu hỏi!' : 'Please log in to ask a question!');
      }
      return;
    }
    if (!newQuestion.trim()) return;
    setQaSubmitted(true);
    setTimeout(() => {
      setQaSubmitted(false);
      setNewQuestion('');
    }, 4000);
  };

  // Gallery images list: Use custom sub-images if set by admin, otherwise product.image
  const subList = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const galleryImages = [
    product.image,
    ...subList.filter(img => img !== product.image)
  ];

  // Wattage calculation estimation
  const cpuWatts = calcCpu === 'i9-14900K' ? 300 : calcCpu === 'i7-14700K' ? 220 : 120;
  const gpuWatts = calcGpu === 'RTX 4090' ? 450 : calcGpu === 'RTX 4080' ? 320 : 220;
  const totalEstWatts = cpuWatts + gpuWatts + 150;

  return (
    <div ref={topRef} className="space-y-8 pb-20 animate-fade-in text-xs">
      
      {/* Top Banner & Breadcrumb Navigation */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold overflow-x-auto">
          <button onClick={onBack} className="hover:text-orange-400 transition-colors">
            Trang Chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <button onClick={onBack} className="hover:text-orange-400 transition-colors">
            {product.category_name || 'Sản Phẩm Công Nghệ'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="font-extrabold text-orange-400 line-clamp-1">
            {product.name}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
            title="Chia sẻ sản phẩm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-orange-400" />}
            <span>{copiedLink ? 'Đã sao chép' : 'Chia sẻ'}</span>
          </button>

          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-lg transition-all shadow-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Main Product Feature Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Badges */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Showcase Image + Zoom Trigger */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-lg">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-red-600 text-white font-black text-[11px] rounded-lg shadow-md uppercase tracking-wider">
                  -{discountPercent}% OFF
                </span>
              )}
              {isPsu && (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  80 PLUS GOLD
                </span>
              )}
            </div>

            <div className="absolute top-3 right-3 flex items-center space-x-1.5">
              <button
                onClick={() => setIsZoomOpen(true)}
                className="p-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-white hover:text-orange-400 transition-colors shadow-md"
                title="Phóng to hình ảnh"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    if (onRequireAuth) {
                      onRequireAuth();
                    } else {
                      alert(lang === 'vi' ? 'Vui lòng đăng nhập để thêm sản phẩm vào yêu thích!' : 'Please log in to add to wishlist!');
                    }
                    return;
                  }
                  setIsWishlisted(!isWishlisted);
                }}
                className="p-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-white hover:text-red-500 transition-colors shadow-md"
                title="Thêm vào danh sách yêu thích"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-900/80 backdrop-blur-md rounded-xl text-slate-300 text-[10px] font-mono flex items-center justify-between border border-slate-800">
              <span>{isPsu ? 'Chuẩn PCIe 5.0 & ATX 3.0 Ready' : 'Cam kết chính hãng 100%'}</span>
              <span className="text-orange-400 font-bold">{isPsu ? '100% Japanese Capacitors' : 'Nguyên Seal Full Box'}</span>
            </div>
          </div>

          {/* Thumbnails Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all bg-slate-950 ${
                  activeImage === img
                    ? 'border-orange-500 ring-2 ring-orange-500/20 scale-95'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Trust Warranties */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <span className="font-extrabold block text-slate-900 dark:text-white">Bảo Hành Chính Hãng</span>
                <span className="text-[10px] text-slate-500">{isPsu ? '5 năm 1 đổi 1 tận nơi' : '24 tháng 1 đổi 1'}</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-extrabold block text-slate-900 dark:text-white">Giao Hàng Siêu Tốc</span>
                <span className="text-[10px] text-slate-500">Miễn phí giao hỏa tốc</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Title, Rating, Config Variants, Pricing & Buy Box */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Model & SKU Identifiers */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold rounded-md uppercase tracking-wider border border-orange-500/20">
                  {product.category_name || 'TECHGEAR OFFICIAL'}
                </span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 font-extrabold rounded-md border border-blue-500/20">
                  NEWEGG VERIFIED
                </span>
              </div>
              <div className="text-slate-400 font-mono space-x-3">
                <span>Model #: <strong className="text-slate-700 dark:text-slate-300">{product.specs?.['Model'] || `SKU-${product.id}`}</strong></span>
                <span>Item #: <strong className="text-slate-700 dark:text-slate-300">N82E{product.id.toString().padStart(6, '0')}</strong></span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Ratings, Stock & Comparison */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      className={`w-4 h-4 ${
                        st <= Math.round(reviewStats?.average_rating ?? 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-black text-slate-900 dark:text-white">
                  {reviewStats?.average_rating ?? 5.0} / 5.0
                </span>
                <a href="#reviews-section" onClick={() => setActiveTab('reviews')} className="text-blue-500 hover:underline font-bold">
                  ({reviewStats?.total_reviews ?? reviewsList.length} {lang === 'vi' ? 'đánh giá' : 'reviews'})
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsCompared(!isCompared)}
                  className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                    isCompared ? 'text-orange-500 font-extrabold' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isCompared ? '✓ Đã Thêm So Sánh' : 'So sánh sản phẩm'}</span>
                </button>
                <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Còn Hàng Sẵn Kho (Giao ngay)
                </span>
              </div>
            </div>

            {/* Variant Selectors (Only show Wattage selector if product is a PSU!) */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              {isPsu && (
                <div className="space-y-1.5">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                    Công Suất Nguồn (Wattage):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['650W', '750W', '850W', '1000W', '1250W (PCIE5)'].map(w => (
                      <button
                        key={w}
                        onClick={() => setSelectedWattage(w)}
                        className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                          selectedWattage === w
                            ? 'bg-orange-500 text-slate-950 shadow-md ring-2 ring-orange-500/30'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-400'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                  Phiên bản & Màu sắc:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Standard Black', 'White Edition', 'Cyberpunk Limited'].map(ed => (
                    <button
                      key={ed}
                      onClick={() => setSelectedEdition(ed)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        selectedEdition === ed
                          ? 'bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 font-extrabold shadow'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {ed}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  GIÁ KHUYẾN MÃI ĐẶC BIỆT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Đã bao gồm VAT 10%</span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono">
                  {formatVND(finalUnitPrice)}
                </span>
                {product.sale_price && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    {formatVND(product.price)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 text-xs font-black text-white bg-red-600 rounded-lg shadow-sm">
                    Tiết kiệm {formatVND((product.price - (product.sale_price ?? product.price)))}
                  </span>
                )}
              </div>
            </div>

            {/* Special Promotions Box (Phong Cách Xanh Style) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500/5 via-orange-500/5 to-amber-500/5 border-2 border-red-500/20 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-red-500/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-wide text-red-600 dark:text-red-400">
                    KHUYẾN MÃI & ƯU ĐÃI ĐẶC BIỆT
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Áp dụng hôm nay
                </span>
              </div>

              <ul className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">🎁</span>
                  <span><strong>Tặng kèm:</strong> Lót chuột Gaming TechGear Pad hoặc Grip Tape chính hãng khi mua.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 shrink-0 font-bold">🚚</span>
                  <span><strong>Giao hàng:</strong> Miễn phí giao hàng toàn quốc cho đơn từ 1.000.000đ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 shrink-0 font-bold">💳</span>
                  <span><strong>Trả góp:</strong> Hỗ trợ trả góp 0% qua thẻ tín dụng hoặc Kredivo / Fundiin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">🛡️</span>
                  <span><strong>Đổi trả:</strong> 1 đổi 1 trong 30 ngày đầu nếu phát sinh lỗi nhà sản xuất.</span>
                </li>
              </ul>
            </div>

            {/* Protection Plan Options */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                Gói Bảo Hành Mở Rộng VIP TechCare:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedProtectionPlan(0)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProtectionPlan === 0
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block font-bold">Không đăng ký</span>
                  <span className="text-[10px] opacity-75">{isPsu ? 'Bảo hành 5 năm tiêu chuẩn' : 'Bảo hành tiêu chuẩn'}</span>
                </button>

                <button
                  onClick={() => setSelectedProtectionPlan(1)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProtectionPlan === 1
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block font-bold">
                    {isPsu ? '+2 Năm Bảo Hành Nguồn (+250.000đ)' : '+1 Năm Bảo Hành Tiêu Chuẩn (+150.000đ)'}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {isPsu ? 'Đổi mới hư hại sụt áp / chập điện' : 'Đổi mới 1 đối 1 tận nơi'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedProtectionPlan(2)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedProtectionPlan === 2
                      ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="block font-bold">
                    {isPsu ? '+3 Năm Bảo Hành Toàn Diện (+450.000đ)' : '+2 Năm Bảo Hành VIP 1 Đổi 1 (+300.000đ)'}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {isPsu ? 'Bảo vệ cháy nổ toàn hệ thống PC' : 'Bảo vệ toàn diện sản phẩm'}
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Quantity & Buy Box Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Số lượng:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 font-black text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 font-black text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-slate-400 block text-[10px]">TỔNG CỘNG THANH TOÁN:</span>
                <strong className="text-lg font-black text-orange-500">{formatVND(finalUnitPrice * quantity)}</strong>
              </div>
            </div>

            {/* Primary Action Buttons (Phong Cách Xanh Style) */}
            <div className="space-y-2.5">
              <button
                onClick={() => handleAdd(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center border border-white/20 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Zap className="w-5 h-5 fill-white" />
                  <span>MUA NGAY - GIAO HÀNG TẬN NƠI</span>
                </div>
                <span className="text-[10px] font-medium opacity-90">Thanh toán COD khi nhận hàng hoặc qua Chuyển Khoản / QR Bank</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAdd(false)}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black rounded-xl shadow transition-all flex items-center justify-center gap-2 border border-slate-800"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ĐÃ THÊM VÀO GIỎ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      <span>THÊM VÀO GIỎ HÀNG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleAdd(true)}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow transition-all flex flex-col items-center justify-center"
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <CreditCard className="w-4 h-4" />
                    <span>MUA TRẢ GÓP 0%</span>
                  </div>
                  <span className="text-[9px] opacity-80">Qua Thẻ tín dụng / Fundiin / Kredivo</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Frequently Bought Together Bundle Deals */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          COMBO THƯỜNG ĐƯỢC MUA CÙNG (GÓI TIẾT KIỆM)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Item 1: Main Product */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-950">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1 block">{product.name}</span>
              <span className="font-mono font-extrabold text-orange-500 block">{formatVND(basePrice)}</span>
            </div>

            {/* Plus sign */}
            <div className="hidden md:flex justify-center text-slate-400">
              <Plus className="w-6 h-6" />
            </div>

            {/* Item 2: Custom Accessory depending on product category */}
            <div 
              onClick={() => setBundleAccessories(prev => ({ ...prev, accessory1: !prev.accessory1 }))}
              className={`p-3 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                bundleAccessories.accessory1 
                  ? 'bg-orange-500/10 border-orange-500 ring-1 ring-orange-500/30' 
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                {bundleAccessories.accessory1 ? <CheckSquare className="w-4 h-4 text-orange-500" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span className="text-[10px] font-bold text-orange-500 uppercase">Khuyến Mãi</span>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80" 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1 block">
                {isPsu ? 'Bộ Dây Nguồn Bọc Lưới Cao Cấp 16-Pin' : 'Gói Dịch Vụ Vệ Sinh & Bảo Hành Tận Nơi'}
              </span>
              <span className="font-mono font-extrabold text-slate-700 dark:text-slate-300 block">
                + {formatVND(bundleAcc1Price)}
              </span>
            </div>

          </div>

          {/* Bundle Summary & Add Button */}
          <div className="lg:col-span-4 p-5 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-800">
            <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">TỔNG GIÁ COMBO KÈM PHỤ KIỆN</span>
            <div className="space-y-1">
              <span className="text-2xl font-black font-mono text-orange-400 block">
                {formatVND(basePrice + bundleCost)}
              </span>
              <span className="text-[10px] text-slate-400 block">Tiết kiệm đáng kể khi mua nguyên combo</span>
            </div>
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                setAddedNotice(true);
                setTimeout(() => setAddedNotice(false), 2000);
              }}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>THÊM CẢ COMBO VÀO GIỎ</span>
            </button>
          </div>

        </div>
      </div>

      {/* Tabs Detailed Information Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-orange-500 text-orange-500 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mô Tả & Điểm Nổi Bật</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-orange-500 text-orange-500 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Bảng Thông Số Kỹ Thuật (Specs)</span>
          </button>

          {/* Render Calculator tab ONLY for PC Hardware components! */}
          {isHardware && (
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-4 font-black text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'border-orange-500 text-orange-500 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-orange-500" />
              <span>Công Cụ Tính Công Suất PC Builder</span>
            </button>
          )}

          <button
            id="reviews-section"
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-orange-500 text-orange-500 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>
              {lang === 'vi'
                ? `Đánh Giá Khách Hàng (${reviewStats?.total_reviews ?? reviewsList.length})`
                : `Customer Reviews (${reviewStats?.total_reviews ?? reviewsList.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'qa'
                ? 'border-orange-500 text-orange-500 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Hỏi Đáp Q&A (15)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 md:p-8 leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ProductReviewCard description={product.description} productName={product.name} />

              {/* Feature cards - adapted according to product type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                {isPsu ? (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Chuẩn ATX 3.0 & PCIe 5.0 Native</h4>
                      <p className="text-[11px] text-slate-500">
                        Trang bị cổng cắm 12VHPWR 16-pin chịu tải dòng điện tức thời lên tới 600W dành cho card đồ họa NVIDIA RTX thế hệ mới.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Hiệu Suất 80 PLUS Gold</h4>
                      <p className="text-[11px] text-slate-500">
                        Hiệu suất chuyển đổi năng lượng lên đến 90%, giảm thiểu hiện tượng thất thoát nhiệt và tiết kiệm điện năng tiêu thụ.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Full Modular 100% Dây Rời</h4>
                      <p className="text-[11px] text-slate-500">
                        Dây cáp thiết kế phẳng siêu mềm, giúp góc setup PC cực kỳ gọn gàng, hỗ trợ đi dây thông thoáng nâng cao khả năng tản nhiệt.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Thiết Kế & Hoàn Thiện Cao Cấp</h4>
                      <p className="text-[11px] text-slate-500">
                        Gia công tỉ mỉ từ vật liệu bền bỉ, tính thẩm mỹ vượt trội mang lại trải nghiệm sử dụng đẳng cấp và tinh tế.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Tối Ưu Hiệu Năng & Trải Nghiệm</h4>
                      <p className="text-[11px] text-slate-500">
                        Đáp ứng xuất sắc nhu cầu làm việc, học tập và giải trí với độ ổn định cao và khả năng phản hồi tức thì.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">Bảo Hành Chính Hãng VIP</h4>
                      <p className="text-[11px] text-slate-500">
                        Sản phẩm chính hãng 100% fullbox nguyên seal, hỗ trợ kỹ thuật và đổi mới nhanh chóng trong suốt thời gian bảo hành.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                THÔNG SỐ KỸ THUẬT CHI TIẾT (FULL TECHNICAL SPECIFICATIONS)
              </h3>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white">
                  <span>Thông số</span>
                  <span className="col-span-2">Chi tiết</span>
                </div>

                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <span className="font-semibold text-slate-500">{key}</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{val}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-slate-500">Danh mục sản phẩm</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{product.category_name || 'Hàng chính hãng'}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-slate-500">Thương hiệu / Xuất xứ</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">TechGear Official Partner</span>
                    </div>
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-slate-500">Tình trạng sản phẩm</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">Mới 100% Nguyên Seal Fullbox</span>
                    </div>
                    {isPsu && (
                      <>
                        <div className="grid grid-cols-3 p-3">
                          <span className="font-semibold text-slate-500">Hiệu suất chứng nhận</span>
                          <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">80 PLUS Gold Certified</span>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <span className="font-semibold text-slate-500">Cổng 12VHPWR (PCIe 5.0)</span>
                          <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">1x 16-pin (Native 600W)</span>
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-slate-500">Thời hạn bảo hành</span>
                      <span className="col-span-2 font-bold text-slate-900 dark:text-slate-100">{isPsu ? '5 Năm (1 đổi 1 chính hãng)' : '24 Tháng chính hãng'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Interactive PC Builder Wattage Calculator (ONLY for hardware) */}
          {activeTab === 'calculator' && isHardware && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  CÔNG CỤ KIỂM TRA TÍNH TƯƠNG THÍCH & CÔNG SUẤT BỘ NGUỒN PC
                </span>
                <p className="text-[11px] text-slate-300">
                  Lựa chọn vi xử lý (CPU) và card đồ họa (GPU) của bạn để tính toán tổng lượng điện năng tiêu thụ và xác định bộ nguồn lý tưởng.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 dark:text-white block">Chọn Vi Xử Lý (CPU):</label>
                    <select
                      value={calcCpu}
                      onChange={(e) => setCalcCpu(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    >
                      <option value="i9-14900K">Intel Core i9-14900K / 13900KS (~300W Peak)</option>
                      <option value="i7-14700K">Intel Core i7-14700K / AMD Ryzen 9 7950X3D (~220W)</option>
                      <option value="i5-14600K">Intel Core i5-14600K / AMD Ryzen 7 7800X3D (~120W)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-900 dark:text-white block">Chọn Card Đồ Họa (GPU):</label>
                    <select
                      value={calcGpu}
                      onChange={(e) => setCalcGpu(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    >
                      <option value="RTX 4090">NVIDIA GeForce RTX 4090 24GB (~450W Peak)</option>
                      <option value="RTX 4080">NVIDIA GeForce RTX 4080 Super / RX 7900 XTX (~320W)</option>
                      <option value="RTX 4070">NVIDIA GeForce RTX 4070 Ti Super (~220W)</option>
                    </select>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ƯỚC TÍNH TẢI ĐIỆN NĂNG HỆ THỐNG</span>
                    <span className="text-3xl font-black text-orange-500 font-mono block mt-1">
                      ~ {totalEstWatts} Watts
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Bao gồm CPU, GPU, 64GB RAM, 2x NVMe SSD và hệ thống fan tản nhiệt.
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Linh kiện {product.name} phù hợp tuyệt đối cho cấu hình này!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Summary Header Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left space-y-1">
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                      {reviewStats?.average_rating ?? 5.0}
                    </span>
                    <span className="text-slate-400 font-bold text-sm">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-1 text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(reviewStats?.average_rating ?? 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {lang === 'vi'
                      ? `${reviewStats?.total_reviews ?? reviewsList.length} đánh giá thực tế từ người dùng`
                      : `${reviewStats?.total_reviews ?? reviewsList.length} verified reviews from users`}
                  </span>

                  {hasPurchased && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Bạn đã mua sản phẩm này!' : 'You purchased this product!'}</span>
                    </div>
                  )}
                </div>

                {/* Star Breakdown Progress Bars */}
                <div className="w-full md:w-72 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats?.rating_breakdown?.[star as keyof typeof reviewStats.rating_breakdown] || 0;
                    const total = reviewStats?.total_reviews || 1;
                    const pct = Math.round((count / (total || 1)) * 100);
                    return (
                      <div
                        key={star}
                        onClick={() => setStarFilter(starFilter === star ? 'all' : star)}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <span className="w-10 font-bold text-slate-600 dark:text-slate-400">{star} ★</span>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right font-mono text-slate-500 text-[11px]">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 mr-2">
                  {lang === 'vi' ? 'Lọc theo đánh giá:' : 'Filter by rating:'}
                </span>
                <button
                  onClick={() => setStarFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    starFilter === 'all'
                      ? 'bg-orange-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lang === 'vi' ? 'Tất cả' : 'All'} ({reviewsList.length})
                </button>
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = reviewsList.filter(r => Math.round(r.rating) === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setStarFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        starFilter === s
                          ? 'bg-orange-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{s}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {loadingReviews ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-bold animate-pulse">
                    {lang === 'vi' ? 'Đang tải đánh giá sản phẩm...' : 'Loading reviews...'}
                  </div>
                ) : reviewsList.filter(r => starFilter === 'all' || Math.round(r.rating) === starFilter).length === 0 ? (
                  <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-bold text-slate-500">
                      {lang === 'vi' ? 'Chưa có nhận xét nào phù hợp bộ lọc này.' : 'No reviews match this filter.'}
                    </p>
                  </div>
                ) : (
                  reviewsList
                    .filter(r => starFilter === 'all' || Math.round(r.rating) === starFilter)
                    .map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xs shadow-inner">
                              {rev.user_name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                  {rev.user_name}
                                </span>
                                {rev.is_verified_buyer && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {lang === 'vi' ? 'Đã mua hàng' : 'Verified Buyer'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center text-amber-400">
                                  {[1, 2, 3, 4, 5].map((st) => (
                                    <Star
                                      key={st}
                                      className={`w-3.5 h-3.5 ${
                                        st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">{rev.created_at}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                            title={lang === 'vi' ? 'Xóa nhận xét' : 'Delete review'}
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                )}
              </div>

              {/* Write Review Form */}
              {!user ? (
                <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-sm">
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-orange-500" />
                      <span>{lang === 'vi' ? 'Đăng nhập để viết đánh giá sản phẩm' : 'Log in to write a review'}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {lang === 'vi'
                        ? 'Bạn cần đăng nhập để chia sẻ đánh giá & trải nghiệm dùng sản phẩm.'
                        : 'You need an account to write and share product reviews.'}
                    </p>
                  </div>
                  <button
                    onClick={() => onRequireAuth ? onRequireAuth() : alert('Vui lòng đăng nhập!')}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0"
                  >
                    {lang === 'vi' ? 'Đăng Nhập Ngay' : 'Log In Now'}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleAddReview}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>{lang === 'vi' ? 'Gửi Đánh Giá & Nhận Xét Của Bạn' : 'Write Your Review & Rating'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'vi' ? 'Trải nghiệm thực tế của bạn giúp cộng đồng chọn mua tốt hơn' : 'Your honest feedback helps the community'}
                  </span>
                </div>

                {reviewSubmitted && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl flex items-center gap-2 text-xs animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>
                      {lang === 'vi'
                        ? 'Cảm ơn bạn! Đánh giá sản phẩm đã được gửi và cập nhật thành công.'
                        : 'Thank you! Your product review has been submitted successfully.'}
                    </span>
                  </div>
                )}

                {reviewError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold rounded-xl text-xs">
                    {reviewError}
                  </div>
                )}

                {/* Interactive Star Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'vi' ? 'Đánh giá điểm số (*):' : 'Select Rating (*):'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          className="p-1 focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              star <= (hoverRating || userRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {userRating === 5 && (lang === 'vi' ? '5 ★★★★★ Rất tuyệt vời!' : '5 ★★★★★ Excellent!')}
                      {userRating === 4 && (lang === 'vi' ? '4 ★★★★☆ Hài lòng / Tốt' : '4 ★★★★☆ Good')}
                      {userRating === 3 && (lang === 'vi' ? '3 ★★★☆☆ Bình thường' : '3 ★★★☆☆ Average')}
                      {userRating === 2 && (lang === 'vi' ? '2 ★★☆☆☆ Tạm được' : '2 ★★☆☆☆ Fair')}
                      {userRating === 1 && (lang === 'vi' ? '1 ★☆☆☆☆ Không hài lòng' : '1 ★☆☆☆☆ Poor')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'vi' ? 'Tên hiển thị của bạn:' : 'Your display name:'}
                    </label>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder={lang === 'vi' ? 'Nhập tên của bạn (hoặc để trống)...' : 'Your name (optional)...'}
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'vi' ? 'Nội dung đánh giá & nhận xét (*):' : 'Review details (*):'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={
                      lang === 'vi'
                        ? 'Hãy chia sẻ cảm nhận thực tế về chất lượng, đóng gói, trải nghiệm sử dụng...'
                        : 'Share your genuine experience regarding quality, packaging, performance...'
                    }
                    className="w-full p-3 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>
                    {submittingReview
                      ? (lang === 'vi' ? 'Đang gửi...' : 'Submitting...')
                      : (lang === 'vi' ? 'GỬI ĐÁNH GIÁ SẢN PHẨM' : 'SUBMIT PRODUCT REVIEW')}
                  </span>
                </button>
              </form>
              )}

            </div>
          )}

          {/* Tab 5: Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white">Hỏi Đáp Từ Cộng Đồng & Chuyên Gia</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={qaSearch}
                    onChange={(e) => setQaSearch(e.target.value)}
                    placeholder="Tìm kiếm câu hỏi (ví dụ: bảo hành, tương thích...)"
                    className="w-full p-2.5 pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    Q: Sản phẩm này có đi kèm đẩy đủ phụ kiện nguyên seal không?
                  </span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 font-medium">
                    <strong className="text-orange-500">A (TechGear Specialist):</strong> Chào bạn, toàn bộ sản phẩm tại TechGear đều là hàng nhập khẩu chính hãng mới 100% fullbox nguyên tem niêm phong nhà sản xuất nhé!
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    Q: Thời gian bảo hành xử lý mất bao lâu nếu có sự cố?
                  </span>
                  <p className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 font-medium">
                    <strong className="text-orange-500">A (TechGear Specialist):</strong> TechGear cam kết hỗ trợ tiếp nhận & bảo hành 1 đổi 1 nhanh chóng trong vòng 24h đối với lỗi nhà sản xuất.
                  </p>
                </div>
              </div>

              {/* Submit Question */}
              {!user ? (
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-slate-800 dark:text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-orange-500 shrink-0" />
                    <span>Bạn cần <strong>Đăng Nhập</strong> để đặt câu hỏi cho kỹ thuật viên.</span>
                  </div>
                  <button
                    onClick={() => onRequireAuth ? onRequireAuth() : alert('Vui lòng đăng nhập!')}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl shadow-md transition-all shrink-0"
                  >
                    Đăng Nhập Ngay
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAskQa} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Đặt Câu Hỏi Cho Kỹ Thuật Viên</h4>
                  {qaSubmitted && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Câu hỏi của bạn đã được gửi. Kỹ thuật viên sẽ phản hồi trong 15 phút!</span>
                    </div>
                  )}
                  <input
                    type="text"
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Nhập thắc mắc của bạn về sản phẩm này..."
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-black rounded-xl transition-colors"
                  >
                    GỬI CÂU HỎI
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            SẢN PHẨM CÙNG DANH MỤC THAM KHẢO THÊM
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map(rel => (
              <div
                key={rel.id}
                onClick={() => handleSelectRelated(rel)}
                className="group cursor-pointer p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 mb-2">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {rel.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-mono font-extrabold text-xs text-orange-600 dark:text-orange-400">
                    {formatVND(rel.sale_price ?? rel.price)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-500 transition-colors">
                    Xem ngay →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-white pb-2 border-b border-slate-800">
              <span className="font-bold">{product.name}</span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg"
              >
                Đóng (X)
              </button>
            </div>
            <div className="aspect-square max-h-[70vh] mx-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={activeImage || product.image} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Quick Buy (Phong Cách Xanh Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img src={activeImage || product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800" />
            <div className="truncate">
              <h4 className="font-extrabold text-xs text-white truncate">{product.name}</h4>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-orange-400 font-bold">{formatVND(finalUnitPrice)}</span>
                {product.sale_price && <span className="text-slate-500 line-through text-[10px]">{formatVND(product.price)}</span>}
                <span className="text-emerald-400 font-bold text-[10px] hidden sm:inline">✓ Còn Hàng</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleAdd(false)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Thêm Giỏ Hàng</span>
            </button>
            <button
              onClick={() => handleAdd(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>MUA NGAY</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
