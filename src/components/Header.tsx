import { useAppointment } from '../context/AppointmentContext';
import { BRANCHES } from '../data/constants';
import { LogOut, Building2, User, Shield } from 'lucide-react';

export default function Header() {
  const { currentUser, currentBranch, setBranch, logout } = useAppointment();

  if (!currentUser) return null;

  return (
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Jinsoo Clinic</h1>
              <p className="text-xs text-gray-500">ระบบจัดการนัดหมาย</p>
            </div>
          </div>

          {/* Branch Selector */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">สาขา:</span>
            <div className="flex gap-1">
              {BRANCHES.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setBranch(branch.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentBranch === branch.id
                      ? branch.color === 'pink'
                        ? 'bg-pink-100 text-pink-700 border border-pink-300'
                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {currentUser.role === 'admin' ? (
                <Shield className="w-4 h-4 text-purple-500" />
              ) : (
                <User className="w-4 h-4 text-blue-500" />
              )}
              <span className="font-medium text-gray-700">{currentUser.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                currentUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {currentUser.role === 'admin' ? 'แอดมิน' : 'พนักงาน'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
