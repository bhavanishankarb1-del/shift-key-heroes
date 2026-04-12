import { create } from 'zustand';

// Demo data
const DEMO_MERCHANTS = ['Coffee House', 'Quick Mart', 'Urban Bistro'];
const DEMO_STAFF = [
  { name: 'Alice Johnson', pin: '1234', role: 'Manager' },
  { name: 'Bob Smith', pin: '5678', role: 'Cashier' },
  { name: 'Carol Davis', pin: '0000', role: 'Cashier' },
];

interface AuthState {
  step: 'merchant' | 'clockin' | 'stafflogin' | 'dashboard';
  merchantName: string | null;
  staffName: string | null;
  staffRole: string | null;
  clockedIn: boolean;
  error: string | null;
  loginMerchant: (name: string) => boolean;
  clockIn: (pin: string) => boolean;
  staffLogin: (pin: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  step: 'merchant',
  merchantName: null,
  staffName: null,
  staffRole: null,
  clockedIn: false,
  error: null,

  loginMerchant: (name: string) => {
    const found = DEMO_MERCHANTS.find(
      (m) => m.toLowerCase() === name.trim().toLowerCase()
    );
    if (found) {
      set({ merchantName: found, step: 'clockin', error: null });
      return true;
    }
    set({ error: 'Merchant not found' });
    return false;
  },

  clockIn: (pin: string) => {
    const staff = DEMO_STAFF.find((s) => s.pin === pin);
    if (staff) {
      set({
        staffName: staff.name,
        staffRole: staff.role,
        clockedIn: true,
        step: 'stafflogin',
        error: null,
      });
      return true;
    }
    set({ error: 'Invalid PIN' });
    return false;
  },

  staffLogin: (pin: string) => {
    const { staffName } = get();
    const staff = DEMO_STAFF.find((s) => s.pin === pin && s.name === staffName);
    if (staff) {
      set({ step: 'dashboard', error: null });
      return true;
    }
    set({ error: 'Invalid PIN' });
    return false;
  },

  logout: () => {
    set({
      step: 'merchant',
      merchantName: null,
      staffName: null,
      staffRole: null,
      clockedIn: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export { DEMO_MERCHANTS, DEMO_STAFF };
