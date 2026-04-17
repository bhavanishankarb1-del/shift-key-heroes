import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Delete } from 'lucide-react';

interface PreAuthAmountModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
}

const PreAuthAmountModal = ({ open, onCancel, onConfirm }: PreAuthAmountModalProps) => {
  const [digits, setDigits] = useState('');

  // Treat input as cents → format as dollars
  const amount = digits === '' ? 0 : parseInt(digits, 10) / 100;

  const handleKey = (k: string) => {
    setDigits((prev) => {
      if (prev.length >= 8) return prev; // max $999,999.99
      if (prev === '' && k === '0') return prev;
      return prev + k;
    });
  };

  const handleDelete = () => setDigits((p) => p.slice(0, -1));
  const handleClear = () => setDigits('');

  const handleClose = () => {
    setDigits('');
    onCancel();
  };

  const handleOk = () => {
    if (amount <= 0) return;
    onConfirm(amount);
    setDigits('');
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Enter Pre-Authorization Amount
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-2">
          {/* Amount display */}
          <div className="w-full text-center py-6 rounded-xl bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hold Amount</p>
            <p className="text-4xl font-bold text-primary tabular-nums">
              ${amount.toFixed(2)}
            </p>
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => handleKey(k)}
                className="h-14 rounded-xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                           text-foreground text-xl font-semibold transition-all duration-150
                           active:scale-95 select-none"
              >
                {k}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-14 rounded-xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                         text-muted-foreground text-sm font-medium transition-all duration-150
                         active:scale-95 select-none"
            >
              Clear
            </button>
            <button
              onClick={() => handleKey('0')}
              className="h-14 rounded-xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                         text-foreground text-xl font-semibold transition-all duration-150
                         active:scale-95 select-none"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="h-14 rounded-xl bg-pos-pin-key hover:bg-pos-pin-key-hover
                         text-muted-foreground transition-all duration-150 active:scale-95
                         select-none flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Cancel / OK */}
          <div className="flex gap-2 w-full pt-2">
            <Button variant="outline" className="flex-1 h-12" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="flex-1 h-12 font-bold" disabled={amount <= 0} onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreAuthAmountModal;
