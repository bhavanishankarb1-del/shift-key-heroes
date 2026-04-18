import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import SignatureCanvas from '@/components/SignatureCanvas';

interface PreAuthSignatureModalProps {
  open: boolean;
  amount: number;
  onConfirm: (signatureDataUrl: string) => void;
}

/**
 * Signature capture for Pre-Authorization.
 * IMPORTANT: This modal is mandatory — it intentionally has NO close / cancel / back button.
 * The user must sign and confirm before proceeding.
 */
const PreAuthSignatureModal = ({ open, amount, onConfirm }: PreAuthSignatureModalProps) => {
  const [signed, setSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleSignatureChange = (has: boolean, data: string | null) => {
    setSigned(has);
    setSignatureData(data);
  };

  const handleConfirm = () => {
    if (!signed || !signatureData) return;
    onConfirm(signatureData);
    setSigned(false);
    setSignatureData(null);
  };

  return (
    <Dialog open={open}>
      <DialogPortal>
        <DialogOverlay />
        {/* Custom content WITHOUT the built-in close (X) button */}
        <DialogPrimitive.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
          )}
        >
          <div className="space-y-1">
            <DialogPrimitive.Title className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
              <ShieldCheck className="w-5 h-5 text-primary" /> Customer Signature Required
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-xs text-muted-foreground">
              Authorizing a hold of{' '}
              <span className="text-primary font-bold">${amount.toFixed(2)}</span>
            </DialogPrimitive.Description>
          </div>

          <SignatureCanvas onSignatureChange={handleSignatureChange} />

          <p className="text-[10px] text-muted-foreground leading-tight italic">
            Your signature authorizes the club to place a temporary hold of the amount above on
            your card. This signature is mandatory to complete the pre-authorization.
          </p>

          <Button
            className="w-full font-bold"
            disabled={!signed}
            onClick={handleConfirm}
            variant={signed ? 'default' : 'secondary'}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Confirm Pre-Authorization
          </Button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default PreAuthSignatureModal;
