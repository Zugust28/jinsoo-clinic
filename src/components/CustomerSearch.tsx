import { useState } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import { Search, User } from 'lucide-react';

interface CustomerSearchProps {
  onSelect: (customer: { hn: string; name: string; phone: string }) => void;
}

export default function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const { customers } = useAppointment();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.hn.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleSelect = (customer: typeof customers[0]) => {
    onSelect({ hn: customer.hn, name: customer.name, phone: customer.phone });
    setQuery(customer.name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="ค้นหาด้วย HN, ชื่อ หรือเบอร์โทร..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
        />
      </div>

      {showResults && query && filteredCustomers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.hn}
              type="button"
              onClick={() => handleSelect(customer)}
              className="w-full px-4 py-3 text-left hover:bg-pink-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{customer.name}</p>
                <p className="text-sm text-gray-500">
                  HN: {customer.hn} | {customer.phone}
                </p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {customer.visitCount} ครั้ง
              </span>
            </button>
          ))}
        </div>
      )}

      {showResults && query && filteredCustomers.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          ไม่พบลูกค้า ระบบจะสร้าง HN ใหม่ให้อัตโนมัติ
        </div>
      )}
    </div>
  );
}
