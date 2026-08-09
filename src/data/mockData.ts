import { Category, Product, Banner, NewsArticle, User, SiteSettings, Order, Review } from '../types';

export const initialReviews: Review[] = [
  {
    id: 1,
    product_id: 101,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    rating: 5,
    comment: 'Gõ rất đầm tay, âm thanh gõ nhẹ nhàng mượt mà không ồn. Thiết kế mỏng đẹp mắt, kết nối 2.4Ghz cực kỳ ổn định không đứt gãy!',
    created_at: '2026-07-23 10:20',
    is_verified_buyer: true
  },
  {
    id: 2,
    product_id: 101,
    user_id: 8,
    user_name: 'Lê Văn Hoàng',
    rating: 5,
    comment: 'Bàn phím NuPhy Air75 v2 này gõ sướng thật sự. Pin dùng cả tuần chưa thấy báo yếu. Đóng gói của TechGear rất cẩn thận!',
    created_at: '2026-07-21 15:45',
    is_verified_buyer: true
  },
  {
    id: 3,
    product_id: 101,
    user_id: 9,
    user_name: 'Phạm Thu Trang',
    rating: 4,
    comment: 'Sản phẩm đẹp gọn nhẹ mang đi cafe tiện lợi. Hỗ trợ QMK/VIA tùy chỉnh phím rất chuyên nghiệp.',
    created_at: '2026-07-19 09:10',
    is_verified_buyer: false
  },
  {
    id: 4,
    product_id: 103,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    rating: 5,
    comment: 'Nút cuộn MagSpeed của Logitech đỉnh thực sự, cuộn cả nghìn dòng code trong 1 giây. Bám tay chắc chắn chống mỏi cổ tay rất tốt.',
    created_at: '2026-07-23 11:05',
    is_verified_buyer: true
  },
  {
    id: 5,
    product_id: 105,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    rating: 5,
    comment: 'Chống ồn đỉnh cao, đeo vào là không gian tĩnh lặng hoàn toàn. Âm bass sâu và ấm, micro nói chuyện Google Meet cực kỳ rõ nét.',
    created_at: '2026-07-24 16:30',
    is_verified_buyer: true
  },
  {
    id: 6,
    product_id: 107,
    user_id: 10,
    user_name: 'Đặng Quốc Bảo',
    rating: 5,
    comment: 'Màn hình OLED 175Hz màu sắc đẹp mê hồn, độ tương phản tuyệt đối black deep 0 nit. Chơi game và xem phim trải nghiệm khác biệt hoàn toàn.',
    created_at: '2026-07-20 18:00',
    is_verified_buyer: true
  }
];

export const initialCategories: Category[] = [
  { id: 1, name: 'Bàn Phím Cơ', description: 'Bàn phím cơ Custom, Wireless, Gaming cao cấp', status: 'active' },
  { id: 2, name: 'Chuột Gaming & Văn Phòng', description: 'Chuột siêu nhẹ, cảm biến Ergonomic chính xác', status: 'active' },
  { id: 3, name: 'Tai Nghe & Âm Thanh', description: 'Tai nghe chống ồn ANC, Loa Bluetooth Hi-Fi', status: 'active' },
  { id: 4, name: 'Màn Hình & Laptop', description: 'Màn hình Ultrawide, Laptop Gaming & UltraBook', status: 'active' },
  { id: 5, name: 'Phụ Kiện Desk Setup', description: 'Giá đỡ, Đèn màn hình, Lót chuột màng da, Cáp sạc', status: 'active' }
];

