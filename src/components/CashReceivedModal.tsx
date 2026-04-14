import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Banknote, Loader2 } from 'lucide-react';

interface CashReceivedModalProps {
  open: boolean;
  onClose: () => void;
  subtotal: number;
  onComplete: () => void;
}

const TAX_RATE = 0.08;
const DISCOUNT = 0;
const OTHER_CHARGES = 0;

const CashReceivedModal = ({ open, onClose, subtotal, onComplete }: CashReceivedModalProps) => {
  const [processing, setProcessing] = useState(false);

  const tax = subtotal * TAX_RATE;
  const total = subtotal - DISCOUNT + tax + OTHER_CHARGES;

  const handleFastCash = async () => {
    setProcessing(true);
    // Simulate API calls (payment processing, receipt generation, inventory update)
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !processing && onClose()}>
      <DialogContent className="sm:max-w-md">
        {processing ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing payment…</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" /> Cash Payment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Discount" value={-DISCOUNT} />
              <Row label="Tax (8%)" value={tax} />
              <Row label="Other Charges" value={OTHER_CHARGES} />
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                <span className="text-foreground">Total Due</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1 gap-2 font-bold" onClick={handleFastCash}>
                <Zap className="w-4 h-4" /> Fast Cash
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">${value.toFixed(2)}</span>
  </div>
);

// Need to import Zap
import { Zap } from 'lucide-react';

export default CashReceivedModal;
