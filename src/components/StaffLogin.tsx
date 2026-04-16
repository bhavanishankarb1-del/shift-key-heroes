import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import PinPad from '@/components/PinPad';
import { CheckCircle, Clock, Coffee, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'menu' | 'clockin' | 'login' | 'break';

const StaffLogin = () => {
  const { merchantName, error, clearError, clockIn, staffLogin, toggleBreak } = useAuthStore();
  const [mode, setMode] = useState<Mode>('menu');
  const [breakMessage, setBreakMessage] = useState<string | null>(null);

  const handleClockIn = (pin: string) => {
    const success = clockIn(pin);
    if (!success) {
      setTimeout(() => clearError(), 2000);
    }
  };

  const handleLogin = (pin: string) => {
    const success = staffLogin(pin);
    if (!success) {
      setTimeout(() => clearError(), 2000);
    }
  };

  const handleBreak = (pin: string) => {
    const result = toggleBreak(pin);
    if (result.success) {
      setBreakMessage(result.message);
      setTimeout(() => {
        setBreakMessage(null);
        setMode('menu');
      }, 2500);
    } else {
      setTimeout(() => clearError(), 2000);
    }
  };

  const handleBack = () => {
    setMode('menu');
    clearError();
    setBreakMessage(null);
  };

  if (breakMessage) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground text-center">{breakMessage}</p>
        </div>
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div className="w-full max-w-xs animate-fade-in flex flex-col items-center gap-6">
          <div className="text-center space-y-1">
            <p className="text-muted-foreground text-sm">{merchantName}</p>
            <h1 className="text-2xl font-bold text-foreground">Staff Portal</h1>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={() => setMode('clockin')}
              variant="outline"
              className="w-full h-14 text-lg font-semibold gap-3"
            >
              <Clock className="w-5 h-5" /> Clock In
            </Button>
            <Button
              onClick={() => setMode('login')}
              className="w-full h-14 text-lg font-semibold gap-3"
            >
              <LogIn className="w-5 h-5" /> Login
            </Button>
            <Button
              onClick={() => setMode('break')}
              variant="secondary"
              className="w-full h-14 text-lg font-semibold gap-3"
            >
              <Coffee className="w-5 h-5" /> Break
            </Button>
          </div>

          <p className="text-muted-foreground/60 text-xs text-center">
            Demo PINs: 1234, 5678, 0000
          </p>
        </div>
      </div>
    );
  }

  const config = {
    clockin: { title: 'Clock In', subtitle: 'Enter your staff PIN to clock in', handler: handleClockIn },
    login: { title: 'Staff Login', subtitle: 'Enter your PIN to access the POS', handler: handleLogin },
    break: { title: 'Break In / Out', subtitle: 'Enter your PIN to Break In or Break Out', handler: handleBreak },
  }[mode];

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="mb-4 text-muted-foreground text-sm">{merchantName}</div>
      <PinPad
        onSubmit={config.handler}
        title={config.title}
        subtitle={config.subtitle}
        error={error}
      />
      <button
        onClick={handleBack}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back
      </button>
    </div>
  );
};

export default StaffLogin;