export const initialProducts: Product[] = [
  {
    id: 101,
    category_id: 1,
    category_name: 'Bàn Phím Cơ',
    name: 'Bàn Phím Cơ NuPhy Air75 V2 Wireless RGB',
    sku: 'KB-NUPHY-A75V2',
    cost_price: 2100000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    price: 3200000,
    sale_price: 2890000,
    quantity: 45,
    description: `**Verdict:** Chiếc bàn phím cơ low-profile 75% phản hồi siêu nhanh cho người dùng cần sự linh hoạt giữa làm việc di động và gaming phản xạ cao.

**Best for:**
Lập trình viên, gamer hay di chuyển, và bất kỳ ai muốn góc máy mỏng gọn nhưng vẫn thích cảm giác gõ đầm tay của switch cơ.

**Not recommended for:**
Người thích gõ switch hành trình sâu 4.0mm truyền thống hoặc bàn tay cực lớn thích phím full-size có phím số.

**Real gaming scenarios:**
Thích hợp đánh Valorant, CS2 và combat Liên Minh nhờ độ trễ 2.4GHz 1000Hz cực thấp, lướt phím liên tục không mỏi ngón.

**Pros:**
- Layout 75% tối ưu không gian, switch Gateron Low Profile V2 gõ cực mượt
- Hỗ trợ QMK/VIA keymap tự do và kết nối 3 mode siêu ổn định
- Pin 4000mAh dùng bền bỉ cả tuần làm việc

**Cons:**
- Keycap low-profile khó thay thế chuẩn MX profile thông thường
- Khung phím mỏng nên tiếng bottom-out đanh hơn phím nhôm đúc dày

**Expert opinion:**
"Air75 V2 xử lý triệt để nhược điểm hoạ tiết và nhòe tiếng của bản V1. Đội ngũ TechGear đã mod thử lube lại stab và thấy đầm hơn rõ rệt. Đây là lựa chọn hàng đầu cho laptop setup."`,
    is_new: true,
    is_sale: true,
    is_best: true,
    specs: { 'Layout': '75%', 'Switch': 'Gateron Low Profile V2', 'Pin': '4000mAh', 'Kết nối': '3 Modes' },
    variants: [
      { name: 'Switch Type', options: ['Cowberry Linear', 'Aloe Light Linear', 'Moss Tactile'] },
      { name: 'Màu sắc', options: ['Ionic White', 'Basalt Black', 'Lunar Gray'] }
    ]
  },
  {
    id: 102,
    category_id: 1,
    category_name: 'Bàn Phím Cơ',
    name: 'Bàn Phím Cơ Keychron Q1 Pro Custom Aluminum',
    sku: 'KB-KEYCHRON-Q1P',
    cost_price: 3300000,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    price: 4500000,
    sale_price: null,
    quantity: 4, // Low stock <= 5
    description: `**Verdict:** Khối nhôm CNC 6063 nặng 1.8kg mang lại âm gõ clack/thock tròn trịa và độ đầm chắc tuyệt đối cho bàn làm việc cố định.

**Best for:**
Modder phím cơ, coder làm việc với Mac/Windows song song, và người tìm kiếm trải nghiệm gõ phím cao cấp không rung lắc.

**Not recommended for:**
Người cần mang phím đi lại hàng ngày hoặc người ưu tiên kết nối không dây siêu mỏng nhẹ.

**Real gaming scenarios:**
Phù hợp cho các tựa game MOBA, RPG và sim đua xe cần sự chính xác tuyệt đối từng nốt phím và độ bền công tắc hàng triệu lần bấm.

**Pros:**
- Vỏ nhôm nguyên khối đúc CNC cực đầm, chống rung hoàn hảo
- Mạch Hotswap 5-pin south-facing không lo cấn keycap Cherry profile
- Gasket mount đệm xốp Poron cho cảm giác nhún êm ái

**Cons:**
- Trọng lượng rất nặng (1.8kg), không thích hợp bỏ balo
- Thời lượng pin Bluetooth khi bật full LED RGB ở mức trung bình

**Expert opinion:**
"Keychron Q1 Pro là điểm khởi đầu hoàn hảo nếu bạn muốn bước chân vào thế giới custom keyboard mà không cần tự khoan cắt hay hàn mạch. Chúng tôi khuyên bạn nên thử switch Keychron Banana cho cảm giác tactile khấc khấc rất sướng."`,
    is_new: false,
    is_sale: false,
    is_best: true,
    specs: { 'Chất liệu': 'Nhôm CNC 6063', 'Mount': 'Double Gasket', 'LED': 'RGB South-facing' },
    variants: [
      { name: 'Khung Nhôm', options: ['Carbon Black', 'Silver Grey', 'Navy Blue'] },
      { name: 'Switch', options: ['Keychron K Pro Red', 'Keychron K Pro Banana'] }
    ]
  },
  {
    id: 103,
    category_id: 2,
    category_name: 'Chuột Gaming & Văn Phòng',
    name: 'Chuột Không Dây Logitech MX Master 3S',
    sku: 'MS-LOGI-MXM3S',
    cost_price: 1850000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    price: 2790000,
    sale_price: 2450000,
    quantity: 60,
    description: `**Verdict:** Chuột công thái học biểu tượng cho lập trình viên và creator với con cuộn từ tính MagSpeed cuộn 1,000 dòng code mỗi giây.

**Best for:**
Coder, video editor, designer làm việc đa màn hình và cần giảm áp lực cổ tay khi thao tác liên tục 8-10 tiếng.

**Not recommended for:**
Game thủ FPS thi đấu chuyên nghiệp vì trọng lượng 141g nặng hơn đáng kể so với chuột eSports siêu nhẹ.

**Real gaming scenarios:**
Chơi mượt các game chiến thuật 4X như Civilization VI, Total War hoặc game mô phỏng City Builder nhờ phím bấm Silent Click êm ái và cử chỉ gesture switch màn hình nhanh.

**Pros:**
- Con cuộn MagSpeed cuộn vô cấp siêu tốc, hoạt động cực kì êm ái
- Cảm biến Darkfield 8000 DPI di chuyển mượt trên mọi bề mặt kể cả mặt kính
- Nút bấm Silent Click giảm 90% tiếng ồn so với bản Master 3

**Cons:**
- Trọng lượng 141g không tối ưu cho phản xạ ngắm bắn FPS tốc độ cao
- Chỉ dành cho người dùng thuận tay phải

**Expert opinion:**
"Nếu công việc chính của bạn là viết code hoặc làm video, đây là khoản đầu tư xứng đáng nhất cho sức khỏe cổ tay. Nút cuộn ngón cái switch tab rất gây nghiện."`,
    is_new: false,
    is_sale: true,
    is_best: true,
    specs: { 'Cảm biến': 'Darkfield 8000 DPI', 'Thời lượng pin': '70 ngày', 'Kết nối': 'Logi Bolt & Bluetooth' },
    variants: [
      { name: 'Màu sắc', options: ['Graphite Black', 'Pale Grey', 'Space Black'] }
    ]
  },
  {
    id: 104,
    category_id: 2,
    category_name: 'Chuột Gaming & Văn Phòng',
    name: 'Chuột Gaming Razer Viper V3 Pro Ultra-light',
    sku: 'MS-RAZER-VP3PRO',
    cost_price: 2700000,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    price: 3990000,
    sale_price: 3590000,
    quantity: 0, // Out of stock = 0
    description: `**Verdict:** Chuột eSports đối xứng siêu nhẹ 54g trang bị cảm biến Focus Pro 35K và Polling Rate 8000Hz cho độ chính xác ngắm bắn từng milimet.

**Best for:**
Game thủ FPS chuyên nghiệp (CS2, Valorant, Apex Legends) đòi hỏi gia tốc chuột tối đa và khả năng flick shot chính xác.

**Not recommended for:**
Người tìm kiếm chuột nặng đầm tay, chuột nhiều nút phụ macro văn phòng hoặc người có bàn tay quá to thích ôm trọn lòng bàn tay.

**Real gaming scenarios:**
Thống trị các trận đấu CS2 & Valorant kịch tính, phản xạ nhắm ngắm AWP và giữ tâm súng ổn định không bị delay dù ở nhịp độ cao nhất.

**Pros:**
- Trọng lượng siêu nhẹ 54 gram phân bổ trọng tâm hoàn hảo
- Cảm biến Focus Pro 35K DPI kết hợp dongle Wireless 8000Hz siêu nhạy
- Form dáng đối xứng được các tuyển thủ chuyên nghiệp kiểm chứng

**Cons:**
- Không có khe cất dongle USB tích hợp trên thân chuột
- Lớp vỏ mờ bám mồ hôi tay nhẹ sau thời gian dài train game

**Expert opinion:**
"Viper V3 Pro là đỉnh cao của dòng chuột siêu nhẹ hiện nay. Team TechGear đã test 8000Hz trên màn 240Hz: tâm súng bám sát cử chỉ tay mà không hề có cảm giác khựng hay trễ bóng ghosting."`,
    is_new: true,
    is_sale: true,
    is_best: false,
    specs: { 'Trọng lượng': '54 gram', 'Polling Rate': '8000Hz', 'Cảm biến': 'Focus Pro 35K' },
    variants: [
      { name: 'Phiên bản', options: ['Black Edition', 'White Edition', 'Faker Special Edition'] }
    ]
  },
  {
    id: 105,
    category_id: 3,
    category_name: 'Tai Nghe & Âm Thanh',
    name: 'Tai Nghe Chống Ồn Sony WH-1000XM5',
    sku: 'AU-SONY-XM5',
    cost_price: 5800000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    price: 8490000,
    sale_price: 7490000,
    quantity: 30,
    description: `**Verdict:** Tai nghe chống ồn chủ động hàng đầu giúp tạo không gian yên tĩnh tuyệt đối cho người làm việc tập trung và thưởng thức âm nhạc Hi-Fi.

**Best for:**
Người thường xuyên làm việc tại không gian ồn ào (văn phòng mở, quán cafe, máy bay) và đòi hỏi chất âm bass ấm áp đầy đặn.

**Not recommended for:**
Game thủ thi đấu FPS cần tai nghe có dây mic rời chuyên dụng hoặc người tập thể thao cường độ cao dễ đọng mồ hôi pad tai.

**Real gaming scenarios:**
Trải nghiệm hoàn hảo khi đắm chìm vào thế giới game nhập vai cốt truyện sâu như Black Myth: Wukong, Elden Ring hay Cyberpunk 2077 nhờ trường âm rộng và khả năng cách âm môi trường.

**Pros:**
- Chip HD QN1 triệt tiêu tiếng ồn môi trường dải tần thấp và trung xuất sắc
- Driver 30mm màng sợi carbon cho dải âm trầm ấm và dải cao chi tiết
- Micro AI thu âm đàm thoại cực rõ ngay cả trong gió lớn

**Cons:**
- Thiết kế earcup không gấp gọn vào trong được như đời XM4
- Không kháng nước chuẩn IPX cao

**Expert opinion:**
"XM5 mang lại cảm giác đeo nhẹ tênh nhờ quai đeo bọc da nhân tạo mềm mại. Khi bật chống ồn, bạn gần như tách biệt hoàn toàn với thế giới xung quanh để vào trạng thái deep work."`,
    is_new: false,
    is_sale: true,
    is_best: true,
    specs: { 'Chống ồn': 'Auto NC Optimizer', 'Thời lượng pin': '30 giờ', 'Driver': '30mm Carbon Fiber' },
    variants: [
      { name: 'Màu sắc', options: ['Black', 'Silver', 'Midnight Blue'] }
    ]
  },
  {
    id: 106,
    category_id: 3,
    category_name: 'Tai Nghe & Âm Thanh',
    name: 'Loa Bluetooth Marshall Stanmore III Studio',
    sku: 'AU-MARSHALL-ST3',
    cost_price: 6900000,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    price: 9900000,
    sale_price: null,
    quantity: 12,
    description: `**Verdict:** Mẫu loa decor cao cấp kết hợp hoàn hảo giữa phong cách rock vintage biểu tượng và dải âm stereo rộng mở cho góc máy cá nhân.

**Best for:**
Enthusiast yêu thích góc setup đẹp mắt, muốn không gian tràn ngập âm thanh chi tiết và thích điều khiển cơ học núm xoay mạ đồng.

**Not recommended for:**
Người cần loa di động mang đi du lịch (loa chạy điện trực tiếp AC, không có pin) hoặc phòng nhạc cực lớn trên 50m2.

**Real gaming scenarios:**
Thích hợp nghe nhạc nền acoustic, lofi khi chill game nhẹ nhàng như Stardew Valley, Genshin Impact hoặc thưởng thức phim bom tấn tại bàn làm việc.

**Pros:**
- Thiết kế da bọc thủ công kết hợp phím vặn đồng thau sang trọng
- Công suất 80W RMS với ống dẫn âm phản xạ trầm sâu lắng
- Hỗ trợ Bluetooth 5.2 LE Audio thế hệ mới truyền tải âm thanh nén ít hơn

**Cons:**
- Cần cắm nguồn điện 220V trực tiếp, không có pin tích hợp
- Giá thành phân khúc cao cấp

**Expert opinion:**
"Stanmore III cải tiến góc hướng âm của tweeter ra ngoài giúp không gian âm thanh rộng hơn rõ rệt so với đời II. Đây là mảnh ghép tạo điểm nhấn ấn tượng nhất cho góc làm việc decor."`,
    is_new: true,
    is_sale: false,
    is_best: false,
    specs: { 'Công suất': '80W RMS', 'Kết nối': 'Bluetooth 5.2, AUX, RCA', 'Trọng lượng': '4.25 kg' },
    variants: [
      { name: 'Màu sắc', options: ['Black Classic', 'Cream White', 'Brown Vintage'] }
    ]
  },
  {
    id: 107,
    category_id: 4,
    category_name: 'Màn Hình & Laptop',
    name: 'Màn Hình LG UltraGear 34 inch OLED Curved 175Hz',
    sku: 'MN-LG-34OLED',
    cost_price: 17500000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    price: 24900000,
    sale_price: 21900000,
    quantity: 3, // Low stock <= 5
    description: `**Verdict:** Màn hình cong WQHD OLED 34 inch mang lại độ tương phản tuyệt đối và tốc độ phản hồi 0.03ms cho trải nghiệm thị giác không đối thủ.

**Best for:**
Game thủ AAA cao cấp, streamer và creator làm công việc dựng phim chuyên nghiệp đòi hỏi dải màu DCI-P3 98.5%.

**Not recommended for:**
Người dùng văn phòng chỉ đọc tài liệu text tĩnh 10-12 tiếng/ngày (nguy cơ burn-in OLED) hoặc ngân sách tiết kiệm.

**Real gaming scenarios:**
Trải nghiệm gaming đắm chìm tuyệt đỉnh trong Forza Horizon 5, God of War và Cyberpunk 2077 với sắc đen sâu thẳm 0 nit và hiệu ứng HDR rực rỡ.

**Pros:**
- Tấm nền QD-OLED độ tương phản vô tận 1.500.000:1, đen sâu tuyệt đối
- Tần số quét 175Hz và thời gian đáp ứng siêu tốc 0.03ms (GtG)
- Độ cong 800R bao quát trọn vẹn tầm mắt người chơi

**Cons:**
- Cần chú ý tính năng bảo vệ tấm nền (Pixel Cleaning) tự động
- Độ sáng toàn màn hình SDR thấp hơn màn hình Fast IPS cao cấp

**Expert opinion:**
"Một khi đã trải nghiệm màu đen của OLED và tốc độ 0.03ms, bạn sẽ không bao giờ muốn quay lại màn hình LCD truyền thống. Trải nghiệm đua xe và bay lượn trên siêu phẩm này là độc nhất."`,
    is_new: true,
    is_sale: true,
    is_best: true,
    specs: { 'Độ phân giải': '3440 x 1440 OLED', 'Tần số quét': '175Hz', 'Độ cong': '800R' }
  },
  {
    id: 108,
    category_id: 5,
    category_name: 'Phụ Kiện Desk Setup',
    name: 'Đèn Màn Hình BenQ ScreenBar Halo Remote Wireless',
    sku: 'ACC-BENQ-HALO',
    cost_price: 2900000,
    image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80',
    price: 4200000,
    sale_price: null,
    quantity: 25,
    description: `**Verdict:** Đèn treo màn hình chống mỏi mắt hàng đầu thế giới với núm xoay remote không dây và hệ thống hắt sáng ngược Ambient Backlight.

**Best for:**
Coder, writer và gamer cày đêm muốn bảo vệ mắt, loại bỏ hoàn toàn hiện tượng phản chiếu ánh sáng lên bề mặt màn hình.

**Not recommended for:**
Người dùng màn hình quá mỏng không có viền bám hoặc bàn làm việc đã có hệ thống đèn phòng đủ sáng.

**Real gaming scenarios:**
Lý tưởng cho các buổi cày đêm muộn, cung cấp nguồn sáng dịu nhẹ tập trung vào bàn phím và mặt bàn mà không gây chói mắt hay lóa màn hình.

**Pros:**
- Remote cảm ứng dạng núm xoay wireless sang trọng, chỉnh độ sáng/nhiệt độ màu mượt mà
- Đèn hắt tường phía sau (Ambient Light) cân bằng độ chói không gian tối
- Kẹp tự điều chỉnh tương thích cả màn hình cong Ultrawide

**Cons:**
- Mức giá cao nhất trong phân khúc đèn treo màn hình
- Remote dùng 3 viên pin AAA thay vì sạc Type-C

**Expert opinion:**
"BenQ ScreenBar Halo là giải pháp ánh sáng duy nhất xử lý triệt để hiện tượng bóng gõ phím và lóa mắt khi làm việc ban đêm. Phần remote cảm ứng xoay tròn đem lại cảm giác thao tác vô cùng cao cấp."`,
    is_new: false,
    is_sale: false,
    is_best: true,
    specs: { 'Điều khiển': 'Remote Wireless Knob', 'Cảm biến': 'Tự điều chỉnh ánh sáng', 'Nguồn': 'USB 5V' }
  }
];

