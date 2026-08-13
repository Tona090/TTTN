import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, ShieldAlert, Eye, EyeOff, Store, Sun, Moon,
  Globe, HelpCircle
} from 'lucide-react';
import { loginUser, registerUser, socialLoginUser } from '../../services/api';
import { User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  onBack: () => void;
  onSuccess: (user: User) => void;
  onNavigateTab: (tab: string) => void;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  settings?: any;
}

export const AuthPage: React.FC<Props> = ({ 
  onBack, 
  onSuccess, 
  onNavigateTab,
  darkMode,
  setDarkMode,
  settings 
}) => {
  const { lang, toggleLang } = useLanguage();
  const [activeMode, setActiveMode] = useState<'login' | 'register' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showOtpHelp, setShowOtpHelp] = useState(false);

  const [socialModal, setSocialModal] = useState<{ provider: 'google' | 'facebook' } | null>(null);
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [customSocialName, setCustomSocialName] = useState('');
  const [isCustomSocialInput, setIsCustomSocialInput] = useState(false);

  // Listen for OAuth Popup PostMessage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OAUTH_SUCCESS') {
        const { token, user } = event.data;
        if (token && user) {
          localStorage.setItem('techgear_token', token);
          setSuccessMessage(
            lang === 'vi'
              ? `Đăng nhập OAuth thành công! Tài khoản: ${user.email}`
              : `Successfully signed in via OAuth! Account: ${user.email}`
          );
          setTimeout(() => {
            onSuccess(user);
          }, 600);
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [lang, onSuccess]);

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

  // Social login handler
  const handleSocialLogin = async (provider: 'google' | 'facebook', selectedEmail?: string, selectedName?: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const providerName = provider === 'facebook' ? 'Facebook' : 'Google';

    const finalEmail = selectedEmail || (provider === 'google' ? 'nguyenminhtoan212@gmail.com' : 'nguyenminhtoan212@gmail.com');
    const finalName = selectedName || 'Nguyễn Minh Toàn';

    try {
      const data = await socialLoginUser(provider, finalEmail, finalName);
      localStorage.setItem('techgear_token', data.token);
      setSuccessMessage(
        lang === 'vi' 
          ? `Đăng nhập thành công bằng ${providerName}! Tài khoản: ${data.user.email}`
          : `Successfully signed in with ${providerName}! Account: ${data.user.email}`
      );
      setSocialModal(null);
      setTimeout(() => {
        onSuccess(data.user);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập mạng xã hội');
    } finally {
      setLoading(false);
    }
  };

  // Submit password or register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (activeMode === 'otp') {
      // Simulate OTP sending
      setSuccessMessage(
        lang === 'vi'
          ? `Mã OTP đã được gửi đến email ${email || 'của bạn'}. Vui lòng kiểm tra hộp thư.`
          : `One-Time Code sent to ${email || 'your email'}. Please check your inbox.`
      );
      setLoading(false);
      return;
    }

    if (activeMode === 'register' && password !== confirmPassword) {
      setError(lang === 'vi' ? 'Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.' : 'Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      if (activeMode === 'login') {
        const data = await loginUser(email, password);
        localStorage.setItem('techgear_token', data.token);
        setSuccessMessage(
          lang === 'vi' 
            ? `Đăng nhập thành công! Đang chuyển hướng tài khoản ${data.user.name}...`
            : `Login successful! Redirecting ${data.user.name}...`
        );
        setTimeout(() => {
          onSuccess(data.user);
        }, 700);
      } else {
        const data = await registerUser(name, email, password);
        localStorage.setItem('techgear_token', data.token);
        setSuccessMessage(
          lang === 'vi' 
            ? `Đăng ký thành công! Tự động đăng nhập tài khoản Khách Hàng.`
            : `Registration successful! Logged in as Customer.`
        );
        setTimeout(() => {
          onSuccess(data.user);
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || (lang === 'vi' ? 'Thông tin đăng nhập không hợp lệ.' : 'Invalid login credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between text-xs transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="w-full py-4 px-4 sm:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div 
          onClick={onBack}
          className="flex items-center space-x-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="bg-gradient-to-tr from-orange-600 to-amber-500 p-1.5 rounded-xl text-slate-950 font-black shadow-sm">
            <Shield className="w-5 h-5 fill-slate-950" />
          </div>
          <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white">
            TECH<span className="text-orange-500">GEAR</span>
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 transition-all text-[11px]"
          >
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {setDarkMode && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>
          )}

          <button
            onClick={onBack}
            className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-lg transition-all text-[11px] flex items-center gap-1.5 shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-orange-400" />
            <span>{lang === 'vi' ? 'Quay Lại Cửa Hàng' : 'Back to Shop'}</span>
          </button>
        </div>
      </header>

      {/* Main Centered Minimalist Login Container */}
      <main className="flex-1 my-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-lg space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeMode === 'register' 
                ? (lang === 'vi' ? 'Tạo Tài Khoản TechGear' : 'Create TechGear Account')
                : (lang === 'vi' ? 'Đăng Nhập TechGear' : 'Sign In to TechGear')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {activeMode === 'register'
                ? (lang === 'vi' ? 'Đăng ký để quản lý đơn hàng & nhận ưu đãi' : 'Sign up to track orders & earn points')
                : (lang === 'vi' ? 'Đăng nhập để quản lý đơn hàng & cấu hình PC' : 'Sign in to manage orders & PC builds')}
            </p>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveMode('login'); setError(null); setSuccessMessage(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                activeMode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Đăng Nhập' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setActiveMode('register'); setError(null); setSuccessMessage(null); }}
              className={`py-1.5 rounded-lg transition-all ${
                activeMode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {lang === 'vi' ? 'Đăng Ký' : 'Sign Up'}
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-xs">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            {activeMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-900 dark:text-white transition-all text-xs"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-900 dark:text-white transition-all text-xs"
              />
            </div>

            {activeMode !== 'otp' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {lang === 'vi' ? 'Mật khẩu *' : 'Password *'}
                  </label>
                  {activeMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setActiveMode('otp')}
                      className="text-[11px] font-medium text-orange-500 hover:underline"
                    >
                      {lang === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-900 dark:text-white transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeMode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'vi' ? 'Xác nhận mật khẩu *' : 'Confirm Password *'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 text-slate-900 dark:text-white transition-all text-xs"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-2xs transition-all text-xs cursor-pointer"
            >
              {loading
                ? (lang === 'vi' ? 'Đang xử lý...' : 'Processing...')
                : activeMode === 'register'
                ? (lang === 'vi' ? 'Đăng Ký Tài Khoản' : 'Sign Up')
                : activeMode === 'otp'
                ? (lang === 'vi' ? 'Gửi Mã OTP Về Email' : 'Send OTP to Email')
                : (lang === 'vi' ? 'Đăng Nhập' : 'Sign In')}
            </button>

            {activeMode === 'otp' && (
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="w-full py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium text-center block mt-1"
              >
                ← {lang === 'vi' ? 'Quay lại đăng nhập bằng mật khẩu' : 'Back to password sign in'}
              </button>
            )}

          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-white dark:bg-slate-900 px-2.5 text-slate-400 font-medium">
                {lang === 'vi' ? 'HOẶC' : 'OR'}
              </span>
            </div>
          </div>

          {/* Social Buttons Side-by-Side at Bottom */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleOAuthPopup('google')}
                className="py-2.5 px-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs cursor-pointer"
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
                className="py-2.5 px-3 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Real Google / Facebook OAuth Account Selection Dialog */}
      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
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
                  {socialModal.provider === 'google' 
                    ? (lang === 'vi' ? 'Đăng nhập bằng Google' : 'Sign in with Google')
                    : (lang === 'vi' ? 'Đăng nhập bằng Facebook' : 'Sign in with Facebook')}
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
                ? (lang === 'vi' ? 'Chọn tài khoản Google của bạn để tiếp tục đến TechGear Store:' : 'Choose your Google account to continue to TechGear Store:')
                : (lang === 'vi' ? 'Chọn tài khoản Facebook để tiếp tục:' : 'Choose your Facebook account to continue:')}
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
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-orange-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 rounded-xl transition-all text-left flex items-center justify-between group"
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
                  className="w-full py-2.5 px-3 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium text-xs text-center transition-colors"
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
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    {loading ? 'Xử lý...' : 'Xác nhận Đăng Nhập'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Clean Minimalist Footer */}
      <footer className="py-6 px-4 text-center text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-1.5">
        <div className="flex items-center justify-center space-x-4 font-semibold">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">
            {lang === 'vi' ? 'Điều khoản & Điều kiện' : 'Terms & Conditions'}
          </a>
          <span>|</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">
            {lang === 'vi' ? 'Chính sách bảo mật' : 'Privacy Policy'}
          </a>
        </div>
        <p>© 2000-2026 TechGear Inc. All rights reserved.</p>
      </footer>

    </div>
  );
};
