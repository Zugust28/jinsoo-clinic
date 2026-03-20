import { useAppointment } from '../context/AppointmentContext';
import type { Appointment } from '../types';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, Phone, User, Edit, Trash2, FileText } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}

export default function AppointmentCard({ appointment, onEdit }: AppointmentCardProps) {
  const { cancelAppointment } = useAppointment();

  const handleCancel = () => {
    if (confirm('ยืนยันการยกเลิกนัดหมายนี้?')) {
      cancelAppointment(appointment.id);
    }
  };

  const isCancelled = appointment.status === 'cancelled';

  return (
    <div className={`bg-white rounded-xl border-2 p-4 transition-all hover:shadow-md ${
      isCancelled ? 'border-gray-200 opacity-60' : 'border-pink-100'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-gray-800 ${isCancelled ? 'line-through' : ''}`}>
              {appointment.customerName}
            </h3>
            <p className="text-xs text-gray-500">HN: {appointment.hn}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} size="sm" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{appointment.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{appointment.time}</span>
        </div>
        {appointment.notes && (
          <div className="flex items-start gap-2 text-gray-600">
            <FileText className="w-4 h-4 mt-0.5" />
            <span className="text-xs">{appointment.notes}</span>
          </div>
        )}
      </div>

      {!isCancelled && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(appointment)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            แก้ไข
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            ยกเลิก
          </button>
        </div>
      )}
    </div>
  );
}
