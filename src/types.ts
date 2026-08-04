export type Role = 'SuperAdmin' | 'Admin' | 'Editor' | 'User';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  sale_price: number | null;
  quantity: number;
  description: string;
  is_new: boolean;
  is_sale: boolean;
  is_best: boolean;
  specs?: Record<string, string>;
  sku?: string;
  variants?: { name: string; options: string[] }[];
  cost_price?: number;
}

export interface StockLogItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  type: 'in' | 'out' | 'adjust';
  quantity_change: number;
  new_quantity: number;
  note: string;
  created_at: string;
  created_by: string;
}

export interface AnalyticsReportData {
  timeRange: 'today' | '7days' | '30days' | 'thisMonth' | 'thisYear';
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueTrend: { date: string; revenue: number; profit: number; orders: number }[];
  topSellingProducts: { id: number; name: string; sku: string; category: string; soldCount: number; revenue: number }[];
  categoryBreakdown: { name: string; revenue: number; percentage: number }[];
  lowStockCount: number;
  outOfStockCount: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  status: 'active' | 'inactive';
}

export interface NewsArticle {
  id: number;
  title: string;
  image: string;
  content: string;
  excerpt: string;
  created_at: string;
  author?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  user_name: string;
  items: {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  created_at: string;
  shipping_address: string;
  phone: string;
  payment_method?: 'COD' | 'VIETQR' | 'MOMO';
  note?: string;
  voucher_code?: string;
  discount_amount?: number;
  cancel_reason?: string;
  cancelled_by?: 'customer' | 'admin';
}

export interface BrandSettings {
  store_name: string;
  brand_story: string;
  founder_message: string;
  brand_philosophy: string;
  homepage_heading: string;
  homepage_description: string;
  hardware_selection_rule: string;
  product_review_style: string;
  customer_promise: string;
  community_message: string;
}

export interface SiteSettings {
  logoText: string;
  logoUrl: string;
  primaryColor: string;
  showNewProducts: boolean;
  showBestProducts: boolean;
  showSaleProducts: boolean;
  showNewsSection: boolean;
  heroTitle: string;
  heroSubtitle: string;
  brandSettings?: BrandSettings;
  slogan?: string;
  founderName?: string;
  founderRole?: string;
  founderAvatar?: string;
  founderMessage?: string;
  founderCommitments?: string[];
  usps?: { id: string; icon: string; title: string; desc: string }[];
  hotline?: string;
  address?: string;
  email?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  vietqrTemplate?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
}

export interface StatsData {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categorySales: { name: string; value: number }[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified_buyer?: boolean;
}

export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  has_purchased?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
