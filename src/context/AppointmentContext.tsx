import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { User, Customer, Appointment, AuditLog, AppointmentFormData, Branch } from '../types';
import { generateHN } from '../data/constants';

interface AppState {
  currentUser: User | null;
  currentBranch: Branch;
  customers: Customer[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  lastSync: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_BRANCH'; payload: Branch }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'ADD_AUDIT_LOG'; payload: AuditLog }
  | { type: 'SET_LAST_SYNC'; payload: string }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<AppState> };

const initialState: AppState = {
  currentUser: null,
  currentBranch: 'ngamwongwan',
  customers: [],
  appointments: [],
  auditLogs: [],
  lastSync: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_BRANCH':
      return { ...state, currentBranch: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c.hn === action.payload.hn ? action.payload : c),
      };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? action.payload : a),
      };
    case 'ADD_AUDIT_LOG':
      return { ...state, auditLogs: [action.payload, ...state.auditLogs] };
    case 'SET_LAST_SYNC':
      return { ...state, lastSync: action.payload };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface AppointmentContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  currentUser: User | null;
  currentBranch: Branch;
  customers: Customer[];
  appointments: Appointment[];
  auditLogs: AuditLog[];
  lastSync: string | null;
  login: (user: User) => void;
  logout: () => void;
  setBranch: (branch: Branch) => void;
  getOrCreateCustomer: (name: string, phone: string) => Customer;
  createAppointment: (data: AppointmentFormData) => Appointment;
  updateAppointment: (id: string, data: Partial<AppointmentFormData>) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  addAuditLog: (action: AuditLog['action'], appointmentId: string, customerName: string, details: string) => void;
  syncCustomers: (customers: Customer[]) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('jinsoo-clinic-data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (e) {
        console.error('Failed to parse stored data:', e);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('jinsoo-clinic-data', JSON.stringify({
      currentBranch: state.currentBranch,
      customers: state.customers,
      appointments: state.appointments,
      auditLogs: state.auditLogs,
      lastSync: state.lastSync,
    }));
  }, [state.currentBranch, state.customers, state.appointments, state.auditLogs, state.lastSync]);

  const login = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
  }, []);

  const setBranch = useCallback((branch: Branch) => {
    dispatch({ type: 'SET_BRANCH', payload: branch });
  }, []);

  const getOrCreateCustomer = useCallback((name: string, phone: string): Customer => {
    const existing = state.customers.find(c => c.phone === phone);
    if (existing) {
      const updated = {
        ...existing,
        visitCount: existing.visitCount + 1,
        lastVisit: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updated });
      return updated;
    }

    const newCustomer: Customer = {
      hn: generateHN(state.customers),
      name,
      phone,
      visitCount: 1,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
    return newCustomer;
  }, [state.customers]);

  const createAppointment = useCallback((data: AppointmentFormData): Appointment => {
    const customer = getOrCreateCustomer(data.customerName, data.phone);
    
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      hn: customer.hn,
      customerName: data.customerName,
      phone: data.phone,
      branch: data.branch,
      date: data.date,
      time: data.time,
      status: data.status,
      notes: data.notes,
      createdBy: state.currentUser?.name || 'Unknown',
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
    addAuditLog('create', appointment.id, data.customerName, `สร้างนัดหมายวันที่ ${data.date} เวลา ${data.time}`);
    
    return appointment;
  }, [state.currentUser, getOrCreateCustomer]);

  const updateAppointment = useCallback((id: string, data: Partial<AppointmentFormData>) => {
    const existing = state.appointments.find(a => a.id === id);
    if (!existing) return;

    const updated: Appointment = {
      ...existing,
      ...data,
      updatedBy: state.currentUser?.name,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
    addAuditLog('update', id, existing.customerName, `แก้ไขนัดหมาย`);
  }, [state.appointments, state.currentUser]);

  const cancelAppointment = useCallback((id: string, reason?: string) => {
    const existing = state.appointments.find(a => a.id === id);
    if (!existing) return;

    const updated: Appointment = {
      ...existing,
      status: 'cancelled',
      updatedBy: state.currentUser?.name,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
    addAuditLog('cancel', id, existing.customerName, `ยกเลิกนัดหมาย${reason ? `: ${reason}` : ''}`);
  }, [state.appointments, state.currentUser]);

  const addAuditLog = useCallback((action: AuditLog['action'], appointmentId: string, customerName: string, details: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      appointmentId,
      customerName,
      performedBy: state.currentUser?.name || 'Unknown',
      performedAt: new Date().toISOString(),
      details,
      branch: state.currentBranch,
    };
    dispatch({ type: 'ADD_AUDIT_LOG', payload: log });
  }, [state.currentUser, state.currentBranch]);

  const syncCustomers = useCallback((customers: Customer[]) => {
    const merged = [...state.customers];
    customers.forEach(newCustomer => {
      const existingIndex = merged.findIndex(c => c.hn === newCustomer.hn || c.phone === newCustomer.phone);
      if (existingIndex >= 0) {
        merged[existingIndex] = { ...merged[existingIndex], ...newCustomer };
      } else {
        merged.push(newCustomer);
      }
    });
    dispatch({ type: 'SET_CUSTOMERS', payload: merged });
    dispatch({ type: 'SET_LAST_SYNC', payload: new Date().toISOString() });
  }, [state.customers]);

  const value: AppointmentContextType = {
    state,
    dispatch,
    currentUser: state.currentUser,
    currentBranch: state.currentBranch,
    customers: state.customers,
    appointments: state.appointments,
    auditLogs: state.auditLogs,
    lastSync: state.lastSync,
    login,
    logout,
    setBranch,
    getOrCreateCustomer,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    addAuditLog,
    syncCustomers,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within AppointmentProvider');
  }
  return context;
}
