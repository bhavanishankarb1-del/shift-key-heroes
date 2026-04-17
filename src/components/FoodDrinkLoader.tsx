import { Martini, Wine, Beer, Pizza, IceCreamCone, CupSoda } from 'lucide-react';

interface FoodDrinkLoaderProps {
  message?: string;
}

const items = [
  { Icon: Martini, delay: '0s', left: '10%', color: 'text-primary' },
  { Icon: Wine, delay: '0.4s', left: '28%', color: 'text-accent' },
  { Icon: Beer, delay: '0.8s', left: '46%', color: 'text-primary' },
  { Icon: Pizza, delay: '1.2s', left: '64%', color: 'text-pos-warning' },
  { Icon: CupSoda, delay: '1.6s', left: '80%', color: 'text-accent' },
  { Icon: IceCreamCone, delay: '2s', left: '92%', color: 'text-primary' },
];

const FoodDrinkLoader = ({ message = 'Processing payment…' }: FoodDrinkLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-6 w-full">
      <div className="relative w-full h-24 overflow-hidden">
        {items.map(({ Icon, delay, left, color }, i) => (
          <Icon
            key={i}
            className={`absolute bottom-2 w-8 h-8 ${color} animate-float-up`}
            style={{ left, animationDelay: delay }}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
      <p className="text-sm text-muted-foreground tracking-wide">{message}</p>
    </div>
  );
};

export default FoodDrinkLoader;
