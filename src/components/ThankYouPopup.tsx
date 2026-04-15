import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface ThankYouPopupProps {
  open: boolean;
  onClose: () => void;
}

const ThankYouPopup = ({ open, onClose }: ThankYouPopupProps) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <h2 className="text-xl font-bold text-foreground">Thank You!</h2>
          <p className="text-sm text-muted-foreground text-center">
            Transaction completed successfully.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThankYouPopup;
