import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { PreAuthHold } from '@/store/preAuthStore';

interface PreAuthSuccessModalProps {
  open: boolean;
  hold: PreAuthHold | null;
  onClose: () => void;
}

const PreAuthSuccessModal = ({ open, hold, onClose }: PreAuthSuccessModalProps) => {
  if (!hold) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-pos-success/15 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-pos-success" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-foreground">Pre-Authorization Successful</h2>
            <p className="text-xs text-muted-foreground">
              Funds have been temporarily held on the customer's card.
            </p>
          </div>

          <div className="w-full rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
            <Row label="Amount Held" value={`$${hold.amount.toFixed(2)}`} highlight />
            <Row label="Card" value={`Visa ****${hold.cardLast4}`} />
            <Row label="Auth Code" value={hold.authCode} />
            <Row label="Ref No." value={hold.id} />
            <Row label="Time" value={hold.createdAt} />
          </div>

          <Button className="w-full font-bold gap-2" onClick={onClose}>
            <CreditCard className="w-4 h-4" /> Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={highlight ? 'text-primary font-bold' : 'text-foreground font-medium'}>
      {value}
    </span>
  </div>
);

export default PreAuthSuccessModal;
