import { create } from 'zustand';

// Demo data
const DEMO_MERCHANTS = [
  { name: 'Coffee House', password: 'coffee123' },
  { name: 'Quick Mart', password: 'mart123' },
  { name: 'Urban Bistro', password: 'bistro123' },
];

const DEMO_STAFF = [
  { name: 'Alice Johnson', pin: '1234', role: 'Manager' },
  { name: 'Bob Smith', pin: '5678', role: 'Cashier' },
  { name: 'Carol Davis', pin: '0000', role: 'Cashier' },
];

interface BreakRecord {
  staffName: string;
  onBreak: boolean;
}

interface AuthState {
  step: 'merchant' | 'clockin' | 'stafflogin' | 'dashboard';
  merchantName: string | null;
  staffName: string | null;
  staffRole: string | null;
  clockedIn: boolean;
  clockedInStaff: string[];
  error: string | null;
  breakRecords: BreakRecord[];
  loginMerchant: (name: string, password: string) => boolean;
  clockIn: (pin: string) => boolean;
  staffLogin: (pin: string) => boolean;
  staffLogout: () => void;
  toggleBreak: (pin: string) => { success: boolean; message: string; breakingIn: boolean };
  isOnBreak: (staffName: string) => boolean;
  goToClockIn: () => void;
  goToStaffLogin: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  step: 'merchant',
  merchantName: null,
  staffName: null,
  staffRole: null,
  clockedIn: false,
  clockedInStaff: [],
  error: null,
  breakRecords: [],

  loginMerchant: (name: string, password: string) => {
    const found = DEMO_MERCHANTS.find(
      (m) => m.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (!found) {
      set({ error: 'Merchant not found' });
      return false;
    }
    if (found.password !== password) {
      set({ error: 'Invalid password' });
      return false;
    }
    set({ merchantName: found.name, step: 'clockin', error: null });
    return true;
  },

  clockIn: (pin: string) => {
    const staff = DEMO_STAFF.find((s) => s.pin === pin);
    if (!staff) {
      set({ error: 'Invalid PIN' });
      return false;
    }
    const { clockedInStaff } = get();
    if (clockedInStaff.includes(staff.name)) {
      set({ error: 'Staff already clocked in, login to proceed' });
      return false;
    }
    set({
      clockedInStaff: [...clockedInStaff, staff.name],
      error: null,
    });
    return true;
  },

  staffLogin: (pin: string) => {
    const staff = DEMO_STAFF.find((s) => s.pin === pin);
    if (!staff) {
      set({ error: 'Invalid PIN' });
      return false;
    }
    const { breakRecords } = get();
    const record = breakRecords.find((r) => r.staffName === staff.name);
    if (record && record.onBreak) {
      set({ error: 'Please Break Out first to Login Back' });
      return false;
    }
    set({ staffName: staff.name, staffRole: staff.role, step: 'dashboard', error: null });
    return true;
  },

  staffLogout: () => {
    set({
      step: 'stafflogin',
      staffName: null,
      staffRole: null,
      error: null,
    });
  },

  toggleBreak: (pin: string) => {
    const staff = DEMO_STAFF.find((s) => s.pin === pin);
    if (!staff) {
      set({ error: 'Invalid PIN' });
      return { success: false, message: 'Invalid PIN', breakingIn: false };
    }
    const { breakRecords } = get();
    const record = breakRecords.find((r) => r.staffName === staff.name);
    
    if (record && record.onBreak) {
      set({
        breakRecords: breakRecords.map((r) =>
          r.staffName === staff.name ? { ...r, onBreak: false } : r
        ),
        error: null,
      });
      return { success: true, message: `${staff.name} has Broken Out successfully!`, breakingIn: false };
    } else {
      const newRecords = record
        ? breakRecords.map((r) =>
            r.staffName === staff.name ? { ...r, onBreak: true } : r
          )
        : [...breakRecords, { staffName: staff.name, onBreak: true }];
      set({ breakRecords: newRecords, error: null });
      return { success: true, message: `${staff.name} has Broken In successfully!`, breakingIn: true };
    }
  },

  isOnBreak: (staffName: string) => {
    const { breakRecords } = get();
    const record = breakRecords.find((r) => r.staffName === staffName);
    return record ? record.onBreak : false;
  },

  goToClockIn: () => set({ step: 'clockin', error: null }),
  goToStaffLogin: () => set({ step: 'stafflogin', error: null }),

  clearError: () => set({ error: null }),
}));

export { DEMO_MERCHANTS, DEMO_STAFF };
