import { useState } from 'react';
// CalendarView component
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { th } from 'date-fns/locale';
import type { Appointment } from '../types';
import { STATUS_CONFIG } from '../data/constants';

interface CalendarViewProps {
  appointments: Appointment[];
  onSelectDate: (date: Date) => void;
  onAddAppointment: () => void;
}

export default function CalendarView({ appointments, onSelectDate, onAddAppointment }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy', { locale: th })}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
          >
            วันนี้
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date)}
              className={`
                min-h-[80px] p-2 rounded-lg border text-left transition-all relative
                ${isSelected ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-pink-200'}
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                ${isToday ? 'ring-2 ring-pink-400 ring-offset-1' : ''}
              `}
            >
              <span className={`text-sm font-medium ${isToday ? 'text-pink-600' : ''}`}>
                {format(date, 'd')}
              </span>
              
              {dayAppointments.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayAppointments.slice(0, 3).map((apt, i) => (
                    <div
                      key={i}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate ${STATUS_CONFIG[apt.status].bg} ${STATUS_CONFIG[apt.status].color}`}
                    >
                      {apt.time} {apt.customerName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[10px] text-gray-500 text-center">
                      +{dayAppointments.length - 3} นัด
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Button */}
      <button
        onClick={onAddAppointment}
        className="mt-4 w-full py-3 border-2 border-dashed border-pink-300 text-pink-600 rounded-xl hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        เพิ่มนัดหมายใหม่
      </button>
    </div>
  );
}
