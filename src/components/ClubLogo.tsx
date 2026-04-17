import { Martini } from 'lucide-react';

interface ClubLogoProps {
  size?: number;
  animated?: boolean;
}

/**
 * ClubLogo — circular badge with a gradient background and a martini glass icon.
 * Designed to evoke a US club / nightlife aesthetic.
 */
const ClubLogo = ({ size = 80, animated = true }: ClubLogoProps) => {
  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)] ${
        animated ? 'animate-logo-pulse' : ''
      }`}
      style={{
        width: size,
        height: size,
        background: 'var(--gradient-club)',
      }}
    >
      <Martini className="text-primary-foreground" style={{ width: size * 0.5, height: size * 0.5 }} />
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
    </div>
  );
};

export default ClubLogo;
