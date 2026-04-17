import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { PreAuthHold } from '@/store/preAuthStore';

interface VoidPreAuthConfirmModalProps {
  open: boolean;
  hold: PreAuthHold | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const VoidPreAuthConfirmModal = ({ open, hold, onCancel, onConfirm }: VoidPreAuthConfirmModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pos-warning">
            <AlertTriangle className="w-5 h-5" /> Pre-Authorized Tab
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-foreground leading-relaxed">
            This is a pre-authorized tab. Do you want to void the pre-authorized amount and proceed
            with cash?
          </p>

          {hold && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Held Amount</span>
                <span className="text-primary font-bold">${hold.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card</span>
                <span className="text-foreground">Visa ****{hold.cardLast4}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1 font-bold" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoidPreAuthConfirmModal;
