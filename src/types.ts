export type Role = 'SuperAdmin' | 'Admin' | 'Editor' | 'User';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
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

export interface ArticleComment {
  id: number;
  article_id: number;
  parent_id?: number | null;
  user_id?: number;
  user_name: string;
  avatar?: string;
  content: string;
  created_at: string;
  likes?: number;
  is_author?: boolean;
  replies?: ArticleComment[];
}

export interface NewsArticle {
  id: number;
  title: string;
  image: string;
  content: string;
  excerpt: string;
  created_at: string;
  author?: string;
  category?: string;
  views?: number;
  comments_count?: number;
  likes?: number;
  tags?: string[];
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
  email?: string;
  payment_method?: 'COD' | 'VIETQR' | 'MOMO' | 'VNPAY' | 'CARD' | 'INSTALLMENT' | string;
  payment_status?: 'unpaid' | 'pending_verification' | 'paid' | 'refunding';
  payment_receipt_url?: string;
  installment_months?: number;
  note?: string;
  voucher_code?: string;
  discount_amount?: number;
  cancel_reason?: string;
  cancelled_by?: 'customer' | 'admin';
  carrier?: string;
  tracking_code?: string;
  estimated_delivery?: string;
  rescheduled_info?: {
    date: string;
    time_slot: string;
    note?: string;
  };
  is_failed_attempt?: boolean;
}

export interface TrackingTimelineEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  status: 'completed' | 'current' | 'upcoming' | 'cancelled' | 'failed' | 'warning';
}

export interface TrackingInfo {
  order_id: number;
  status: Order['status'];
  is_failed_attempt?: boolean;
  failed_attempt_reason?: string;
  failed_attempt_count?: number;
  rescheduled_info?: {
    date: string;
    time_slot: string;
    note?: string;
  };
  carrier: string;
  tracking_code: string;
  estimated_delivery: string;
  estimated_delivery_range: string;
  progress_percent: number;
  current_step_index: number;
  shipper?: {
    name: string;
    phone: string;
    vehicle?: string;
    rating?: number;
  };
  timeline: TrackingTimelineEvent[];
}

export interface NotificationLog {
  id: number;
  order_id: number;
  type: 'email' | 'sms';
  recipient: string;
  subject?: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  trigger_reason: string;
  created_at: string;
  provider: string;
}

export interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  sms_brand_name: string;
  admin_copy_email: string;
  admin_copy_phone: string;
  notify_on_status_change: boolean;
  notify_on_new_order: boolean;
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
