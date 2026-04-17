import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';
import FoodDrinkLoader from '@/components/FoodDrinkLoader';

interface PreAuthCardModalProps {
  open: boolean;
  amount: number;
  onClose: () => void;
  onAuthorized: (cardLast4: string, authCode: string) => void;
}

/**
 * Simulates the card terminal step for a pre-authorization:
 *  1) Prompt user to tap / dip / swipe (auto-progresses after a moment)
 *  2) Shows a loader while the "API call" runs
 *  3) Calls onAuthorized with card details
 */
const PreAuthCardModal = ({ open, amount, onClose, onAuthorized }: PreAuthCardModalProps) => {
  const [phase, setPhase] = useState<'waiting' | 'processing'>('waiting');

  useEffect(() => {
    if (!open) {
      setPhase('waiting');
      return;
    }

    // Simulate card read after ~1.6s
    const t1 = setTimeout(() => setPhase('processing'), 1600);
    // Simulate API auth completion after ~2.4s more
    const t2 = setTimeout(() => {
      const last4 = String(Math.floor(1000 + Math.random() * 9000));
      const authCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      onAuthorized(last4, authCode);
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, onAuthorized]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && phase === 'waiting' && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Pre-Authorization Payment
          </DialogTitle>
        </DialogHeader>

        {phase === 'waiting' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-5">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <CreditCard className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-foreground">
                Tap, Dip or Swipe Card
              </p>
              <p className="text-xs text-muted-foreground">
                Authorizing a hold of{' '}
                <span className="text-primary font-bold">${amount.toFixed(2)}</span>
              </p>
            </div>
          </div>
        ) : (
          <FoodDrinkLoader message="Authorizing pre-authorization…" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreAuthCardModal;
