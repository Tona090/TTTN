import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, Mail, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              {isLogin ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
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
                  placeholder="email@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
                <span className="text-[10px] text-slate-400">
                  Mẫu: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">123456</code> hoặc <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">admin123</code>
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
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

          {/* Quick Demo Presets */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Đăng nhập nhanh Demo (1-Click Test):
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin@techgear.vn')}
                className="p-2 text-left rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/50 transition-colors"
              >
                <div className="font-semibold text-purple-700 dark:text-purple-300">SuperAdmin</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Toàn quyền hệ thống</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@techgear.vn')}
                className="p-2 text-left rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/50 transition-colors"
              >
                <div className="font-semibold text-blue-700 dark:text-blue-300">Quản Trị (Admin)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Quản lý SP & Đơn hàng</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('editor@techgear.vn')}
                className="p-2 text-left rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 transition-colors"
              >
                <div className="font-semibold text-emerald-700 dark:text-emerald-300">Biên Tập (Editor)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Quản lý bài viết & SP</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('khachhang@gmail.com')}
                className="p-2 text-left rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <div className="font-semibold text-slate-700 dark:text-slate-300">Khách Hàng (User)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Xem SP & Mua hàng</div>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            {isLogin ? (
              <span>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </span>
            ) : (
              <span>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Đăng nhập
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