export const initialBanners: Banner[] = [
  {
    id: 1,
    title: 'SIÊU HỘI TECHGEAR 2026',
    subtitle: 'Nâng cấp không gian làm việc với ưu đãi đến 35% tất cả sản phẩm',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    link: '/products',
    status: 'active'
  },
  {
    id: 2,
    title: 'BÀN PHÍM CƠ CUSTOM NUPHY & KEYCHRON',
    subtitle: 'Gasket Mount cực êm, Switch gõ sướng tay cho Coder',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80',
    link: '/products?category=1',
    status: 'active'
  },
  {
    id: 3,
    title: 'TAI NGHE CHỐNG ỒN & LOA DECOR',
    subtitle: 'Thả mình vào không gian âm nhạc Hi-Fi đỉnh cao',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
    link: '/products?category=3',
    status: 'active'
  }
];

export const initialNews: NewsArticle[] = [
  {
    id: 1,
    title: 'Top 5 Bàn Phím Cơ Đáng Mua Nhất Cho Lập Trình Viên Năm 2026',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Khám phá những mẫu bàn phím cơ 75% và TKL giúp tăng tốc độ gõ code và giảm mỏi cổ tay hiệu quả.',
    content: `Khi gõ code hàng giờ liền, bàn phím cơ chất lượng cao với thiết kế Gasket Mount và Switch được lube sẵn sẽ đem lại trải nghiệm hoàn toàn khác biệt. Cùng TechGear phân tích các yếu tố hành trình phím, layout compact và khả năng custom switch.

1. Keychron Q1 Pro - Khung nhôm CNC nguyên khối, kết nối không dây Bluetooth 5.1 và mạch Hot-swap.
2. NuPhy Air75 V2 - Thiết kế Low-Profile mỏng nhẹ, thích hợp di chuyển làm việc cafe.
3. MonsGeek M1W - Giá rẻ phân khúc nhập môn nhưng có âm gõ cực ấm nịnh tai.
4. Akko MOD007 V3 - Mạch HE từ tính hỗ trợ Rapid Trigger cho gamer & coder.
5. Zoom75 SE - Siêu phẩm custom bàn phím cơ đỉnh cao giới hạn.`,
    created_at: '2026-07-20',
    author: 'Admin TechGear',
    category: 'Đánh giá Gear',
    views: 1420,
    likes: 89,
    comments_count: 3,
    tags: ['Bàn phím cơ', 'Keychron', 'NuPhy', 'Desk setup', 'Coder']
  },
  {
    id: 2,
    title: 'Hướng Dẫn Setup Góc Làm Việc Minimalist Tối Ưu Tăng 200% Sức Tập Trung',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Cách sắp xếp dây cáp ẩn, chọn đèn màn hình chống mỏi mắt và kết hợp phụ kiện không dây.',
    content: `Góc làm việc gọn gàng quyết định lớn đến sự sáng tạo. Bài viết chia sẻ bí quyết giấu dây thông minh, lựa chọn arm màn hình nâng hạ nhẹ nhàng và trang bị lót chuột da thật bền bỉ.

- Sắp xếp cáp điện: Sử dụng khay giấu dây dưới mặt bàn và ống quấn dây co giãn.
- Ánh sáng chống mỏi mắt: Trang bị đèn treo màn hình BenQ ScreenBar Halo không gây phản chiếu gương.
- Phụ kiện không dây: Chuyển sang bàn phím và chuột Bluetooth/2.4Ghz để bàn làm việc luôn sạch sẽ.`,
    created_at: '2026-07-18',
    author: 'Editor Minh',
    category: 'Hướng dẫn Setup',
    views: 980,
    likes: 64,
    comments_count: 2,
    tags: ['Setup', 'Minimalist', 'BenQ', 'Làm việc']
  },
  {
    id: 3,
    title: 'So Sánh Chi Tiết Tai Nghe Sony WH-1000XM5 vs Bose QuietComfort Ultra',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Hai gã khổng lồ âm thanh đối đầu: Mẫu tai nghe chống ồn ANC nào dành riêng cho bạn?',
    content: `Nếu bạn thường xuyên làm việc tại quán cafe hoặc văn phòng mở, tai nghe chống ồn là thiết bị không thể thiếu. Chúng tôi đã thử nghiệm thực tế mức độ triệt tiêu tiếng ồn môi trường và chất âm acoustic giữa hai siêu phẩm.

- Sony WH-1000XM5: Dải bass ấm áp, micro đàm thoại lọc gió thông minh, ứng dụng điều chỉnh EQ chi tiết.
- Bose QC Ultra: Khả năng chống ồn vô địch, đệm tai da protein siêu êm cho cảm giác đeo suốt 8 tiếng không bị ép tai.`,
    created_at: '2026-07-15',
    author: 'Editor Hoàng',
    category: 'Đánh giá Gear',
    views: 2150,
    likes: 128,
    comments_count: 4,
    tags: ['Tai nghe', 'Sony', 'Bose', 'Chống ồn ANC']
  },
  {
    id: 4,
    title: 'Giải Mã Cảm Biến Focus Pro 35K & Tần Số Polling Rate 8000Hz Trên Chuột Gaming',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Lợi thế thực sự của chuột eSports siêu nhẹ và tốc độ phản hồi 0.125ms trong các trận đấu FPS kịch tính.',
    content: `Tần số quét 8000Hz có thực sự mang lại trải nghiệm khác biệt so với 1000Hz truyền thống?
Bài viết đánh giá đo đạc bằng máy hiện sóng và màn hình 240Hz/360Hz giúp game thủ hiểu rõ gia tốc và độ mịn tâm súng khi ngắm bắn CS2 hay Valorant.`,
    created_at: '2026-08-01',
    author: 'Admin TechGear',
    category: 'Tin Công Nghệ',
    views: 850,
    likes: 45,
    comments_count: 1,
    tags: ['Chuột Gaming', 'Razer', 'FPS', '8000Hz']
  },
  {
    id: 5,
    title: 'Kinh Nghiệm Bảo Quản & Vệ Sinh Bàn Phím Cơ Đúng Cách Tại Nhà',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Các bước tháo keycap, làm sạch bụi bẩn mạch PCB và tra dầu lube switch giữ độ êm mượt trọn đời.',
    content: `Bàn phím cơ sử dụng lâu ngày sẽ bám bụi, gầu tóc và thức ăn rơi vãi. Hãy cùng chuyên gia TechGear thực hiện quy trình 4 bước làm sạch chuyên nghiệp:
1. Tháo keycap bằng Wire Keycap Puller tránh làm trầy nhựa ABS/PBT.
2. Dùng bóng xịt bụi và cọ lông mềm làm sạch khe Switch.
3. Ngâm rửa keycap bằng nước ấm xà phòng dịu nhẹ.
4. Tra dầu Lube Krytox 205g0 cho Stabilizer để loại bỏ tiếng rít cọt kẹt.`,
    created_at: '2026-08-05',
    author: 'Editor Minh',
    category: 'Kinh Nghiệm',
    views: 1120,
    likes: 76,
    comments_count: 2,
    tags: ['Bảo quản', 'Vệ sinh', 'Custom Keyboard', 'Lube Switch']
  }
];

