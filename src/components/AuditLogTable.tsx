import { useAppointment } from '../context/AppointmentContext';
import { History, User, Calendar, FileText } from 'lucide-react';

export default function AuditLogTable() {
  const { auditLogs, currentBranch } = useAppointment();
  
  const branchLogs = auditLogs.filter(log => log.branch === currentBranch).slice(0, 50);

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return { label: 'สร้าง', color: 'bg-green-100 text-green-700' };
      case 'update': return { label: 'แก้ไข', color: 'bg-blue-100 text-blue-700' };
      case 'delete': return { label: 'ลบ', color: 'bg-red-100 text-red-700' };
      case 'cancel': return { label: 'ยกเลิก', color: 'bg-gray-100 text-gray-700' };
      default: return { label: action, color: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <History className="w-5 h-5 text-pink-500" />
        <h2 className="text-lg font-bold text-gray-800">ประวัติการทำงาน</h2>
        <span className="text-sm text-gray-500">({branchLogs.length} รายการ)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันเวลา</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้กระทำ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">การกระทำ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {branchLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  ยังไม่มีประวัติการทำงาน
                </td>
              </tr>
            ) : (
              branchLogs.map((log) => {
                const action = getActionLabel(log.action);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(log.performedAt).toLocaleString('th-TH', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700">{log.performedBy}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${action.color}`}>
                        {action.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{log.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="w-3 h-3 text-gray-400" />
                        {log.details}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
