import { SiteSettings, BrandSettings } from '../types';

export interface USPItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface StoreMetadata {
  slogan: string;
  founder: {
    name: string;
    role: string;
    avatar: string;
    message: string;
    commitmentPoints: string[];
  };
  usps: USPItem[];
  contact: {
    hotline: string;
    address: string;
    email: string;
  };
  heroBanner: {
    title: string;
    subtitle: string;
  };
}

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  store_name: 'TechGear Studio',
  brand_story: 'TechGear được thành lập từ năm 2020 bởi nhóm kỹ sư và gamer nhiệt huyết tại TP.HCM. Chúng tôi tự tay lắp ráp và thử nghiệm từng cấu hình PC, kiểm tra từng chiếc bàn phím cơ trước khi trao đến tay khách hàng.',
  founder_message: 'Chúng tôi không bán mọi linh kiện xuất hiện trên thị trường. Chúng tôi chỉ tư vấn và cung cấp những sản phẩm mà chính đội ngũ kỹ thuật TechGear sẵn sàng sử dụng hàng ngày.',
  brand_philosophy: 'Hardware được chọn dựa trên hiệu năng thực tế, độ bền bo mạch, hiệu quả tản nhiệt và khả năng nâng cấp lâu dài — không vì những thông số marketing hào nhoáng.',
  homepage_heading: 'Chúng tôi không bán mọi linh kiện. Chúng tôi giúp bạn build đúng dàn máy bạn thực sự cần.',
  homepage_description: 'Tư vấn cấu hình tối ưu hiệu năng/chi phí, lắp ráp thủ công chuẩn cable management, test stress-test 24h & hỗ trợ kỹ thuật trọn đời.',
  hardware_selection_rule: 'Chỉ phân phối sản phẩm chính hãng NPP Việt Nam, có tem bảo hành rõ ràng, mạch PCB dày dặn và linh kiện tụ điện cao cấp.',
  product_review_style: 'Đánh giá chân thực từ góc nhìn kỹ thuật viên: nêu rõ ưu điểm thực tế, nhược điểm cần lưu ý và đối tượng phù hợp nhất.',
  customer_promise: 'Đổi mới 1-đổi-1 trong 30 ngày nếu phát sinh lỗi nhà sản xuất. Hỗ trợ mượn linh kiện dùng tạm trong thời gian bảo hành.',
  community_message: 'Tham gia Cộng đồng TechGear Modding & Setup để chia sẻ kinh nghiệm góc máy, trao đổi switch custom và nhận hỗ trợ 24/7 từ đội ngũ kỹ thuật.'
};

/**
 * Utility function to dynamically get centralized BrandSettings.
 * Allows store owner/admin to configure all personality text live.
 */
export function getBrandSettings(settings?: SiteSettings | null): BrandSettings {
  if (!settings) {
    return DEFAULT_BRAND_SETTINGS;
  }
  const bs = settings.brandSettings;
  return {
    store_name: bs?.store_name ?? settings.logoText ?? DEFAULT_BRAND_SETTINGS.store_name,
    brand_story: bs?.brand_story ?? DEFAULT_BRAND_SETTINGS.brand_story,
    founder_message: bs?.founder_message ?? settings.founderMessage ?? DEFAULT_BRAND_SETTINGS.founder_message,
    brand_philosophy: bs?.brand_philosophy ?? DEFAULT_BRAND_SETTINGS.brand_philosophy,
    homepage_heading: bs?.homepage_heading ?? settings.heroTitle ?? DEFAULT_BRAND_SETTINGS.homepage_heading,
    homepage_description: bs?.homepage_description ?? settings.heroSubtitle ?? DEFAULT_BRAND_SETTINGS.homepage_description,
    hardware_selection_rule: bs?.hardware_selection_rule ?? DEFAULT_BRAND_SETTINGS.hardware_selection_rule,
    product_review_style: bs?.product_review_style ?? DEFAULT_BRAND_SETTINGS.product_review_style,
    customer_promise: bs?.customer_promise ?? DEFAULT_BRAND_SETTINGS.customer_promise,
    community_message: bs?.community_message ?? DEFAULT_BRAND_SETTINGS.community_message,
  };
}

/**
  Default store metadata used as a fallback when admin settings are blank.
  Eliminates generic AI placeholders and provides authentic store personality.
 */
export const DEFAULT_STORE_METADATA: StoreMetadata = {
  slogan: 'Gaming Gear & Custom Keyboards Chuyên Nghiệp - Đam Mê Bất Tận',
  founder: {
    name: 'Nguyễn Minh Toàn',
    role: 'Founder & Technical Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    message: 'Chào các bạn! Xuất thân từ đam mê gaming & custom keyboard, TechGear cam kết từng sản phẩm bán ra đều được shop kiểm tra kỹ lưỡng, dán tem bảo hành chính hãng NPP Việt Nam và hỗ trợ cân chỉnh Switch, Lube miễn phí cho khách hàng.',
    commitmentPoints: [
      '100% Hàng Chính Hãng Phân Phối Việt Nam',
      'Miễn Phí Mod, Lube Switch & Tune Stabilizer',
      'Hỗ Trợ Kỹ Thuật & Đổi Trả 1-Đổi-1 Trong 30 Ngày'
    ]
  },
  usps: [
    {
      id: 'usp-1',
      icon: 'Award',
      title: 'Chính Hãng 100%',
      desc: 'Ủy quyền phân phối chính thức từ Razer, Logitech, Keychron, NuPhy'
    },
    {
      id: 'usp-2',
      icon: 'Truck',
      title: 'Giao Nhanh 2H',
      desc: 'Freeship hỏa tốc nội thành TP.HCM & Hà Nội cho đơn từ 1 triệu'
    },
    {
      id: 'usp-3',
      icon: 'ShieldCheck',
      title: 'Bảo Hành Tận Tâm',
      desc: 'Đổi mới trong 30 ngày nếu phát sinh lỗi nsx, hỗ trợ mượn gear dùng tạm'
    },
    {
      id: 'usp-4',
      icon: 'Wrench',
      title: 'Hỗ Trợ Custom Free',
      desc: 'Tư vấn build phím cơ, tape mod, lubing & cân wire miễn phí tại showroom'
    }
  ],
  contact: {
    hotline: '1900-TECHGEAR (0908.123.456)',
    address: '123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    email: 'support@techgear.vn'
  },
  heroBanner: {
    title: 'Chúng tôi không bán mọi linh kiện. Chúng tôi giúp bạn build đúng dàn máy bạn thực sự cần.',
    subtitle: 'Tư vấn cấu hình tối ưu hiệu năng/chi phí, lắp ráp thủ công chuẩn cable management, test stress-test 24h & hỗ trợ kỹ thuật trọn đời.'
  }
};

/**
 * Utility function to dynamically compute store metadata from SiteSettings.
 * Allows store owner/admin to customize branding, founder message, and USPs live.
 */
export function getStoreMetadata(settings?: SiteSettings | null): StoreMetadata {
  if (!settings) {
    return DEFAULT_STORE_METADATA;
  }

  const brand = getBrandSettings(settings);

  return {
    slogan: settings.slogan?.trim() || DEFAULT_STORE_METADATA.slogan,
    founder: {
      name: settings.founderName?.trim() || DEFAULT_STORE_METADATA.founder.name,
      role: settings.founderRole?.trim() || DEFAULT_STORE_METADATA.founder.role,
      avatar: settings.founderAvatar?.trim() || DEFAULT_STORE_METADATA.founder.avatar,
      message: brand.founder_message || settings.founderMessage?.trim() || DEFAULT_STORE_METADATA.founder.message,
      commitmentPoints: settings.founderCommitments && settings.founderCommitments.length > 0
        ? settings.founderCommitments
        : DEFAULT_STORE_METADATA.founder.commitmentPoints
    },
    usps: settings.usps && settings.usps.length > 0 ? settings.usps : DEFAULT_STORE_METADATA.usps,
    contact: {
      hotline: settings.hotline?.trim() || DEFAULT_STORE_METADATA.contact.hotline,
      address: settings.address?.trim() || DEFAULT_STORE_METADATA.contact.address,
      email: settings.email?.trim() || DEFAULT_STORE_METADATA.contact.email
    },
    heroBanner: {
      title: brand.homepage_heading || settings.heroTitle?.trim() || DEFAULT_STORE_METADATA.heroBanner.title,
      subtitle: brand.homepage_description || settings.heroSubtitle?.trim() || DEFAULT_STORE_METADATA.heroBanner.subtitle
    }
  };
}
