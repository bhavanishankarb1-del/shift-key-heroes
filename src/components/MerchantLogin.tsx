import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import ClubLogo from '@/components/ClubLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MerchantLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { loginMerchant, error, clearError } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      const success = loginMerchant(name, password);
      if (!success) {
        setTimeout(() => clearError(), 2000);
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center gap-6">
          <ClubLogo size={80} />

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Club Manager
            </h1>
            <p className="text-muted-foreground text-sm">Sign in to manage your venue</p>
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
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              className="h-14 text-center text-lg bg-muted border-border focus:ring-primary"
            />
            {error && (
              <p className="text-destructive text-sm text-center animate-shake">{error}</p>
            )}
            <Button type="submit" className="w-full h-14 text-lg font-semibold" disabled={!name.trim() || !password.trim()}>
              Continue
            </Button>
          </form>

          <p className="text-muted-foreground/60 text-xs text-center">
            Demo: Coffee House / coffee123, Quick Mart / mart123, Urban Bistro / bistro123
          </p>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
