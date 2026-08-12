import {
  Product,
  Category,
  Banner,
  NewsArticle,
  User,
  Order,
  SiteSettings,
  StatsData,
  AuthResponse,
  Review,
  ReviewSummary,
  StockLogItem,
  AnalyticsReportData,
  TrackingInfo,
  NotificationLog,
  NotificationSettings
} from '../types';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('techgear_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export async function fetchProducts(params: Record<string, string | number | boolean> = {}): Promise<{
  products: Product[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, String(v));
    }
  });

  const res = await fetch(`/api/products?${query.toString()}`);
  if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
  return res.json();
}

export async function fetchProductById(id: number): Promise<{ product: Product; related: Product[] }> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
  return res.json();
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi thêm sản phẩm');
  }
  return res.json();
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi cập nhật sản phẩm');
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi xóa sản phẩm');
  }
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Lỗi tải danh mục');
  return res.json();
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo danh mục');
  return res.json();
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật danh mục');
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Lỗi xóa danh mục');
}

// Banners
export async function fetchBanners(): Promise<Banner[]> {
  const res = await fetch('/api/banners');
  if (!res.ok) throw new Error('Lỗi tải banner');
  return res.json();
}

export async function createBanner(data: Partial<Banner>): Promise<Banner> {
  const res = await fetch('/api/banners', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi tạo banner');
  return res.json();
}

export async function updateBanner(id: number, data: Partial<Banner>): Promise<Banner> {
  const res = await fetch(`/api/banners/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi cập nhật banner');
  return res.json();
}

export async function deleteBanner(id: number): Promise<void> {
  const res = await fetch(`/api/banners/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi xóa banner');
}

// News
export async function fetchNews(): Promise<NewsArticle[]> {
  const res = await fetch('/api/news');
  if (!res.ok) throw new Error('Lỗi tải tin tức');
  return res.json();
}

export async function createNews(data: Partial<NewsArticle>): Promise<NewsArticle> {
  const res = await fetch('/api/news', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi thêm bài viết');
  return res.json();
}

export async function updateNews(id: number, data: Partial<NewsArticle>): Promise<NewsArticle> {
  const res = await fetch(`/api/news/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi sửa bài viết');
  return res.json();
}

export async function deleteNews(id: number): Promise<void> {
  const res = await fetch(`/api/news/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi xóa bài viết');
}

// Users
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải danh sách tài khoản');
  return res.json();
}

export async function createUser(data: Record<string, string>): Promise<User> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi tạo người dùng');
  }
  return res.json();
}

export async function updateUser(id: number, data: Record<string, string>): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi cập nhật người dùng');
  }
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi xóa người dùng');
  }
}

// Auth
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Đăng nhập thất bại');
  }
  return res.json();
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Đăng ký thất bại');
  }
  return res.json();
}

export async function socialLoginUser(provider: 'google' | 'facebook', email?: string, name?: string): Promise<AuthResponse> {
  const res = await fetch('/api/auth/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider, email, name })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Đăng nhập mạng xã hội thất bại');
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('techgear_token');
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', { headers: getAuthHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

// Settings & Stats & Orders
export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Lỗi tải cài đặt');
  return res.json();
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Lỗi lưu cấu hình');
  return res.json();
}

export async function fetchStats(): Promise<StatsData> {
  const res = await fetch('/api/stats', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải thống kê');
  return res.json();
}

export async function createOrder(orderData: {
  items: Array<{ product_id: number; name: string; price: number; quantity: number; image: string }>;
  total_amount: number;
  shipping_address: string;
  phone: string;
  email?: string;
  user_name: string;
  payment_method?: string;
  installment_months?: number;
  note?: string;
  voucher_code?: string;
  discount_amount?: number;
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Lỗi đặt hàng');
  return res.json();
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch('/api/orders', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải danh sách đơn hàng');
  return res.json();
}

export async function updateOrderStatus(orderId: number, status?: string, reason?: string, paymentStatus?: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, reason, payment_status: paymentStatus })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi cập nhật trạng thái');
  }
  return res.json();
}

export async function notifyTransfer(orderId: number, receiptUrl?: string): Promise<{ success: boolean; message: string; order: Order }> {
  const res = await fetch(`/api/orders/${orderId}/notify-transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_receipt_url: receiptUrl })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi gửi thông báo chuyển khoản');
  }
  return res.json();
}

export async function checkOrderPaymentStatus(orderId: number): Promise<{ id: number; payment_status: string; status: string; payment_transaction_id?: string; paid_at?: string; payment_gateway_name?: string }> {
  const res = await fetch(`/api/orders/${orderId}/payment-status`);
  if (!res.ok) throw new Error('Lỗi kiểm tra trạng thái thanh toán');
  return res.json();
}

export async function triggerAutoPayment(orderId: number, gateway?: string): Promise<{ success: boolean; message: string; order: Order; transaction_id: string }> {
  const res = await fetch(`/api/orders/${orderId}/auto-pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gateway })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi thanh toán tự động');
  }
  return res.json();
}

