import { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { STATUS_CONFIG } from '../data/constants';
import { Calendar, Clock, User, Phone, FileText, X, Save, Stethoscope } from 'lucide-react';
import type { Appointment, AppointmentFormData, AppointmentStatus } from '../types';
import CustomerSearch from './CustomerSearch';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
}

export default function AppointmentForm({ appointment, onClose, onSave }: AppointmentFormProps) {
  const { currentBranch } = useAppointment();
  const isEditing = !!appointment;

  const [formData, setFormData] = useState<AppointmentFormData>({
    customerName: appointment?.customerName || '',
    phone: appointment?.phone || '',
    branch: appointment?.branch || currentBranch,
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '09:00',
    status: appointment?.status || 'new',
    notes: appointment?.notes || '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<{ hn: string; name: string; phone: string } | null>(
    appointment ? { hn: appointment.hn, name: appointment.customerName, phone: appointment.phone } : null
  );

  const handleCustomerSelect = (customer: { hn: string; name: string; phone: string }) => {
    setSelectedCustomer(customer);
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      phone: customer.phone,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'แก้ไขนัดหมาย' : 'สร้างนัดหมายใหม่'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Search */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ค้นหาลูกค้าเก่า (HN, ชื่อ, เบอร์โทร)
              </label>
              <CustomerSearch onSelect={handleCustomerSelect} />
            </div>
          )}

          {/* Selected Customer Info */}
          {selectedCustomer && (
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-pink-800">{selectedCustomer.name}</p>
                  <p className="text-sm text-pink-600">HN: {selectedCustomer.hn}</p>
                </div>
                <span className="text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                  ลูกค้าเก่า
                </span>
              </div>
            </div>
          )}

          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline w-4 h-4 mr-1" />
                ชื่อลูกค้า *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline w-4 h-4 mr-1" />
                เบอร์โทร *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                วันที่ *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline w-4 h-4 mr-1" />
                เวลา *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Status (only when editing) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="inline w-4 h-4 mr-1" />
                สถานะ
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(STATUS_CONFIG) as AppointmentStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status })}
                    className={`p-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.status === status
                        ? `${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].color} ${STATUS_CONFIG[status].border}`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="inline w-4 h-4 mr-1" />
              หมายเหตุ
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
              placeholder="เพิ่มหมายเหตุ..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
