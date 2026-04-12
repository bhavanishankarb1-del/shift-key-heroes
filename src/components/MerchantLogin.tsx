import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MerchantLogin = () => {
  const [name, setName] = useState('');
  const { loginMerchant, error, clearError } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const success = loginMerchant(name);
      if (!success) {
        setTimeout(() => clearError(), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Store className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
            <p className="text-muted-foreground text-sm">Enter your merchant name to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input
              type="text"
              placeholder="Merchant name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError(); }}
              className="h-14 text-center text-lg bg-muted border-border focus:ring-primary"
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm text-center animate-shake">{error}</p>
            )}
            <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={!name.trim()}>
              Continue
            </Button>
          </form>

          <p className="text-muted-foreground/60 text-xs text-center">
            Demo: Coffee House, Quick Mart, Urban Bistro
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
