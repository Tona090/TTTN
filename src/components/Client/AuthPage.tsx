import React, { useState } from 'react';
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

  // Social login handler
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const providerName = provider === 'facebook' ? 'Facebook' : 'Google';

    try {
      const data = await socialLoginUser(
        provider,
        provider === 'google' ? 'user.google@techgear.vn' : 'user.facebook@techgear.vn',
        provider === 'google' ? 'Google Account User' : 'Facebook Account User'
      );
      localStorage.setItem('techgear_token', data.token);
      setSuccessMessage(
        lang === 'vi' 
          ? `Đăng nhập thành công bằng ${providerName}! Khách hàng: ${data.user.name}`
          : `Successfully signed in with ${providerName}! Welcome ${data.user.name}`
      );
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
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
          
          {/* Brand Logo & Title Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-1">
              <Shield className="w-8 h-8 fill-orange-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeMode === 'register' 
                ? (lang === 'vi' ? 'Tạo Tài Khoản' : 'Sign Up')
                : (lang === 'vi' ? 'Đăng Nhập' : 'Sign In')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {activeMode === 'register'
                ? (lang === 'vi' ? 'Nhập thông tin để trải nghiệm dịch vụ tại TechGear' : 'Create an account to get started')
                : (lang === 'vi' ? 'Đăng nhập để quản lý đơn hàng & cấu hình PC' : 'Enter your email to sign in to your account')}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-2 text-xs animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Minimal Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'vi' ? 'Ví dụ: Nguyễn Văn A' : 'e.g. John Doe'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white font-medium text-xs transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'vi' ? 'Địa chỉ Email *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white font-medium text-xs transition-all"
              />
            </div>

            {activeMode !== 'otp' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'vi' ? 'Mật khẩu *' : 'Password *'}
                  </label>
                  {activeMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setActiveMode('otp')}
                      className="text-[11px] font-semibold text-orange-500 hover:underline"
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
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white font-medium text-xs transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'vi' ? 'Xác nhận mật khẩu *' : 'Confirm Password *'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-slate-900 dark:text-white font-medium text-xs transition-all"
                />
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl shadow-md transition-all uppercase tracking-wider text-xs"
            >
              {loading
                ? (lang === 'vi' ? 'ĐANG XỬ LÝ...' : 'PROCESSING...')
                : activeMode === 'register'
                ? (lang === 'vi' ? 'ĐĂNG KÝ TÀI KHOẢN' : 'SIGN UP')
                : activeMode === 'otp'
                ? (lang === 'vi' ? 'GỬI MÃ OTP VỀ EMAIL' : 'SEND OTP TO EMAIL')
                : (lang === 'vi' ? 'ĐĂNG NHẬP' : 'SIGN IN')}
            </button>

            {/* Secondary Option: One-Time Sign In Code button */}
            {activeMode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setActiveMode('otp');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="w-full py-2.5 bg-white dark:bg-slate-800 border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-extrabold rounded-xl transition-all uppercase tracking-wider text-[11px]"
              >
                {lang === 'vi' ? 'NHẬN MÃ ĐĂNG NHẬP 1 LẦN (OTP)' : 'GET ONE-TIME SIGN IN CODE'}
              </button>
            )}

            {activeMode === 'otp' && (
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="w-full py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold text-center block"
              >
                ← {lang === 'vi' ? 'Quay lại đăng nhập bằng mật khẩu' : 'Back to password sign in'}
              </button>
            )}

            {/* Help tooltip toggle for One-time code */}
            {activeMode === 'login' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowOtpHelp(!showOtpHelp)}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:underline inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <span>{lang === 'vi' ? 'Mã đăng nhập 1 lần (OTP) là gì?' : "What's the One-Time Code?"}</span>
                </button>

                {showOtpHelp && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                    {lang === 'vi'
                      ? 'Mã đăng nhập 1 lần (OTP) gửi trực tiếp về email giúp bạn đăng nhập an toàn mà không cần nhập hay nhớ mật khẩu tài khoản.'
                      : 'A One-Time Code is a temporary verification code sent directly to your email so you can log in securely without entering a password.'}
                  </div>
                )}
              </div>
            )}

            {/* Mode Switcher Link */}
            <div className="text-center pt-2 text-xs">
              {activeMode === 'register' ? (
                <span className="text-slate-600 dark:text-slate-400">
                  {lang === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => { setActiveMode('login'); setError(null); setSuccessMessage(null); }}
                    className="font-extrabold text-orange-500 hover:underline"
                  >
                    {lang === 'vi' ? 'Đăng nhập ngay' : 'Sign In'}
                  </button>
                </span>
              ) : (
                <span className="text-slate-600 dark:text-slate-400">
                  {lang === 'vi' ? 'Mới biết đến TechGear? ' : 'New to TechGear? '}
                  <button
                    type="button"
                    onClick={() => { setActiveMode('register'); setError(null); setSuccessMessage(null); }}
                    className="font-extrabold text-orange-500 hover:underline"
                  >
                    {lang === 'vi' ? 'Tạo tài khoản' : 'Sign Up'}
                  </button>
                </span>
              )}
            </div>

          </form>

          {/* Social Sign-In Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-extrabold tracking-widest">
                {lang === 'vi' ? 'HOẶC' : 'OR'}
              </span>
            </div>
          </div>

          {/* Social Buttons Stack */}
          <div className="space-y-2.5">
            
            {/* GOOGLE SIGN IN */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin('google')}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 text-xs"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{lang === 'vi' ? 'ĐĂNG NHẬP BẰNG GOOGLE' : 'SIGN IN WITH GOOGLE'}</span>
            </button>

            {/* FACEBOOK SIGN IN */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialLogin('facebook')}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 text-xs"
            >
              <svg className="w-4 h-4 flex-shrink-0 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{lang === 'vi' ? 'ĐĂNG NHẬP BẰNG FACEBOOK' : 'SIGN IN WITH FACEBOOK'}</span>
            </button>

          </div>

        </div>
      </main>

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
