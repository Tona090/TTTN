# AI Humanization & Authentic Retail Audit
**Target Domain:** Premium PC Hardware & Custom Gaming Gear Store (TechGear Studio)

---

## Executive Summary
This audit evaluates the codebase to transform the application from a generic AI-generated template into an authentic, trustworthy, and humanized premium PC hardware e-commerce platform.

---

## 1. Sections That Feel AI-Generated & Template-Like

| Current Problem | File / Component Affected | Why It Feels Artificial | Recommended Improvement |
| :--- | :--- | :--- | :--- |
| **Over-reliance on AI Badges & Generic Floating Widgets** | `/src/components/Client/AIChatAssistant.tsx`<br>`/src/App.tsx` | Constant visual reminders of "AI Assistant" and automated AI recommendations make the store feel like a tech demo rather than a real retail store with human hardware technicians. | Rename AI support to **"Chuyên Gia Setup TechGear"** (Hardware Tech Expert). Frame recommendations around real hardware benchmarks, compatibility checks, and human technician advice. |
| **Monotonous Card Grids & Generic Badges** | `/src/components/Client/ProductCard.tsx` | Standard 4-column product grid with generic tags ("HOT", "NEW", "BEST") and standardUnsplash stock images without real hardware spec tags (e.g., VRAM, Switch type, TDP, Form factor). | Add hardware-specific spec badges (e.g. *RTX 4080 Super*, *Hot-swap Gasket*, *DDR5 Ready*) and actual stock availability status per store branch. |
| **Artificial Banner & Announcement Carousels** | `/src/components/Client/HomePage.tsx`<br>`/src/components/Header.tsx` | Carousel banners feature generic discount slogans ("Khuyến mãi cực sốc", "Giảm đến 50%") without specific hardware campaigns (e.g., "Build PC Gamers Season", "NuPhy V2 Launch"). | Replace generic banners with authentic hardware promotions: custom build bundles, GPU trade-in programs, and mechanical keyboard lube/mod workshops. |
| **Generic Shell Shocker Countdown Timer** | `/src/components/Client/HomePage.tsx` | Countdown timer with stock urgency bars ("Chỉ còn 3 sản phẩm") is a known AI e-commerce template cliché that triggers consumer skepticism. | Replace artificial scarcity counters with real **Flash Sale Giờ Vàng** linked to actual inventory levels, including real warehouse location badges. |

---

## 2. Copywriting & Generic Text Issues

| Current Problem | File / Component Affected | Why It Feels Artificial | Recommended Improvement |
| :--- | :--- | :--- | :--- |
| **Generic Marketing Buzzwords** | `/src/components/Client/HomePage.tsx`<br>`/src/services/storeMetadata.ts` | Terms like "Trải nghiệm đỉnh cao công nghệ", "Siêu phẩm hàng đầu", "Giải pháp toàn diện" sound like generic ChatGPT generated copy. | Use precise, technical hardware language enthusiast gamers care about (e.g., *Switch Linear Pre-lubed*, *Mạch PCB Hotswap 1.2mm Cut Flex*, *Keo Tản Nhiệt Tra Sẵn*, *Chuẩn 80 Plus Gold*). |
| **Generic Guarantee & Trust Banner Texts** | `/src/components/Client/HomePage.tsx` (Footer trust bar) | Standard 4-box layout with generic text: "Giao hàng hỏa tốc", "Chính hãng 100%", "Bảo hành 24-36 tháng" without store-specific policies. | Provide clear retail policy specifics: "Đổi mới 1-đổi-1 trong 30 ngày tại Showroom Q.1 & Cầu Giấy", "Miễn phí Cân Wire Stabilizer & Tra Keo Noctua khi build PC". |
| **Unlocalized / Mixed Language Labels** | `/src/components/Header.tsx`<br>`/src/components/Client/ProductCard.tsx` | Mix of English ("Quick View", "Cart") and Vietnamese ("Bán chạy", "Xem chi tiết") creating an inconsistent brand tone. | Standardize all customer-facing strings with a unified, professional Vietnamese tech retail voice. |

---

## 3. Elements That Reduce Customer Trust

| Current Problem | File / Component Affected | Why It Feels Artificial | Recommended Improvement |
| :--- | :--- | :--- | :--- |
| **Generic Unsplash Stock Images** | `/src/data/mockData.ts`<br>`/src/components/Admin/ProductManager.tsx` | Placeholder product images rely on generic Unsplash search URLs that don't match exact hardware SKU numbers (e.g. keyboard image showing generic laptop). | Use curated, high-resolution product photography for actual hardware SKUs with multi-angle gallery views (PCB breakdown, switch shot, ports). |
| **Lack of Physical Showroom & Contact Details** | `/src/components/Footer.tsx`<br>`/src/components/Client/SEOHead.tsx` | Generic contact address and missing real-time showroom status (Open/Closed, Parking available, Direct Tech Support Zalo). | Add authentic physical showroom details, Google Maps integration link, hotline Zalo Tech Support, and direct technician contact info. |
| **Missing Real Customer Reviews & Verified Buyer Badges** | `/src/components/Client/ProductDetailPage.tsx` | Product details section lacks real buyer reviews with uploaded photos of desk setups or sound-test audio clips (for mechanical keyboards). | Add a **"Đánh Giá Từ Gamer / Modder"** section allowing photo uploads, soundtest ratings, and verified buyer badges. |

---

## 4. Generic E-commerce Template UI Fixes

| Current Problem | File / Component Affected | Why It Feels Artificial | Recommended Improvement |
| :--- | :--- | :--- | :--- |
| **Floating Action Button Overload** | `/src/App.tsx` | Multiple floating buttons (PDF, AI Chat, Back to top, Cart counter) overlapping on mobile screens. | Consolidate floating actions into a clean, floating bottom navigation bar on mobile. |
| **Lack of Dedicated PC Builder Tooling** | `/src/components/Client/PcBuilder.tsx` | PC builder component lacks real watt calculation indicators, TDP warnings, or motherboard socket compatibility checks. | Upgrade the PC Builder with real-time **TDP Wattage Calculator**, **Socket Compatibility Engine** (LGA1700 / AM5), and **Case Clearance Advisor**. |

---

## Proposed Action Plan (Awaiting Your Approval)

1. **Phase 1: Brand Copywriting & Voice Polish**: Replace generic AI marketing buzzwords with authentic PC hardware jargon and clear Vietnamese retail policy terms.
2. **Phase 2: Product Gallery & Spec Badge Refinement**: Enhance product items with genuine technical spec badges (Switch, VRAM, Form Factor, Socket) and multi-angle hardware photography.
3. **Phase 3: Hardware Tech Expert & Showroom Experience**: Humanize the AI support assistant into a hardware consultant ("Kỹ Thuật Viên TechGear") and embed physical showroom details & verified customer desk setup reviews.
4. **Phase 4: Functional Compatibility & PC Builder Integration**: Ensure the PC Builder tool strictly verifies TDP, socket types, and RAM clearances.

---
*Note: As requested, no code changes have been applied. I am waiting for your review and explicit approval before proceeding with implementation.*
