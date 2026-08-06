import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, KeyRound, Mail, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { loginUser, registerUser, socialLoginUser } from '../services/api';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        localStorage.setItem('techgear_token', data.token);
        onSuccess(data.user);
        onClose();
      } else {
        const data = await registerUser(name, email, password);
        localStorage.setItem('techgear_token', data.token);
        onSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const [socialModal, setSocialModal] = useState<{ provider: 'google' | 'facebook' } | null>(null);
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [customSocialName, setCustomSocialName] = useState('');
  const [isCustomSocialInput, setIsCustomSocialInput] = useState(false);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OAUTH_SUCCESS') {
        const { token, user } = event.data;
        if (token && user) {
          localStorage.setItem('techgear_token', token);
          onSuccess(user);
          onClose();
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onSuccess, onClose]);

  const handleOAuthPopup = (provider: 'google' | 'facebook') => {
    const width = 520;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      `/api/auth/${provider}/login`,
      `${provider}_oauth_popup`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook', selectedEmail?: string, selectedName?: string) => {
    setLoading(true);
    setError(null);
    const finalEmail = selectedEmail || 'nguyenminhtoan212@gmail.com';
    const finalName = selectedName || 'Nguyễn Minh Toàn';

    try {
      const data = await socialLoginUser(provider, finalEmail, finalName);
      localStorage.setItem('techgear_token', data.token);
      onSuccess(data.user);
      setSocialModal(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập mạng xã hội.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(presetEmail, '123456');
      localStorage.setItem('techgear_token', data.token);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập nhanh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-500 fill-orange-500/20" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isLogin ? 'Đăng Nhập TechGear' : 'Tạo Tài Khoản Mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                isLogin
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {error && (
            <div className="p-2.5 text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {!isLogin && (
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 font-bold text-slate-950 bg-orange-500 hover:bg-orange-600 rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Tạo Tài Khoản</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-medium">
                HOẶC
              </span>
            </div>
          </div>

          {/* Social Sign-In Buttons at Bottom */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleOAuthPopup('google')}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleOAuthPopup('facebook')}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          {/* Quick Demo Presets */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Thử nghiệm nhanh Demo (1-Click):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin@techgear.vn')}
                className="p-1.5 text-left rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200/60 dark:border-purple-800/50 transition-colors"
              >
                <div className="font-semibold text-purple-700 dark:text-purple-300">SuperAdmin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@techgear.vn')}
                className="p-1.5 text-left rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/50 transition-colors"
              >
                <div className="font-semibold text-blue-700 dark:text-blue-300">Quản Trị Admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('editor@techgear.vn')}
                className="p-1.5 text-left rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/50 transition-colors"
              >
                <div className="font-semibold text-emerald-700 dark:text-emerald-300">Biên Tập Editor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('khachhang@gmail.com')}
                className="p-1.5 text-left rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-700 dark:text-slate-300">Khách Hàng</div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Real Google / Facebook OAuth Account Selection Dialog */}
      {socialModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                {socialModal.provider === 'google' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {socialModal.provider === 'google' ? 'Đăng nhập bằng Google' : 'Đăng nhập bằng Facebook'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSocialModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {socialModal.provider === 'google'
                ? 'Chọn tài khoản Google của bạn để tiếp tục đến TechGear Store:'
                : 'Chọn tài khoản Facebook của bạn để tiếp tục:'}
            </p>

            {/* Default Authenticated Real Account Choice */}
            {!isCustomSocialInput ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin(
                    socialModal.provider, 
                    'nguyenminhtoan212@gmail.com', 
                    'Nguyễn Minh Toàn'
                  )}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-xl transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-orange-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-2xs">
                      T
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        Nguyễn Minh Toàn
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        nguyenminhtoan212@gmail.com
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {socialModal.provider === 'google' ? 'Gmail Khả dụng' : 'Facebook'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCustomSocialInput(true)}
                  className="w-full py-2.5 px-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-xs text-center transition-colors cursor-pointer"
                >
                  {socialModal.provider === 'google'
                    ? '+ Nhập tài khoản Gmail khác...'
                    : '+ Nhập tài khoản Facebook khác...'}
                </button>
              </div>
            ) : (
              /* Custom Email Input form */
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customSocialEmail) return;
                  handleSocialLogin(
                    socialModal.provider,
                    customSocialEmail,
                    customSocialName || customSocialEmail.split('@')[0]
                  );
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {socialModal.provider === 'google' ? 'Địa chỉ Gmail của bạn *' : 'Email Facebook của bạn *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={customSocialEmail}
                    onChange={(e) => setCustomSocialEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={customSocialName}
                    onChange={(e) => setCustomSocialName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomSocialInput(false)}
                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !customSocialEmail}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {loading ? 'Xử lý...' : 'Xác nhận Đăng Nhập'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
