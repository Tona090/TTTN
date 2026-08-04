-- ====================================================================
-- ĐỒ ÁN TỐT NGHIỆP: HỆ THỐNG BÁN LẺ THIẾT BỊ CÔNG NGHỆ TECHGEAR STORE
-- DATABASE SCHEMA FOR MYSQL (XAMPP / PHPMYADMIN / MYSQL WORKBENCH)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `techgear_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `techgear_db`;

-- 1. Bảng Vai Trò & Người Dùng (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SuperAdmin', 'Admin', 'Editor', 'User') DEFAULT 'User',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Danh Mục Sản Phẩm (Categories)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Sản Phẩm (Products)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `image` TEXT NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `sale_price` DECIMAL(12,2) DEFAULT NULL,
  `quantity` INT DEFAULT 0,
  `description` TEXT,
  `is_new` TINYINT(1) DEFAULT 0,
  `is_sale` TINYINT(1) DEFAULT 0,
  `is_best` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Đơn Hàng (Orders)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Chi Tiết Đơn Hàng (Order Items)
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL,
  `image` TEXT,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Banners Quảng Cáo
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT,
  `image` TEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT '#',
  `status` ENUM('active', 'inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Tin Tức & Bài Viết (News)
CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `excerpt` TEXT,
  `author` VARCHAR(100) DEFAULT 'TechGear Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Cấu Hình Hệ Thống (Site Settings)
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `logo_text` VARCHAR(100) DEFAULT 'TECHGEAR',
  `logo_url` TEXT,
  `primary_color` VARCHAR(20) DEFAULT '#f97316',
  `show_new_products` TINYINT(1) DEFAULT 1,
  `show_best_products` TINYINT(1) DEFAULT 1,
  `show_sale_products` TINYINT(1) DEFAULT 1,
  `show_news_section` TINYINT(1) DEFAULT 1,
  `hero_title` TEXT,
  `hero_subtitle` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA (MẪU DỮ LIỆU BAN ĐẦU)
-- ====================================================================

-- Mật khẩu mặc định của tài khoản là "123456" (đã mã hóa bcrypt)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
(1, 'Trần Minh Toàn (SuperAdmin)', 'admin@techgear.vn', '$2a$10$wT/7P08fN3.kKkQZ8/03/O4nS/p/.8G5Rj1vS2e.M4m115HjM3gxy', 'SuperAdmin'),
(2, 'Nguyễn Văn Nam (Admin)', 'nam.nguyen@techgear.vn', '$2a$10$wT/7P08fN3.kKkQZ8/03/O4nS/p/.8G5Rj1vS2e.M4m115HjM3gxy', 'Admin'),
(3, 'Lê Thị Mai (Editor)', 'mai.le@techgear.vn', '$2a$10$wT/7P08fN3.kKkQZ8/03/O4nS/p/.8G5Rj1vS2e.M4m115HjM3gxy', 'Editor'),
(4, 'Phạm Hoàng Anh (Khách hàng)', 'hoanganh@gmail.com', '$2a$10$wT/7P08fN3.kKkQZ8/03/O4nS/p/.8G5Rj1vS2e.M4m115HjM3gxy', 'User');

INSERT INTO `categories` (`id`, `name`, `description`, `status`) VALUES
(1, 'Bàn Phím Cơ', 'Bàn phím cơ Custom, Switch bôi trơn sẵn, LED RGB & Wireless', 'active'),
(2, 'Chuột Gaming', 'Chuột siêu nhẹ Unplugged, Mắt đọc Pixart PAW3395 chính xác', 'active'),
(3, 'Tai Nghe & Audio', 'Tai nghe Gaming 7.1, Tai nghe ANC chống ồn chủ động', 'active'),
(4, 'Màn Hình Gaming', 'Màn hình Ultrawide 2K/4K 240Hz Tần số quét cao OLED', 'active'),
(5, 'Linh Kiện & Laptop', 'Laptop Gaming RTX Series, Mainboard, CPU Gen 14', 'active');

INSERT INTO `products` (`id`, `category_id`, `name`, `image`, `price`, `sale_price`, `quantity`, `description`, `is_new`, `is_sale`, `is_best`) VALUES
(101, 1, 'Bàn Phím Cơ Keychron Q1 Pro Wireless RGB', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80', 4200000, 3850000, 25, 'Vỏ nhôm CNC nguyên khối, kết nối Bluetooth 5.1 / 2.4Ghz / Type-C', 1, 1, 1),
(102, 2, 'Chuột Gaming Logitech G Pro X Superlight 2', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 3500000, 3190000, 40, 'Trọng lượng siêu nhẹ 60g, Cảm biến HERO 2 32.000 DPI', 1, 1, 1),
(103, 3, 'Tai Nghe SteelSeries Arctis Nova Pro Wireless', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80', 8900000, NULL, 15, 'Âm thanh độ phân giải cao Hi-Res, Chống ồn ANC chủ động kép', 0, 0, 1),
(104, 4, 'Màn Hình LG UltraGear 27GR95QE OLED 240Hz', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80', 21500000, 18900000, 10, 'Tấm nền OLED 0.03ms, Tần số quét 240Hz, DCI-P3 98.5%', 1, 1, 0),
(105, 5, 'Laptop Gaming ASUS ROG Strix SCAR 16 RTX 4080', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', 68000000, 62900000, 5, 'Intel Core i9 14900HX, RTX 4080 12GB, Màn hình Mini LED 240Hz', 1, 1, 1);

INSERT INTO `settings` (`id`, `logo_text`, `hero_title`, `hero_subtitle`) VALUES
(1, 'TECHGEAR', 'ĐỊNH HÌNH PHONG CÁCH DESK SETUP ĐẲNG CẤP 2026', 'Trải nghiệm đỉnh cao công nghệ với linh kiện PC, bàn phím cơ custom & thiết bị gaming chính hãng 100%.');
