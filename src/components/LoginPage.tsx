import { useState } from 'react';
import { USERS, PASSWORD } from '../data/constants';
import { User } from '../types';
import { useAppointment } from '../context/AppointmentContext';
import { Lock, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppointment();

  const handleLogin = () => {
    if (!selectedUser) {
      setError('กรุณาเลือกผู้ใช้งาน');
      return;
    }
    if (password !== PASSWORD) {
      setError('รหัสผ่านไม่ถูกต้อง');
      return;
    }
    login(selectedUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">J</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Jinsoo Clinic</h1>
          <p className="text-gray-500">ระบบจัดการนัดหมาย</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="inline w-4 h-4 mr-1" />
              เลือกผู้ใช้งาน
            </label>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setError('');
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedUser?.id === user.id
                      ? 'bg-pink-100 border-pink-500 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-300'
                  }`}
                >
                  {user.name}
                  <span className={`block text-xs mt-1 ${
                    user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {user.role === 'admin' ? 'แอดมิน' : 'พนักงาน'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
