import { useAppointment } from '../context/AppointmentContext';
import { syncFromExternalSheet } from '../services/googleSheetsApi';
import { X, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import type { Customer } from '../types';
import { useState } from 'react';

interface SheetSyncDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SheetSyncDialog({ isOpen, onClose }: SheetSyncDialogProps) {
  const { syncCustomers, lastSync } = useAppointment();
  const [sheetUrl, setSheetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState<Customer[]>([]);

  if (!isOpen) return null;

  const extractSheetId = (url: string): string | null => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const handleFetch = async () => {
    setError('');
    setSuccess('');
    setPreviewData([]);

    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      setError('URL ไม่ถูกต้อง กรุณาตรวจสอบ');
      return;
    }

    setIsLoading(true);
    try {
      const result = await syncFromExternalSheet(sheetId);
      if (result.success && result.customers) {
        const validCustomers: Customer[] = result.customers.map(c => ({
          hn: c.hn || '',
          name: c.name,
          phone: c.phone,
          visitCount: c.visitCount || 1,
          lastVisit: c.lastVisit,
          nickname: c.nickname,
          birthday: c.birthday,
          age: c.age,
          source: c.source,
          caretaker: c.caretaker,
          province: c.province,
          district: c.district,
          lineUid: c.lineUid,
          registeredDate: c.registeredDate,
        }));
        setPreviewData(validCustomers);
        setSuccess(`พบข้อมูล ${validCustomers.length} รายการ`);
      } else {
        setError(result.error || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = () => {
    if (previewData.length === 0) return;
    
    syncCustomers(previewData);
    setSuccess('ซิงค์ข้อมูลสำเร็จ!');
    setPreviewData([]);
    setSheetUrl('');
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">ซิงค์จาก Google Sheet</h2>
            {lastSync && (
              <p className="text-sm text-gray-500">
                ซิงค์ล่าสุด: {new Date(lastSync).toLocaleString('th-TH')}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              วิธีใช้งาน
            </h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>เปิด Google Sheet ที่มีข้อมูลลูกค้า</li>
              <li>คลิก "Share" แล้วตั้งค่าเป็น "Anyone with the link" (Viewer)</li>
              <li>คัดลอก URL มาวางในช่องด้านล่าง</li>
              <li>คลิก "ดึงข้อมูล" เพื่อตรวจสอบ</li>
            </ol>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Google Sheet
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
              />
              <button
                onClick={handleFetch}
                disabled={isLoading || !sheetUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                ดึงข้อมูล
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">เกิดข้อผิดพลาด</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">สำเร็จ</p>
                <p className="text-sm text-green-600">{success}</p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">ตัวอย่างข้อมูล ({previewData.length} รายการ)</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">HN</th>
                      <th className="px-3 py-2 text-left">ชื่อ</th>
                      <th className="px-3 py-2 text-left">เบอร์โทร</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewData.slice(0, 10).map((customer, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-gray-600">{customer.hn || '-'}</td>
                        <td className="px-3 py-2">{customer.name}</td>
                        <td className="px-3 py-2 text-gray-600">{customer.phone}</td>
                      </tr>
                    ))}
                    {previewData.length > 10 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-center text-gray-500">
                          และอีก {previewData.length - 10} รายการ...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSync}
                className="mt-4 w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                ซิงค์ข้อมูลเข้าระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
