import { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { Plus, RefreshCw, Calendar as CalendarIcon, List, Search } from 'lucide-react';
import CalendarView from './CalendarView';
import AppointmentCard from './AppointmentCard';
import AppointmentForm from './AppointmentForm';
import StatsCards from './StatsCard';
import AuditLogTable from './AuditLogTable';
import SheetSyncDialog from './SheetSyncDialog';
import type { Appointment } from '../types';

export default function Dashboard() {
  const { appointments, currentBranch, createAppointment, updateAppointment } = useAppointment();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const branchAppointments = appointments.filter(a => a.branch === currentBranch);
  
  const filteredAppointments = branchAppointments.filter(a => {
    const matchesSearch = 
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.hn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = isSameDay(parseISO(a.date), selectedDate);
    return matchesSearch && (view === 'calendar' ? matchesDate : true);
  }).sort((a, b) => a.time.localeCompare(b.time));

  const handleSave = (data: Parameters<typeof createAppointment>[0]) => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, data);
    } else {
      createAppointment(data);
    }
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards />

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'calendar'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            ปฏิทิน
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-pink-100 text-pink-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="w-4 h-4" />
            รายการ
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา HN, ชื่อ, เบอร์โทร..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>

          {/* Sync Button */}
          <button
            onClick={() => setShowSyncDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            ซิงค์จาก Sheet
          </button>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มนัดหมาย
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar / List */}
        <div className="lg:col-span-2">
          {view === 'calendar' ? (
            <CalendarView
              appointments={branchAppointments}
              onSelectDate={setSelectedDate}
              onAddAppointment={handleAddNew}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                รายการนัดหมายทั้งหมด
              </h2>
              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">ไม่พบนัดหมาย</p>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={handleEdit}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              นัดหมายวันที่ {format(selectedDate, 'd MMMM yyyy', { locale: th })}
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAppointments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">ไม่มีนัดหมาย</p>
              ) : (
                filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEdit}
                  />
                ))
              )}
            </div>
          </div>

          {/* Audit Log */}
          <AuditLogTable />
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onClose={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
          onSave={handleSave}
        />
      )}

      <SheetSyncDialog
        isOpen={showSyncDialog}
        onClose={() => setShowSyncDialog(false)}
      />
    </div>
  );
}
