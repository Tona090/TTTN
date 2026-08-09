import React, { useState } from 'react';
import { Cpu, HardDrive, Layers, Zap, ShoppingBag, Download, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle, Info, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface PcComponentOption {
  id: string;
  category: 'cpu' | 'mainboard' | 'ram' | 'vga' | 'ssd' | 'psu' | 'case' | 'cooler';
  name: string;
  brand: string;
  price: number;
  image: string;
  socket?: string; // e.g., 'LGA1700' or 'AM5'
  wattage?: number; // Estimated power draw in Watts
  specs: string;
}

// Preset Hardware Catalog for PC Configurator
const HARDWARE_CATALOG: Record<string, PcComponentOption[]> = {
  cpu: [
    { id: 'cpu-1', category: 'cpu', name: 'Intel Core i9 14900K (Up to 6.0GHz, 24 Cores 32 Threads)', brand: 'Intel', price: 15490000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', wattage: 253, specs: '24 Cores / 32 Threads, Socket LGA1700' },
    { id: 'cpu-2', category: 'cpu', name: 'Intel Core i7 14700K (Up to 5.6GHz, 20 Cores 28 Threads)', brand: 'Intel', price: 11290000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', wattage: 210, specs: '20 Cores / 28 Threads, Socket LGA1700' },
    { id: 'cpu-3', category: 'cpu', name: 'AMD Ryzen 7 7800X3D (4.2GHz~5.0GHz, 8 Cores 16 Threads, 3D V-Cache)', brand: 'AMD', price: 10490000, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80', socket: 'AM5', wattage: 120, specs: '8 Cores / 16 Threads, Socket AM5, 96MB L3 Cache' },
    { id: 'cpu-4', category: 'cpu', name: 'AMD Ryzen 9 7950X3D (Up to 5.7GHz, 16 Cores 32 Threads)', brand: 'AMD', price: 16890000, image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80', socket: 'AM5', wattage: 120, specs: '16 Cores / 32 Threads, Socket AM5' },
    { id: 'cpu-5', category: 'cpu', name: 'Intel Core i5 14400F (Up to 4.7GHz, 10 Cores 16 Threads)', brand: 'Intel', price: 5290000, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', wattage: 148, specs: '10 Cores / 16 Threads, Socket LGA1700' }
  ],
  mainboard: [
    { id: 'mb-1', category: 'mainboard', name: 'ASUS ROG MAXIMUS Z790 HERO (DDR5, WiFi 6E)', brand: 'ASUS', price: 17290000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', specs: 'Socket LGA1700, ATX, PCIe 5.0, 4x DDR5 Slots' },
    { id: 'mb-2', category: 'mainboard', name: 'MSI MAG B650 TOMAHAWK WIFI (Socket AM5, DDR5)', brand: 'MSI', price: 6290000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', socket: 'AM5', specs: 'Socket AM5, ATX, PCIe 4.0, 4x DDR5 Slots' },
    { id: 'mb-3', category: 'mainboard', name: 'GIGABYTE Z790 AORUS ELITE AX (DDR5)', brand: 'Gigabyte', price: 7890000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', specs: 'Socket LGA1700, ATX, 4x M.2 Slots' },
    { id: 'mb-4', category: 'mainboard', name: 'ASUS ROG STRIX B760-A GAMING WIFI D4', brand: 'ASUS', price: 5490000, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', socket: 'LGA1700', specs: 'Socket LGA1700, ATX White, WiFi 6' }
  ],
  ram: [
    { id: 'ram-1', category: 'ram', name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz Black', brand: 'Corsair', price: 3490000, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', wattage: 15, specs: 'DDR5 6000MHz, Dual Channel 32GB, Intel XMP 3.0' },
    { id: 'ram-2', category: 'ram', name: 'G.SKILL Trident Z5 RGB 64GB (2x32GB) DDR5 6400MHz', brand: 'G.SKILL', price: 6890000, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', wattage: 20, specs: 'DDR5 6400MHz, Dual Channel 64GB, Expo & XMP' },
    { id: 'ram-3', category: 'ram', name: 'Kingston FURY Beast RGB 16GB (2x8GB) DDR5 5600MHz', brand: 'Kingston', price: 1890000, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', wattage: 10, specs: 'DDR5 5600MHz, Dual Channel 16GB' },
    { id: 'ram-4', category: 'ram', name: 'Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 7200MHz White', brand: 'Corsair', price: 5290000, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80', wattage: 18, specs: 'DDR5 7200MHz, White Heatspreader' }
  ],
  vga: [
    { id: 'vga-1', category: 'vga', name: 'NVIDIA ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X', brand: 'ASUS', price: 54900000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', wattage: 450, specs: '24GB GDDR6X, DLSS 3, Ray Tracing Gen 3' },
    { id: 'vga-2', category: 'vga', name: 'MSI GeForce RTX 4080 SUPER 16G GAMING X SLIM', brand: 'MSI', price: 31900000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', wattage: 320, specs: '16GB GDDR6X, Tri Frozr 3 Cooling' },
    { id: 'vga-3', category: 'vga', name: 'GIGABYTE GeForce RTX 4070 Ti SUPER WINDFORCE 16G', brand: 'Gigabyte', price: 24500000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', wattage: 285, specs: '16GB GDDR6X, 3x Windforce Fans' },
    { id: 'vga-4', category: 'vga', name: 'ASUS Dual GeForce RTX 4060 Ti 8GB GDDR6 OC Edition', brand: 'ASUS', price: 11490000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', wattage: 160, specs: '8GB GDDR6, Dual Axial-tech fans' }
  ],
  ssd: [
    { id: 'ssd-1', category: 'ssd', name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD', brand: 'Samsung', price: 4890000, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80', wattage: 10, specs: 'Read 7450MB/s, Write 6900MB/s, TLC V-NAND' },
    { id: 'ssd-2', category: 'ssd', name: 'Samsung 980 PRO 1TB PCIe 4.0 NVMe M.2 SSD', brand: 'Samsung', price: 2790000, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80', wattage: 8, specs: 'Read 7000MB/s, Write 5000MB/s' },
    { id: 'ssd-3', category: 'ssd', name: 'Kingston NV2 1TB M.2 2280 PCIe 4.0 NVMe', brand: 'Kingston', price: 1690000, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80', wattage: 5, specs: 'Read 3500MB/s, Write 2100MB/s' }
  ],
  psu: [
    { id: 'psu-1', category: 'psu', name: 'Corsair RM1000x 1000W 80 Plus Gold Fully Modular', brand: 'Corsair', price: 4690000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', wattage: 1000, specs: '1000W, 80 Plus Gold, Full Modular, ATX 3.0' },
    { id: 'psu-2', category: 'psu', name: 'Seasonic Focus GX-850 850W 80 Plus Gold', brand: 'Seasonic', price: 3590000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', wattage: 850, specs: '850W, 80 Plus Gold, Full Modular' },
    { id: 'psu-3', category: 'psu', name: 'MSI MAG A750GL PCIE5 750W 80 Plus Gold', brand: 'MSI', price: 2690000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', wattage: 750, specs: '750W, 80 Plus Gold, Native 16-pin PCIe 5.0' }
  ],
  case: [
    { id: 'case-1', category: 'case', name: 'Vỏ Case Lian Li O11 Dynamic EVO Black', brand: 'Lian Li', price: 4290000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', specs: 'Mid Tower Dual Chamber, Tempered Glass' },
    { id: 'case-2', category: 'case', name: 'Vỏ Case NZXT H9 Flow Matte Black', brand: 'NZXT', price: 4590000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', specs: 'Dual Chamber Airflow, 270-degree View' },
    { id: 'case-3', category: 'case', name: 'Vỏ Case Corsair 4000D Airflow Tempered Glass Black', brand: 'Corsair', price: 2290000, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80', specs: 'Mid-Tower ATX, High Airflow Front Panel' }
  ],
  cooler: [
    { id: 'cooler-1', category: 'cooler', name: 'Tản Nhiệt Nước AIO NZXT Kraken Elite 360 RGB Black', brand: 'NZXT', price: 7890000, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', wattage: 25, specs: 'Rad 360mm, 2.36" LCD Display' },
    { id: 'cooler-2', category: 'cooler', name: 'Tản Nhiệt Khí Thermalright Peerless Assassin 120 SE', brand: 'Thermalright', price: 950000, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', wattage: 10, specs: 'Dual Tower 6 Heatpipes, 2x 120mm PWM Fan' },
    { id: 'cooler-3', category: 'cooler', name: 'Tản Nhiệt Nước AIO ASUS ROG Strix LC III 360 ARGB', brand: 'ASUS', price: 5890000, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', wattage: 20, specs: 'Rad 360mm, Gen 7 Asetek Pump' }
  ]
};

interface Props {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const PcBuilder: React.FC<Props> = ({ onAddToCart }) => {
  const { lang, t } = useLanguage();
  const [selectedBuild, setSelectedBuild] = useState<Record<string, PcComponentOption | null>>({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    ssd: null,
    psu: null,
    case: null,
    cooler: null
  });

  const [activePickerCategory, setActivePickerCategory] = useState<string | null>(null);
  const [addNotice, setAddNotice] = useState<boolean>(false);

  // Calculate total price
  const totalPrice = (Object.values(selectedBuild) as (PcComponentOption | null)[]).reduce((sum, item) => sum + (item?.price || 0), 0);

  // Calculate total estimated wattage draw
  const totalWattageDraw = (Object.values(selectedBuild) as (PcComponentOption | null)[]).reduce((sum, item) => sum + (item?.wattage || 0), 0);

  // Selected PSU capacity
  const psuCapacity = selectedBuild.psu?.wattage || 0;

  // Compatibility warning flags
  const cpuSocket = selectedBuild.cpu?.socket;
  const mainboardSocket = selectedBuild.mainboard?.socket;
  const isSocketMismatch = cpuSocket && mainboardSocket && cpuSocket !== mainboardSocket;
  const isPowerInsufficient = psuCapacity > 0 && psuCapacity < totalWattageDraw * 1.2;

  const handleSelectComponent = (category: string, item: PcComponentOption) => {
    setSelectedBuild(prev => ({ ...prev, [category]: item }));
    setActivePickerCategory(null);
  };

  const handleRemoveComponent = (category: string) => {
    setSelectedBuild(prev => ({ ...prev, [category]: null }));
  };

  const handleClearBuild = () => {
    setSelectedBuild({
      cpu: null,
      mainboard: null,
      ram: null,
      vga: null,
      ssd: null,
      psu: null,
      case: null,
      cooler: null
    });
  };

  const handleAddAllToCart = () => {
    let count = 0;
    (Object.values(selectedBuild) as (PcComponentOption | null)[]).forEach(item => {
      if (item) {
        onAddToCart({
          id: 9000 + Math.floor(Math.random() * 10000),
          category_id: 5,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 10,
          description: item.specs,
          created_at: new Date().toISOString()
        }, 1);
        count++;
      }
    });

    if (count > 0) {
      setAddNotice(true);
      setTimeout(() => setAddNotice(false), 3000);
    }
  };

  const handleExportQuotation = () => {
    let quotationText = `====================================================\n`;
    quotationText += `       BẢNG BÁO GIÁ CẤU HÌNH PC - TECHGEAR STORE    \n`;
    quotationText += `====================================================\n`;
    quotationText += `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}\n\n`;
    quotationText += `DANH SÁCH LINH KIỆN ĐÃ CHỌN:\n`;
    
    let index = 1;
    (Object.entries(selectedBuild) as [string, PcComponentOption | null][]).forEach(([key, item]) => {
      if (item) {
        quotationText += `${index}. [${key.toUpperCase()}] ${item.name}\n   -> Giá: ${formatVND(item.price)}\n`;
        index++;
      }
    });

    quotationText += `\n----------------------------------------------------\n`;
    quotationText += `TỔNG CÔNG SUẤT ĐIỆN TIÊU THỤ ƯỚC TÍNH: ~${totalWattageDraw}W\n`;
    quotationText += `TỔNG CỘNG BÁO GIÁ: ${formatVND(totalPrice)}\n`;
    quotationText += `====================================================\n`;
    quotationText += `Cảm ơn quý khách đã tin tưởng và xây dựng cấu hình tại TechGear!\n`;

    const blob = new Blob([quotationText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BaoGia_PC_TechGear_${Date.now().toString().slice(-6)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const COMPONENT_LABELS: { key: string; labelVi: string; labelEn: string; icon: any }[] = [
    { key: 'cpu', labelVi: '1. Vi Xử Lý (CPU)', labelEn: '1. Processor (CPU)', icon: Cpu },
    { key: 'mainboard', labelVi: '2. Bo Mạch Chủ (Mainboard)', labelEn: '2. Motherboard (Mainboard)', icon: Layers },
    { key: 'ram', labelVi: '3. Bộ Nhớ Trong (RAM)', labelEn: '3. Memory (RAM)', icon: Zap },
    { key: 'vga', labelVi: '4. Card Màn Hình (VGA)', labelEn: '4. Graphics Card (VGA)', icon: Sparkles },
    { key: 'ssd', labelVi: '5. Ổ Cứng SSD NVMe', labelEn: '5. NVMe SSD Storage', icon: HardDrive },
    { key: 'psu', labelVi: '6. Nguồn Máy Tính (PSU)', labelEn: '6. Power Supply (PSU)', icon: Zap },
    { key: 'case', labelVi: '7. Vỏ Case Máy Tính', labelEn: '7. PC Case', icon: Layers },
    { key: 'cooler', labelVi: '8. Tản Nhiệt CPU', labelEn: '8. CPU Cooling System', icon: RefreshCw }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2 max-w-xl z-10">
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 font-semibold text-xs rounded border border-orange-500/20 inline-flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            PC Configurator 2026
          </span>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {t('pc.title', 'CÔNG CỤ XÂY DỰNG CẤU HÌNH PC KHÔNG GIỚI HẠN')}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {t('pc.subtitle', 'Tự do tùy chọn linh kiện cao cấp, kiểm tra độ tương thích socket & điện năng tiêu thụ chuẩn xác theo chuẩn kỹ thuật.')}
          </p>
        </div>

        {/* Build Action Summary Box */}
        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 flex flex-col justify-between min-w-[280px] text-white">
          <div className="text-right border-b border-slate-700/80 pb-3 mb-3">
            <span className="text-[11px] text-slate-400 font-medium block">{t('pc.total_price', 'TỔNG BÁO GIÁ CẤU HÌNH')}</span>
            <span className="text-2xl font-bold text-orange-400 font-mono">
              {formatVND(totalPrice)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClearBuild}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
              title={t('pc.clear_build', 'Làm mới')}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportQuotation}
              disabled={totalPrice === 0}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              title="Tải Bảng Báo Giá PC (.TXT)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Báo giá</span>
            </button>
            <button
              onClick={handleAddAllToCart}
              disabled={totalPrice === 0}
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('pc.add_all_cart', 'Thêm vào giỏ hàng')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {addNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'vi' ? 'Đã thêm toàn bộ bộ linh kiện vừa chọn vào giỏ hàng thành công!' : 'All selected components added to cart successfully!'}</span>
        </div>
      )}

      {/* Compatibility Health Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Socket Checker */}
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
          isSocketMismatch
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          {isSocketMismatch ? (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
          <div>
            <span className="font-bold block text-slate-900 dark:text-slate-100">{lang === 'vi' ? 'Độ Tương Thích Socket CPU & Mainboard' : 'CPU & Mainboard Socket Compatibility'}</span>
            {isSocketMismatch ? (
              <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                {lang === 'vi' 
                  ? `Cảnh báo: CPU socket (${cpuSocket}) không tương thích với Mainboard socket (${mainboardSocket})!` 
                  : `Warning: CPU socket (${cpuSocket}) is incompatible with Motherboard socket (${mainboardSocket})!`}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {cpuSocket && mainboardSocket
                  ? (lang === 'vi' ? `An toàn: Socket ${cpuSocket} hoàn toàn tương thích.` : `Compatible: Socket ${cpuSocket} matches properly.`)
                  : (lang === 'vi' ? 'Hãy chọn CPU và Mainboard để tự động kiểm tra chân cắm.' : 'Select CPU and Motherboard to auto-check socket compatibility.')}
              </p>
            )}
          </div>
        </div>

        {/* Wattage Calculator */}
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
          isPowerInsufficient
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
        }`}>
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-bold block text-slate-900 dark:text-slate-100">
              {t('pc.total_wattage', 'Ước Tính Công Suất Điện Tiêu Thụ:')} <strong className="text-orange-600 dark:text-orange-400 font-mono">{totalWattageDraw}W</strong>
            </span>
            {isPowerInsufficient ? (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                {lang === 'vi' 
                  ? `Khuyến nghị: Công suất nguồn (${psuCapacity}W) nên đạt tối thiểu ${Math.round(totalWattageDraw * 1.25)}W để đạt hiệu suất an toàn!` 
                  : `Recommendation: PSU power (${psuCapacity}W) should be at least ${Math.round(totalWattageDraw * 1.25)}W for safe operation!`}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {psuCapacity > 0
                  ? (lang === 'vi' ? `Nguồn ${psuCapacity}W đáp ứng tốt nhu cầu ${totalWattageDraw}W tiêu thụ.` : `Power supply of ${psuCapacity}W handles ${totalWattageDraw}W draw well.`)
                  : (lang === 'vi' ? 'Hệ thống tự động tính toán tổng công suất để đề xuất bộ nguồn phù hợp.' : 'System auto-calculates total draw to recommend an adequate PSU.')}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Main Component Configurator Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex justify-between">
          <span>{lang === 'vi' ? 'Danh sách linh kiện cấu hình' : 'Configured Components List'}</span>
          <span>{lang === 'vi' ? 'Thành tiền' : 'Price'}</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {COMPONENT_LABELS.map(comp => {
            const selectedItem = selectedBuild[comp.key];
            const IconComponent = comp.icon;

            return (
              <div key={comp.key} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                
                {/* Category & Selected Item Info */}
                <div className="flex items-center space-x-3.5 flex-1">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-orange-600 dark:text-orange-400 flex-shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {selectedItem ? (
                    <div className="flex items-center space-x-3 flex-1">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-12 h-12 rounded-md object-cover border border-slate-200 dark:border-slate-700 bg-white"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                          {selectedItem.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {selectedItem.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {selectedItem.specs}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {lang === 'vi' ? comp.labelVi : comp.labelEn}
                      </h4>
                      <p className="text-[11px] text-slate-400">{lang === 'vi' ? 'Chưa chọn sản phẩm' : 'No component selected'}</p>
                    </div>
                  )}
                </div>

                {/* Price & Choose Buttons */}
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  {selectedItem ? (
                    <div className="text-right">
                      <span className="font-bold text-xs text-orange-600 dark:text-orange-400 font-mono block">
                        {formatVND(selectedItem.price)}
                      </span>
                      <button
                        onClick={() => handleRemoveComponent(comp.key)}
                        className="text-[11px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                      >
                        {lang === 'vi' ? 'Bỏ chọn' : 'Remove'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActivePickerCategory(comp.key)}
                      className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-md transition-colors shadow-2xs"
                    >
                      + {t('pc.select_component', 'Chọn linh kiện')}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Component Picker Drawer Modal */}
      {activePickerCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-xl">
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                {lang === 'vi' ? `Chọn linh kiện: ${activePickerCategory.toUpperCase()}` : `Select component: ${activePickerCategory.toUpperCase()}`}
              </h3>
              <button
                onClick={() => setActivePickerCategory(null)}
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-md text-xs font-medium transition-colors"
              >
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {(HARDWARE_CATALOG[activePickerCategory] || []).map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover border border-slate-200 dark:border-slate-700 bg-white" />
                    <div>
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">{item.brand}</span>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.specs}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-xs text-orange-600 dark:text-orange-400 font-mono block mb-1">
                      {formatVND(item.price)}
                    </span>
                    <button
                      onClick={() => handleSelectComponent(activePickerCategory, item)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-md transition-colors"
                    >
                      {lang === 'vi' ? 'Chọn' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
