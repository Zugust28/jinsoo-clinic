import type { User, Branch, AppointmentStatus } from '../types';

export const USERS: User[] = [
  { id: 'admin1', name: 'แอดมิน 1', role: 'admin' },
  { id: 'admin2', name: 'แอดมิน 2', role: 'admin' },
  { id: 'staff1', name: 'พนักงานต้อนรับ 1', role: 'staff' },
  { id: 'staff2', name: 'พนักงานต้อนรับ 2', role: 'staff' },
];

export const PASSWORD = 'jinsoo2024';

export const BRANCHES: { id: Branch; name: string; color: string }[] = [
  { id: 'ngamwongwan', name: 'งามวงศ์วาน', color: 'pink' },
  { id: 'ratchathewi', name: 'ราชเทวี', color: 'blue' },
];

export const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: 'ใหม่', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' },
  confirmed: { label: 'คอนเฟิร์ม', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  arrived: { label: 'มาถึง', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200' },
  completed: { label: 'เสร็จสิ้น', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  cancelled: { label: 'ยกเลิก', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' },
  pending_reply: { label: 'รอตอบ', color: 'text-pink-700', bg: 'bg-pink-100', border: 'border-pink-200' },
  problem: { label: 'ปัญหา', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
};

export const SERVICES = [
  { id: 'botox', name: 'ฉีดโบท็อกซ์', duration: 30 },
  { id: 'filler', name: 'ฟิลเลอร์', duration: 45 },
  { id: 'thread', name: 'ร้อยไหม', duration: 60 },
  { id: 'laser', name: 'เลเซอร์หน้าใส', duration: 45 },
  { id: 'facial', name: 'ทำหน้าขาวใส', duration: 60 },
  { id: 'eyebrow', name: 'สักคิ้ว', duration: 90 },
  { id: 'tattoo_removal', name: 'ลบรอยสัก', duration: 60 },
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

export function generateHN(existingCustomers: { hn: string }[]): string {
  const year = new Date().getFullYear();
  const existingHNs = existingCustomers
    .map(c => c.hn)
    .filter(hn => hn.startsWith(`J-${year}`));
  
  const maxNum = existingHNs.reduce((max, hn) => {
    const match = hn.match(/J-\d{4}-(\d{5})/);
    if (match) {
      return Math.max(max, parseInt(match[1], 10));
    }
    return max;
  }, 0);
  
  const nextNum = (maxNum + 1).toString().padStart(5, '0');
  return `J-${year}-${nextNum}`;
}
