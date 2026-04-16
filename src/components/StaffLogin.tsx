import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import PinPad from '@/components/PinPad';
import { CheckCircle, Clock, Coffee, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StaffLogin = () => {
  const { step, merchantName, error, clearError, clockIn, staffLogin, toggleBreak, goToClockIn, goToStaffLogin } = useAuthStore();
  const [subMode, setSubMode] = useState<'main' | 'break'>('main');
  const [breakMessage, setBreakMessage] = useState<string | null>(null);
  const [clockInMessage, setClockInMessage] = useState<string | null>(null);

  const handleClockIn = (pin: string) => {
    const success = clockIn(pin);
    if (success) {
      setClockInMessage('Clocked in successfully!');
      setTimeout(() => {
        setCockInMessage(null);
      }, 2000);
    } else {
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
        setSubMode('main');
      }, 2500);
    } else {
      setTimeout(() => clearError(), 2000);
    }
  };

  const handleBackFromBreak = () => {
    setSubMode('main');
    clearError();
    setBreakMessage(null);
  };

  // Success message overlay
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

  if (clockInMessage) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground text-center">{clockInMessage}</p>
        </div>
      </div>
    );
  }

  // Break sub-mode (shared across both steps)
  if (subMode === 'break') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div className="mb-4 text-muted-foreground text-sm">{merchantName}</div>
        <PinPad
          onSubmit={handleBreak}
          title="Break In / Out"
          subtitle="Enter your PIN to Break In or Break Out"
          error={error}
        />
        <button
          onClick={handleBackFromBreak}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  // Clock In screen (step === 'clockin')
  if (step === 'clockin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        <div className="mb-4 text-muted-foreground text-sm">{merchantName}</div>
        <PinPad
          onSubmit={handleClockIn}
          title="Clock In"
          subtitle="Enter your staff PIN to clock in"
          error={error}
        />
        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={() => goToStaffLogin()}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <LogIn className="w-4 h-4" /> Login
          </Button>
          <Button
            onClick={() => setSubMode('break')}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Coffee className="w-4 h-4" /> Break
          </Button>
        </div>
        <p className="mt-4 text-muted-foreground/60 text-xs">
          Demo PINs: 1234, 5678, 0000
        </p>
      </div>
    );
  }

  // Staff Login screen (step === 'stafflogin')
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <div className="mb-4 text-muted-foreground text-sm">{merchantName}</div>
      <PinPad
        onSubmit={handleLogin}
        title="Staff Login"
        subtitle="Enter your PIN to access the POS"
        error={error}
      />
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => goToClockIn()}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <Clock className="w-4 h-4" /> Clock In
        </Button>
      </div>
      <p className="mt-4 text-muted-foreground/60 text-xs">
        Demo PINs: 1234, 5678, 0000
      </p>
    </div>
  );
};

export default StaffLogin;
