import React, { useState, useEffect } from 'react';
import { Settings, Check, Save, Eye, Phone, MapPin, Mail, Landmark, QrCode, Store, Globe, UserCheck, MessageSquare, Award, Sparkles } from 'lucide-react';
import { SiteSettings } from '../../types';
import { fetchSettings, updateSettings } from '../../services/api';

interface Props {
  onSettingsUpdated?: (settings: SiteSettings) => void;
}

export const SiteSettingsManager: React.FC<Props> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      if (onSettingsUpdated) {
        onSettingsUpdated(updated);
      }
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi lưu cấu hình hệ thống');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-slate-400">Đang tải cài đặt hệ thống...</div>;
  }

  const currentBankName = settings.bankName || 'MBBank';
  const currentAccNo = settings.bankAccountNo || '0382903129';
  const currentAccName = settings.bankAccountName || 'TECHGEAR INC STORE';

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Cài Đặt Hệ Thống & Cấu Hình Shop
        </h1>
        <p className="text-slate-500">Tùy chỉnh thông tin Thương hiệu, SĐT Hotline, Địa chỉ, Tài khoản Ngân hàng nhận tiền VietQR & Giao diện Website.</p>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-500" />
          <span>Đã cập nhật thành công Cài đặt Hệ thống & Tài khoản Ngân hàng!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* 1. Brand & Logo */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Store className="w-4 h-4" />
            1. Thương Hiệu & Banner Trang Chủ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Tên Thương Hiệu (Logo Text)</label>
              <input
                type="text"
                value={settings.logoText}
                onChange={e => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                placeholder="TechGear"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Tiêu Đề Hero Banner Trang Chủ</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={e => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                placeholder="TechGear Studio - Thiết Bị Công Nghệ Cao Cấp"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Mô Tả Phụ Hero Banner</label>
            <input
              type="text"
              value={settings.heroSubtitle}
              onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              placeholder="Trải nghiệm đỉnh cao công nghệ với bàn phím cơ, chuột ergonomic..."
            />
          </div>
        </div>

        {/* 1.5 Centralized Brand Personality Settings (BrandSettings) */}
        <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-4.5 h-4.5" />
              1.5 Cấu Hình Thương Hiệu & Định Hướng PC Enthusiast (BrandSettings)
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              Chống AI Marketing Rập Khuôn
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Quản lý tập trung toàn bộ nội dung nhận diện cửa hàng, triết lý phần cứng và cam kết thực tế. Không sử dụng từ ngữ quảng cáo AI sáo rỗng.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Store className="w-3.5 h-3.5 text-indigo-500" /> Tên Cửa Hàng (Store Name)
              </label>
              <input
                type="text"
                value={settings.brandSettings?.store_name ?? settings.logoText ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    logoText: val,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      store_name: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                placeholder="TechGear Studio"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tiêu Đề Hero Homepage (homepage_heading)
              </label>
              <input
                type="text"
                value={settings.brandSettings?.homepage_heading ?? settings.heroTitle ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    heroTitle: val,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      homepage_heading: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                placeholder="Chúng tôi không bán mọi linh kiện. Chúng tôi giúp bạn build đúng dàn máy bạn thực sự cần."
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              Mô Tả Hero Homepage (homepage_description)
            </label>
            <textarea
              rows={2}
              value={settings.brandSettings?.homepage_description ?? settings.heroSubtitle ?? ''}
              onChange={e => {
                const val = e.target.value;
                setSettings(prev => prev ? ({
                  ...prev,
                  heroSubtitle: val,
                  brandSettings: {
                    ...(prev.brandSettings || {
                      store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                      homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                      product_review_style: '', customer_promise: '', community_message: ''
                    }),
                    homepage_description: val
                  }
                }) : prev);
              }}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              placeholder="Tư vấn cấu hình tối ưu hiệu năng/chi phí, lắp ráp thủ công chuẩn cable management..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Thông Điệp Nhà Sáng Lập (founder_message)
              </label>
              <textarea
                rows={3}
                value={settings.brandSettings?.founder_message ?? settings.founderMessage ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    founderMessage: val,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      founder_message: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Chúng tôi chỉ tư vấn và cung cấp những sản phẩm mà chính đội ngũ kỹ thuật TechGear sẵn sàng sử dụng hàng ngày."
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Award className="w-3.5 h-3.5 text-purple-500" /> Câu Chuyện Thương Hiệu (brand_story)
              </label>
              <textarea
                rows={3}
                value={settings.brandSettings?.brand_story ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      brand_story: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="TechGear được thành lập từ năm 2020 bởi nhóm kỹ sư và gamer nhiệt huyết tại TP.HCM..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                Triết Lý Lựa Chọn Phần Cứng (brand_philosophy)
              </label>
              <textarea
                rows={3}
                value={settings.brandSettings?.brand_philosophy ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      brand_philosophy: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Hardware được chọn dựa trên hiệu năng thực tế, độ bền bo mạch, hiệu quả tản nhiệt..."
              />
            </div>

            <div>
              <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                Quy Chuẩn Chọn Linh Kiện (hardware_selection_rule)
              </label>
              <textarea
                rows={3}
                value={settings.brandSettings?.hardware_selection_rule ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      hardware_selection_rule: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Chỉ phân phối sản phẩm chính hãng NPP Việt Nam, có tem bảo hành rõ ràng, mạch PCB dày dặn..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                Đánh Giá Sản Phẩm (product_review_style)
              </label>
              <textarea
                rows={2}
                value={settings.brandSettings?.product_review_style ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      product_review_style: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Đánh giá chân thực từ góc nhìn kỹ thuật viên: nêu rõ ưu điểm thực tế, nhược điểm cần lưu ý..."
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                Cam Kết Khách Hàng (customer_promise)
              </label>
              <textarea
                rows={2}
                value={settings.brandSettings?.customer_promise ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      customer_promise: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Đổi mới 1-đổi-1 trong 30 ngày nếu phát sinh lỗi nhà sản xuất..."
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-800 dark:text-slate-200">
                Thông Điệp Cộng Đồng (community_message)
              </label>
              <textarea
                rows={2}
                value={settings.brandSettings?.community_message ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setSettings(prev => prev ? ({
                    ...prev,
                    brandSettings: {
                      ...(prev.brandSettings || {
                        store_name: '', brand_story: '', founder_message: '', brand_philosophy: '',
                        homepage_heading: '', homepage_description: '', hardware_selection_rule: '',
                        product_review_style: '', customer_promise: '', community_message: ''
                      }),
                      community_message: val
                    }
                  }) : prev);
                }}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                placeholder="Tham gia Cộng đồng TechGear Modding & Setup..."
              />
            </div>
          </div>
        </div>

        {/* 2. Shop Contact Info */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <Phone className="w-4 h-4" />
            2. Cấu Hình Thông Tin Shop & Liên Hệ Hỗ Trợ
          </h3>
          <p className="text-[11px] text-slate-500">
            Thông tin này sẽ xuất hiện trên Footer website, trang Liên Hệ và thông tin giao dịch đơn hàng cho khách hàng.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-500" /> SĐT Hotline Hỗ Trợ
              </label>
              <input
                type="text"
                value={settings.hotline || ''}
                onChange={e => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-orange-600 dark:text-orange-400"
                placeholder="1900-TECHGEAR (0908.123.456)"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" /> Địa Chỉ Showroom / Cửa Hàng
              </label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                placeholder="123 Đường Công Nghệ, Q.1, TP.HCM"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" /> Email Hỗ Trợ Khách Hàng
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                placeholder="support@techgear.vn"
              />
            </div>
          </div>
        </div>

        {/* 3. Bank Account & VietQR Config */}
        <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Landmark className="w-4 h-4" />
            3. Tài Khoản Ngân Hàng & Mã QR Chuyển Khoản VietQR
          </h3>
          <p className="text-[11px] text-slate-500">
            Hệ thống sẽ tự động tạo mã VietQR theo chuẩn ngân hàng khi khách hàng chọn thanh toán chuyển khoản lúc checkout.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1 items-start">
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tên Ngân Hàng (Mã BIN VietQR)</label>
                  <select
                    value={currentBankName}
                    onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
                    <option value="Vietcombank">Vietcombank (Ngoại Thương Việt Nam)</option>
                    <option value="Techcombank">Techcombank (Kỹ Thương Việt Nam)</option>
                    <option value="VietinBank">VietinBank (Công Thương Việt Nam)</option>
                    <option value="BIDV">BIDV (Đầu tư & Phát triển)</option>
                    <option value="VPBank">VPBank (Thịnh Vượng)</option>
                    <option value="ACB">ACB (Á Châu)</option>
                    <option value="TPBank">TPBank (Tiên Phong)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Số Tài Khoản Nhận Tiền</label>
                  <input
                    type="text"
                    value={currentAccNo}
                    onChange={e => setSettings({ ...settings, bankAccountNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600 dark:text-blue-400 text-sm"
                    placeholder="0382903129"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tên Chủ Tài Khoản (Viết hoa không dấu)</label>
                <input
                  type="text"
                  value={currentAccName}
                  onChange={e => setSettings({ ...settings, bankAccountName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold uppercase"
                  placeholder="TECHGEAR INC STORE"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                💡 <strong>Mẹo VietQR Realtime:</strong> Khách hàng sau khi tạo đơn hàng thành công sẽ tự động nhận mã QR đã được gắn sẵn Số tiền & Nội dung chuyển khoản theo cấu hình ngân hàng trên.
              </div>
            </div>

            {/* Realtime QR Preview */}
            {(() => {
              const bankCodeMap: Record<string, string> = {
                MBBank: 'MB',
                Vietcombank: 'VCB',
                Techcombank: 'TCB',
                VietinBank: 'ICB',
                BIDV: 'BIDV',
                VPBank: 'VPB',
                ACB: 'ACB',
                TPBank: 'TPB'
              };
              const previewBankCode = bankCodeMap[currentBankName] || currentBankName;
              return (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-2">
                  <span className="font-extrabold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-blue-500" /> Xem Trước Mã VietQR
                  </span>
                  <img
                    src={`https://img.vietqr.io/image/${previewBankCode}-${currentAccNo}-compact2.png?amount=500000&addInfo=TECHGEAR%20TEST`}
                    alt="VietQR Preview"
                    className="w-36 h-36 object-contain bg-white p-2 rounded-xl border shadow-sm"
                  />
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{currentBankName}</p>
                    <p className="font-mono font-bold text-blue-600">{currentAccNo}</p>
                    <p className="uppercase font-bold text-slate-600 dark:text-slate-400">{currentAccName}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4. Section Display Toggles */}
        <div className="space-y-3 pb-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Eye className="w-4 h-4" />
            4. Bật / Ẩn Các Khối Nội Dung Trên Trang Chủ
          </h3>
          <p className="text-[11px] text-slate-500">
            Tích chọn để bật/tắt sự xuất hiện của các khối danh mục sản phẩm trên Trang chủ Khách hàng:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Sản Phẩm Mới (is_new)</span>
                <span className="text-[11px] text-slate-400">Khối danh sách sản phẩm mới vừa ra mắt</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showNewProducts}
                onChange={e => setSettings({ ...settings, showNewProducts: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Sản Phẩm Bán Chạy (is_best)</span>
                <span className="text-[11px] text-slate-400">Khối sản phẩm bán chạy nhất sàn</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showBestProducts}
                onChange={e => setSettings({ ...settings, showBestProducts: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Sản Phẩm Giảm Giá (is_sale)</span>
                <span className="text-[11px] text-slate-400">Khối Flash Sale khuyến mãi giảm giá sâu</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showSaleProducts}
                onChange={e => setSettings({ ...settings, showSaleProducts: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Khối Tin Tức & Blog</span>
                <span className="text-[11px] text-slate-400">Khối bài viết tin tức công nghệ trên trang chủ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showNewsSection}
                onChange={e => setSettings({ ...settings, showNewsSection: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 5. SEO On-Page, OpenGraph & Sitemap XML */}
        <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Globe className="w-4 h-4" />
            5. Tối Ưu SEO On-Page, OpenGraph Social & Sitemap.xml
          </h3>
          <p className="text-[11px] text-slate-500">
            Cấu hình Meta Title, Description, Keywords chuẩn SEO Google Search & ảnh hiển thị OpenGraph khi chia sẻ liên kết lên Facebook / Zalo.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block font-bold mb-1">Thẻ Meta Description Mặc Định</label>
              <textarea
                rows={2}
                value={settings.meta_description || ''}
                onChange={e => setSettings({ ...settings, meta_description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                placeholder="TechGear Studio - Chuyên Bàn phím cơ Custom, Chuột Gaming, Màn hình, Tai nghe & PC Builder enterprise..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Thẻ Meta Keywords SEO</label>
                <input
                  type="text"
                  value={settings.meta_keywords || ''}
                  onChange={e => setSettings({ ...settings, meta_keywords: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="techgear, ban phim co, chuot gaming, pc builder"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Link Ảnh OpenGraph Social Share (og:image)</label>
                <input
                  type="text"
                  value={settings.og_image || ''}
                  onChange={e => setSettings({ ...settings, og_image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-emerald-800 dark:text-emerald-300">
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs block">🔗 Sitemap XML & Robots.txt Tự Động</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">System tự động crawl tất cả danh mục, sản phẩm, bài viết để xuất file XML chuẩn Google Search Console.</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-colors"
                >
                  Xem Sitemap.xml
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-[11px] transition-colors"
                >
                  Xem Robots.txt
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang Lưu...' : 'Lưu Cài Đặt Hệ Thống & Bank'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
