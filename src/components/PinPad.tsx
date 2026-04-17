import { useState, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { ReactNode } from 'react';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  title: string;
  subtitle?: string;
  error?: string | null;
  pinLength?: number;
  sideActions?: ReactNode;
}

const PinPad = ({ onSubmit, title, subtitle, error, pinLength = 4, sideActions }: PinPadProps) => {
  const [pin, setPin] = useState('');

  const handleKey = useCallback((key: string) => {
    setPin((prev) => {
      if (prev.length >= pinLength) return prev;
      const next = prev + key;
      if (next.length === pinLength) {
        setTimeout(() => onSubmit(next), 150);
      }
      return next;
    });
  }, [pinLength, onSubmit]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>

      {/* PIN dots */}
      <div className={`flex gap-3 ${error ? 'animate-shake' : ''}`}>
        {Array.from({ length: pinLength }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              i < pin.length
                ? 'bg-primary border-primary animate-pin-pop'
                : 'border-muted-foreground/40'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-destructive text-sm font-medium -mt-4">{error}</p>
      )}

      {/* Numpad centered, side actions floated right */}
      <div className="relative w-full flex justify-center">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="w-20 h-20 rounded-2xl bg-pos-pin-key hover:bg-pos-pin-key-hover 
                         text-foreground text-2xl font-semibold transition-all duration-150 
                         active:scale-95 select-none"
            >
              {key}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="w-20 h-20 rounded-2xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                       text-muted-foreground text-sm font-medium transition-all duration-150 
                       active:scale-95 select-none"
          >
            Clear
          </button>
          <button
            onClick={() => handleKey('0')}
            className="w-20 h-20 rounded-2xl bg-pos-pin-key hover:bg-pos-pin-key-hover 
                       text-foreground text-2xl font-semibold transition-all duration-150 
                       active:scale-95 select-none"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 rounded-2xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                       text-muted-foreground transition-all duration-150 active:scale-95 
                       select-none flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {sideActions && (
          <div className="absolute left-full ml-6 top-0 flex flex-col gap-3">
            {sideActions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinPad;
