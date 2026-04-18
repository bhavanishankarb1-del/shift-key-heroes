import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap } from 'lucide-react';

interface QuickSaleSuccessModalProps {
  open: boolean;
  amount: number;
  tipAmount: number;
  onClose: () => void;
}

const QuickSaleSuccessModal = ({ open, amount, tipAmount, onClose }: QuickSaleSuccessModalProps) => {
  const total = amount + tipAmount;
  const refNo = `QS-${Date.now().toString(36).toUpperCase()}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Quick Sale Complete
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Transaction approved</p>

          <div className="w-full mt-2 space-y-2 text-sm">
            <Row label="Amount" value={`$${amount.toFixed(2)}`} />
            <Row label="Tip" value={`$${tipAmount.toFixed(2)}`} />
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span className="text-foreground">Total Charged</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <Row label="Reference" value={refNo} mono />
          </div>

          <Button className="w-full mt-3 font-bold" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`text-foreground font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
  </div>
);

export default QuickSaleSuccessModal;
