import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, SplitSquareHorizontal } from 'lucide-react';
import FoodDrinkLoader from '@/components/FoodDrinkLoader';

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  subtotal: number;
  onComplete: (tipAmount?: number) => void;
}

const TIP_OPTIONS = [
  { label: '15%', percent: 0.15 },
  { label: '18%', percent: 0.18 },
  { label: '20%', percent: 0.20 },
  { label: '25%', percent: 0.25 },
];

const TipModal = ({ open, onClose, subtotal, onComplete }: TipModalProps) => {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [noTip, setNoTip] = useState(false);
  const [processing, setProcessing] = useState(false);

  const tipAmount = noTip ? 0 : (selectedTip !== null ? subtotal * TIP_OPTIONS[selectedTip].percent : 0);
  const total = subtotal + tipAmount;
  const tipSelected = noTip || selectedTip !== null;

  const handleSelectTip = (index: number) => {
    setSelectedTip(index);
    setNoTip(false);
  };

  const handleNoTip = () => {
    setNoTip(true);
    setSelectedTip(null);
  };

  const handleSignAndComplete = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    onComplete(tipAmount);
  };

  const handleClose = () => {
    if (processing) return;
    setSelectedTip(null);
    setNoTip(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {processing ? (
          <FoodDrinkLoader message="Processing credit payment…" />
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Add a Tip
                </DialogTitle>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <SplitSquareHorizontal className="w-3.5 h-3.5" /> Split Payment
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Bill Amount</p>
                <p className="text-2xl font-bold text-foreground">${subtotal.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TIP_OPTIONS.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectTip(i)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedTip === i
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border bg-card hover:bg-accent'
                    }`}
                  >
                    <p className="text-lg font-bold text-foreground">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">${(subtotal * opt.percent).toFixed(2)}</p>
                  </button>
                ))}
              </div>

              <Button
                variant={noTip ? 'default' : 'outline'}
                className="w-full"
                onClick={handleNoTip}
              >
                No Tip
              </Button>

              {tipSelected && (
                <div className="border-t border-border pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tip</span>
                    <span className="text-foreground font-medium">${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2 font-bold"
                disabled={!tipSelected}
                onClick={handleSignAndComplete}
              >
                Sign & Complete
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TipModal;