export const initialArticleComments = [
  {
    id: 1,
    article_id: 1,
    parent_id: null,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    content: 'Đang dùng Keychron Q1 Pro gõ code React rất sướng tay. Âm gõ đầm, kết nối Bluetooth chuyển đổi nhanh giữa Macbook và PC.',
    created_at: '2026-07-21 09:15',
    likes: 12,
    is_author: false,
    replies: [
      {
        id: 2,
        article_id: 1,
        parent_id: 1,
        user_id: 1,
        user_name: 'Admin TechGear',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        content: 'Cảm ơn bạn Toàn đã chia sẻ! Q1 Pro thực sự là huyền thoại bàn phím cơ nhôm đúc cho anh em Developer.',
        created_at: '2026-07-21 10:00',
        likes: 5,
        is_author: true
      }
    ]
  },
  {
    id: 3,
    article_id: 1,
    parent_id: null,
    user_id: 2,
    user_name: 'Trần Hoài Nam',
    avatar: '',
    content: 'Mẫu NuPhy Air75 V2 mỏng nhẹ mang đi cafe làm việc tiện lắm, gõ ít mỏi cổ tay hơn phím cao.',
    created_at: '2026-07-22 14:30',
    likes: 8,
    is_author: false,
    replies: []
  },
  {
    id: 4,
    article_id: 2,
    parent_id: null,
    user_id: 3,
    user_name: 'Lê Thanh Bình',
    avatar: '',
    content: 'Đèn BenQ Halo xài buổi đêm không bị chói mắt chút nào. Đáng đồng tiền bát gạo!',
    created_at: '2026-07-19 20:00',
    likes: 15,
    is_author: false,
    replies: []
  }
];