export async function trackOrder(orderId: string | number, contact?: string): Promise<{ order: Order; tracking: TrackingInfo }> {
  const res = await fetch('/api/orders/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, contact })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không tìm thấy thông tin vận chuyển cho đơn hàng này');
  }
  return res.json();
}

export async function rescheduleDelivery(data: {
  order_id: string | number;
  date: string;
  time_slot: string;
  note?: string;
  new_phone?: string;
  new_address?: string;
}): Promise<{ success: boolean; message: string; order: Order; tracking: TrackingInfo }> {
  const res = await fetch('/api/orders/reschedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể gửi yêu cầu hẹn lịch giao lại');
  }
  return res.json();
}

export async function lookupOrders(orderId: string | number, contact: string): Promise<Order> {
  const res = await fetch('/api/orders/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, contact })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không tìm thấy thông tin đơn hàng');
  }
  const data = await res.json();
  return data.order;
}

export async function sendReceiptEmail(orderId: number, recipientEmail?: string): Promise<{ success: boolean; message: string; sent_to: string; sent_at: string }> {
  const res = await fetch(`/api/orders/${orderId}/send-receipt-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient_email: recipientEmail })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi gửi email hóa đơn');
  }
  return res.json();
}

export async function fetchNotificationLogs(orderId?: number): Promise<NotificationLog[]> {
  const url = orderId ? `/api/notifications/logs?order_id=${orderId}` : '/api/notifications/logs';
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải nhật ký thông báo');
  return res.json();
}

export async function resendNotification(orderId: number, type: 'email' | 'sms'): Promise<{ success: boolean; message: string; log: NotificationLog }> {
  const res = await fetch('/api/notifications/resend', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ order_id: orderId, type })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi gửi lại thông báo');
  }
  return res.json();
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const res = await fetch('/api/notifications/settings', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải cấu hình thông báo');
  return res.json();
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ success: boolean; message: string; settings: NotificationSettings }> {
  const res = await fetch('/api/notifications/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi cập nhật cấu hình thông báo');
  }
  return res.json();
}

export async function cancelCustomerOrder(orderId: number, reason: string): Promise<Order> {
  const res = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi hủy đơn hàng');
  }
  return res.json();
}

// Reviews
export async function fetchProductReviews(productId: number): Promise<ReviewSummary & { reviews: Review[] }> {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Lỗi tải đánh giá sản phẩm');
  return res.json();
}

export async function submitProductReview(
  productId: number,
  data: { rating: number; comment: string; user_name?: string }
): Promise<{ review: Review; summary: ReviewSummary & { reviews: Review[] } }> {
  const res = await fetch(`/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi gửi đánh giá');
  }
  return res.json();
}

export async function deleteProductReview(
  productId: number,
  reviewId: number
): Promise<{ message: string; summary: ReviewSummary & { reviews: Review[] } }> {
  const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi xóa đánh giá');
  }
  return res.json();
}

// Inventory & Stock Management
export async function fetchStockLogs(): Promise<StockLogItem[]> {
  const res = await fetch('/api/inventory/logs', { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Lỗi tải lịch sử tồn kho');
  return res.json();
}

export async function adjustProductStock(data: {
  productId: number;
  type: 'in' | 'out' | 'adjust';
  quantityChange: number;
  note?: string;
  sku?: string;
}): Promise<{ message: string; product: Product; logs: StockLogItem[] }> {
  const res = await fetch('/api/inventory/stock-adjust', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi cập nhật kho hàng');
  }
  return res.json();
}

export async function updateProductSkuVariants(
  productId: number,
  data: { sku?: string; variants?: { name: string; options: string[] }[]; cost_price?: number }
): Promise<Product> {
  const res = await fetch(`/api/products/${productId}/sku-variants`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Lỗi cập nhật SKU & biến thể');
  }
  return res.json();
}

// Analytics & Reports
export async function fetchAnalyticsReport(range: string = '30days'): Promise<AnalyticsReportData> {
  const res = await fetch(`/api/analytics/reports?range=${range}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Lỗi tải báo cáo doanh thu');
  return res.json();
}

// AI Marketing & Consultant
export async function askAIConsultant(data: {
  message: string;
  history?: { role: string; content: string }[];
  budget?: string;
}): Promise<{ reply: string; recommendedProducts: Product[] }> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi kết nối Trợ Lý AI');
  }
  return res.json();
}

export async function generateAIDescription(data: {
  productName: string;
  categoryName?: string;
  price?: number;
  keywords?: string;
}): Promise<{ description: string }> {
  const res = await fetch('/api/ai/generate-description', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi tạo mô tả AI');
  }
  return res.json();
}
