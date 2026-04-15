import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Database, Upload, Image, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

interface SavedDatafile {
  id: string;
  name: string;
  cardInfo: string;
  date: string;
}

const DEMO_SAVED: SavedDatafile[] = [
  { id: 's1', name: 'John Doe', cardInfo: 'Visa ****4242', date: '04/10/2026' },
  { id: 's2', name: 'Jane Smith', cardInfo: 'Amex ****1001', date: '04/12/2026' },
  { id: 's3', name: 'Bob Wilson', cardInfo: 'MC ****7788', date: '04/14/2026' },
];

interface DatafileModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DatafileModal = ({ open, onClose, onComplete }: DatafileModalProps) => {
  const [view, setView] = useState<'capture' | 'saved'>('capture');
  const [idFront, setIdFront] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const handleImageUpload = (setter: (v: string) => void) => {
    // Simulate file selection
    setter('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzMzMyIgcng9IjgiLz48dGV4dCB4PSIxMDAiIHk9IjY1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5JRCBJbWFnZTwvdGV4dD48L3N2Zz4=');
  };

  const handleAddAdditional = () => {
    setAdditionalImages((prev) => [
      ...prev,
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzMzMyIgcng9IjgiLz48dGV4dCB4PSIxMDAiIHk9IjY1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5MaWNlbnNlPC90ZXh0Pjwvc3ZnPg==',
    ]);
  };

  const handleSaveComplete = () => {
    onComplete();
  };

  const handleSelectSaved = () => {
    onComplete();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {showSaved ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => setShowSaved(false)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                Saved Datafiles
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              {DEMO_SAVED.map((df) => (
                <button
                  key={df.id}
                  onClick={handleSelectSaved}
                  className="w-full p-3 rounded-lg border border-border bg-card hover:bg-accent text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{df.name}</p>
                    <p className="text-xs text-muted-foreground">{df.cardInfo} · {df.date}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Customer Datafile
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Card info */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1">
                <p className="text-xs font-semibold text-foreground uppercase">Card Details</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground">John Doe</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Card</span>
                  <span className="text-foreground">Visa ****4242</span>
                </div>
              </div>

              {/* ID Front */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">ID Front Image</p>
                {idFront ? (
                  <img src={idFront} alt="ID Front" className="w-full rounded-lg border border-border" />
                ) : (
                  <button
                    onClick={() => handleImageUpload(setIdFront)}
                    className="w-full h-28 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-accent/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Capture ID Front</span>
                  </button>
                )}
              </div>

              {/* Additional */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Additional Documents</p>
                {additionalImages.map((img, i) => (
                  <img key={i} src={img} alt={`Doc ${i + 1}`} className="w-full rounded-lg border border-border" />
                ))}
                <button
                  onClick={handleAddAdditional}
                  className="w-full h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center gap-2 hover:bg-accent/50 transition-colors"
                >
                  <Image className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add License / Document</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button variant="outline" className="w-full" onClick={onClose}>
                Skip Datafile
              </Button>
              <Button variant="secondary" className="w-full gap-2" onClick={() => setShowSaved(true)}>
                <Database className="w-4 h-4" /> Use Saved Datafile
              </Button>
              <Button className="w-full gap-2 font-bold" onClick={handleSaveComplete}>
                <CheckCircle2 className="w-4 h-4" /> Save & Complete Transaction
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DatafileModal;
