import { useAppointment } from '../context/AppointmentContext';
import { isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const { appointments, customers, currentBranch } = useAppointment();
  const today = new Date();
  
  const branchAppointments = appointments.filter(a => a.branch === currentBranch);
  
  const todayAppointments = branchAppointments.filter(a => isSameDay(new Date(a.date), today));
  
  const weekAppointments = branchAppointments.filter(a => 
    isWithinInterval(new Date(a.date), { start: startOfWeek(today), end: endOfWeek(today) })
  );
  
  const monthAppointments = branchAppointments.filter(a => 
    isWithinInterval(new Date(a.date), { start: startOfMonth(today), end: endOfMonth(today) })
  );

  const pendingCount = todayAppointments.filter(a => a.status === 'new' || a.status === 'pending_reply').length;
  const confirmedCount = todayAppointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="นัดหมายวันนี้"
        value={todayAppointments.length}
        icon={<Calendar className="w-5 h-5 text-blue-600" />}
        color="bg-blue-100"
        subtitle={`${confirmedCount} ยืนยัน, ${pendingCount} รอยืนยัน`}
      />
      <StatsCard
        title="สัปดาห์นี้"
        value={weekAppointments.length}
        icon={<Clock className="w-5 h-5 text-purple-600" />}
        color="bg-purple-100"
      />
      <StatsCard
        title="เดือนนี้"
        value={monthAppointments.length}
        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        color="bg-green-100"
      />
      <StatsCard
        title="ลูกค้าทั้งหมด"
        value={customers.length}
        icon={<Users className="w-5 h-5 text-pink-600" />}
        color="bg-pink-100"
      />
    </div>
  );
}
