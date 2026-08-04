import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ShieldCheck, Users, X } from 'lucide-react';
import { User, Role } from '../../types';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/api';

interface Props {
  currentUser: User | null;
}

export const UserManager: React.FC<Props> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const canManage = currentUser && ['SuperAdmin', 'Admin'].includes(currentUser.role);

  if (!canManage) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Không có quyền hạn Quản lý Người dùng</h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Tài khoản của bạn có vai trò <strong>{currentUser?.role}</strong>. Chỉ có <strong>SuperAdmin</strong> và <strong>Admin</strong> mới được phép xem, thêm, sửa, hoặc phân quyền tài khoản.
        </p>
      </div>
    );
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('User');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('User');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { name, email, password, role });
      } else {
        await createUser({ name, email, password, role });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Lỗi quản lý tài khoản');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xóa tài khoản người dùng này?')) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa tài khoản');
      }
    }
  };

  const getRoleBadge = (r: Role) => {
    switch (r) {
      case 'SuperAdmin':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold rounded">SuperAdmin</span>;
      case 'Admin':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold rounded">Admin</span>;
      case 'Editor':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold rounded">Editor</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold rounded">Khách hàng</span>;
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Quản Lý Người Dùng & Phân Quyền (CRUD)</h1>
          <p className="text-slate-500">Phân quyền SuperAdmin, Admin, Editor và Khách hàng.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người Dùng Mới</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Họ và Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Vai Trò</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">Đang tải tài khoản...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold">#{u.id}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                <td className="p-3 text-slate-500">{u.email}</td>
                <td className="p-3">{getRoleBadge(u.role)}</td>
                <td className="p-3 text-slate-400">{u.createdAt || '---'}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleOpenEdit(u)} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{editingUser ? 'Cập Nhật Tài Khoản' : 'Thêm Người Dùng'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">
                  Mật khẩu {editingUser ? '(Để trống nếu không đổi)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Phân quyền (Role)</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="User">Khách hàng (User)</option>
                  <option value="Editor">Biên tập viên (Editor)</option>
                  <option value="Admin">Quản trị viên (Admin)</option>
                  {currentUser?.role === 'SuperAdmin' && (
                    <option value="SuperAdmin">Quản trị tối cao (SuperAdmin)</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl">Lưu Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
