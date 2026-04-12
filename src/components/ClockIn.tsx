import { useAuthStore } from '@/store/authStore';
import PinPad from '@/components/PinPad';
import { Clock } from 'lucide-react';

const ClockIn = () => {
  const { merchantName, clockIn, error, clearError } = useAuthStore();

  const handleSubmit = (pin: string) => {
    const success = clockIn(pin);
    if (!success) {
      setTimeout(() => clearError(), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
        <Clock className="w-4 h-4" />
        <span>{merchantName}</span>
      </div>
      <PinPad
        onSubmit={handleSubmit}
        title="Clock In"
        subtitle="Enter your staff PIN to clock in"
        error={error}
      />
      <p className="mt-8 text-muted-foreground/60 text-xs">
        Demo PINs: 1234, 5678, 0000
      </p>
    </div>
  );
};

export default ClockIn;
