import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Plus, Minus, Trash2, ShoppingBag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Espresso', price: 3.5, category: 'Drinks', emoji: '☕' },
  { id: '2', name: 'Latte', price: 4.5, category: 'Drinks', emoji: '🥛' },
  { id: '3', name: 'Cappuccino', price: 4.0, category: 'Drinks', emoji: '☕' },
  { id: '4', name: 'Green Tea', price: 3.0, category: 'Drinks', emoji: '🍵' },
  { id: '5', name: 'Croissant', price: 3.0, category: 'Food', emoji: '🥐' },
  { id: '6', name: 'Muffin', price: 3.5, category: 'Food', emoji: '🧁' },
  { id: '7', name: 'Sandwich', price: 6.5, category: 'Food', emoji: '🥪' },
  { id: '8', name: 'Salad', price: 7.0, category: 'Food', emoji: '🥗' },
  { id: '9', name: 'Juice', price: 4.0, category: 'Drinks', emoji: '🧃' },
  { id: '10', name: 'Cookie', price: 2.0, category: 'Food', emoji: '🍪' },
  { id: '11', name: 'Bagel', price: 3.5, category: 'Food', emoji: '🥯' },
  { id: '12', name: 'Smoothie', price: 5.5, category: 'Drinks', emoji: '🥤' },
];

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

const POSDashboard = () => {
  const { merchantName, staffName, staffRole, logout } = useAuthStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCart([]);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{merchantName}</p>
            <p className="text-xs text-muted-foreground">{staffName} · {staffRole}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Products area */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted border-none text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 rounded-xl bg-card hover:bg-accent border border-border/50 
                           transition-all duration-150 active:scale-95 text-left flex flex-col gap-2"
              >
                <span className="text-3xl">{product.emoji}</span>
                <span className="text-sm font-medium text-foreground">{product.name}</span>
                <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cart sidebar */}
        <div className="w-72 lg:w-80 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              Cart {itemCount > 0 && <span className="text-primary">({itemCount})</span>}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center mt-8">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-destructive" /> : <Minus className="w-3 h-3 text-foreground" />}
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                      <Plus className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full h-14 text-lg font-bold"
            >
              Charge ${total.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;
