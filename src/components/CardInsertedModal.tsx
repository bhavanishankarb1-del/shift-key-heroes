import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Eye, CheckCircle } from 'lucide-react';
import SignatureCanvas from '@/components/SignatureCanvas';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CardInsertedModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  tipAmount: number;
  staffName: string;
  merchantName: string;
  onComplete: () => void;
}

const TAX_RATE = 0.08;

const CardInsertedModal = ({
  open, onClose, items, subtotal, tipAmount, staffName, merchantName, onComplete,
}: CardInsertedModalProps) => {
  const [signed, setSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [showReviewImage, setShowReviewImage] = useState(false);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + tipAmount;
  const refNo = `REF-${Date.now().toString(36).toUpperCase()}`;

  const handleSignatureChange = (has: boolean, data: string | null) => {
    setSigned(has);
    setSignatureData(data);
    if (!has) {
      setReviewed(false);
      setShowReviewImage(false);
    }
  };

  const handleDone = () => {
    // signature is locked
  };

  const handleReviewImage = () => {
    setShowReviewImage(true);
    setReviewed(true);
  };

  const handleComplete = () => {
    setSigned(false);
    setSignatureData(null);
    setReviewed(false);
    setShowReviewImage(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Card Inserted — Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Receipt */}
          <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/20">
            {/* Club details */}
            <div className="text-center border-b border-border pb-3">
              <p className="text-sm font-bold text-foreground">{merchantName}</p>
              <p className="text-xs text-muted-foreground">123 Main Street, Suite 100</p>
              <p className="text-xs text-muted-foreground">Phone: (555) 123-4567</p>
            </div>

            {/* Items */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground uppercase">Items</p>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                  <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Payment breakdown */}
            <div className="border-t border-border pt-2 space-y-1">
              <Row label="Subtotal" value={subtotal} />
              <Row label="Tax (8%)" value={tax} />
              <Row label="Tip" value={tipAmount} />
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Host details */}
            <div className="border-t border-border pt-2 space-y-1 text-xs">
              <p className="font-semibold text-foreground uppercase">Transaction Details</p>
              <Row2 label="Host" value={staffName} />
              <Row2 label="Card Type" value="Visa ****4242" />
              <Row2 label="Paid By" value="John Doe" />
              <Row2 label="Ref No." value={refNo} />
              <Row2 label="Amount Paid" value={`$${total.toFixed(2)}`} />
            </div>
          </div>

          {/* Signature panel */}
          <div className="space-y-4">
            <SignatureCanvas onSignatureChange={handleSignatureChange} />

            <p className="text-[10px] text-muted-foreground leading-tight italic">
              Your signature confirms your consent and the validity of all charges. You waive any right to contest these charges at a later date.
            </p>

            <Button
              className="w-full"
              disabled={!signed}
              onClick={handleDone}
              variant={signed ? 'default' : 'secondary'}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Done
            </Button>

            {showReviewImage && signatureData && (
              <div className="border border-border rounded-lg p-2 bg-muted/20">
                <p className="text-xs font-medium text-foreground mb-1">Signature Preview</p>
                <img src={signatureData} alt="Signature" className="w-full rounded" />
              </div>
            )}

            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={!signed}
              onClick={handleReviewImage}
            >
              <Eye className="w-4 h-4" /> Review Image
            </Button>

            <Button
              className="w-full font-bold"
              disabled={!reviewed}
              onClick={handleComplete}
            >
              Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground">${value.toFixed(2)}</span>
  </div>
);

const Row2 = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default CardInsertedModal;
