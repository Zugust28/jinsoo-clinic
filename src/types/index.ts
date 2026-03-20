export type AppointmentStatus = 
  | 'new' 
  | 'confirmed' 
  | 'arrived' 
  | 'completed' 
  | 'cancelled' 
  | 'pending_reply' 
  | 'problem';

export type Branch = 'ngamwongwan' | 'ratchathewi';

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  branch?: Branch;
}

export interface Customer {
  hn: string;
  name: string;
  phone: string;
  visitCount: number;
  lastVisit?: string;
  nickname?: string;
  birthday?: string;
  age?: number;
  source?: string;
  caretaker?: string;
  province?: string;
  district?: string;
  lineUid?: string;
  registeredDate?: string;
}

export interface Appointment {
  id: string;
  hn: string;
  customerName: string;
  phone: string;
  branch: Branch;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  service?: string;
  duration?: number;
  email?: string;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'cancel';
  appointmentId: string;
  customerName: string;
  performedBy: string;
  performedAt: string;
  details: string;
  branch: Branch;
}

export interface AppointmentFormData {
  hn?: string;
  customerName: string;
  phone: string;
  branch: Branch;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}