export const initialUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn SuperAdmin', email: 'superadmin@techgear.vn', role: 'SuperAdmin', createdAt: '2026-01-01' },
  { id: 2, name: 'Lê Quản Trị (Admin)', email: 'admin@techgear.vn', role: 'Admin', createdAt: '2026-02-15' },
  { id: 3, name: 'Trần Biên Tập (Editor)', email: 'editor@techgear.vn', role: 'Editor', createdAt: '2026-03-10' },
  { id: 4, name: 'Nguyễn Minh Toàn (Khách Hàng)', email: 'khachhang@gmail.com', role: 'User', createdAt: '2026-07-01' }
];

export const initialOrders: Order[] = [
  {
    id: 1001,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    items: [
      { product_id: 101, name: 'Bàn Phím Cơ NuPhy Air75 V2 Wireless RGB', price: 2890000, quantity: 1, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
      { product_id: 103, name: 'Chuột Không Dây Logitech MX Master 3S', price: 2450000, quantity: 1, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' }
    ],
    total_amount: 5340000,
    status: 'completed',
    created_at: '2026-07-22 14:30',
    shipping_address: 'Quận 1, Thành phố Hồ Chí Minh',
    phone: '0908123456'
  },
  {
    id: 1002,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    items: [
      { product_id: 105, name: 'Tai Nghe Chống Ồn Sony WH-1000XM5', price: 7490000, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' }
    ],
    total_amount: 7490000,
    status: 'shipped',
    created_at: '2026-07-23 09:15',
    shipping_address: 'Thành phố Thủ Đức, TP. Hồ Chí Minh',
    phone: '0908123456'
  },
  {
    id: 3000,
    user_id: 4,
    user_name: 'Nguyễn Minh Toàn',
    items: [
      { product_id: 102, name: 'Bàn Phím Cơ Keychron Q1 Pro Custom Aluminum', price: 4290000, quantity: 1, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80' }
    ],
    total_amount: 4290000,
    status: 'shipped',
    created_at: '2026-08-01 10:15',
    shipping_address: 'Số 88 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    phone: '0908123456',
    note: 'Giao giờ hành chính - Giao thất bại lần 1 do không liên lạc được'
  }
];

export const initialSettings: SiteSettings = {
  logoText: 'TechGear',
  logoUrl: '',
  primaryColor: '#2563eb', // Indigo / Blue accent
  showNewProducts: true,
  showBestProducts: true,
  showSaleProducts: true,
  showNewsSection: true,
  heroTitle: 'Chúng tôi không bán mọi linh kiện. Chúng tôi giúp bạn build đúng dàn máy bạn thực sự cần.',
  heroSubtitle: 'Tư vấn cấu hình tối ưu hiệu năng/chi phí, lắp ráp thủ công chuẩn cable management, test stress-test 24h & hỗ trợ kỹ thuật trọn đời.',
  brandSettings: {
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
  },
  slogan: 'Gaming Gear & Custom Keyboards Chuyên Nghiệp - Đam Mê Bất Tận',
  founderName: 'Nguyễn Minh Toàn',
  founderRole: 'Founder & Technical Director',
  founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  founderMessage: 'Chào các bạn! Xuất thân từ đam mê gaming & custom keyboard, TechGear cam kết từng sản phẩm bán ra đều được shop kiểm tra kỹ lưỡng, dán tem bảo hành chính hãng NPP Việt Nam và hỗ trợ cân chỉnh Switch, Lube miễn phí cho khách hàng.',
  founderCommitments: [
    '100% Hàng Chính Hãng Phân Phối Việt Nam',
    'Miễn Phí Mod, Lube Switch & Tune Stabilizer',
    'Hỗ Trợ Kỹ Thuật & Đổi Trả 1-Đổi-1 Trong 30 Ngày'
  ],
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
  hotline: '1900-TECHGEAR (0908.123.456)',
  address: '123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  email: 'support@techgear.vn',
  bankName: 'MBBank',
  bankAccountNo: '0382903129',
  bankAccountName: 'TECHGEAR INC STORE',
  vietqrTemplate: 'compact2'
};
