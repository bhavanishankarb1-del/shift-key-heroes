import { useAuthStore } from '@/store/authStore';
import PinPad from '@/components/PinPad';
import { User, CheckCircle } from 'lucide-react';

const StaffLogin = () => {
  const { merchantName, staffName, staffLogin, error, clearError } = useAuthStore();

  const handleSubmit = (pin: string) => {
    const success = staffLogin(pin);
    if (!success) {
      setTimeout(() => clearError(), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
        <span>{merchantName}</span>
      </div>
      <div className="mb-6 flex items-center gap-2 text-primary text-sm font-medium">
        <CheckCircle className="w-4 h-4" />
        <span>Clocked in as {staffName}</span>
      </div>
      <PinPad
        onSubmit={handleSubmit}
        title="Staff Login"
        subtitle="Enter your PIN again to access the POS"
        error={error}
      />
    </div>
  );
};

export default StaffLogin;
