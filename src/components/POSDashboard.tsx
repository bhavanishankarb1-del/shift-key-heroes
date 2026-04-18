import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePreAuthStore } from '@/store/preAuthStore';
import { LogOut, Plus, Minus, Trash2, ShoppingBag, Search, CreditCard, Zap, Database, List, Banknote, ChevronDown, ShieldCheck } from 'lucide-react';
import { PreAuthHold } from '@/store/preAuthStore';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CashReceivedModal from '@/components/CashReceivedModal';
import TipModal from '@/components/TipModal';
import CardInsertedModal from '@/components/CardInsertedModal';
import ThankYouPopup from '@/components/ThankYouPopup';
import DatafileModal from '@/components/DatafileModal';
import PreAuthAmountModal from '@/components/PreAuthAmountModal';
import PreAuthCardModal from '@/components/PreAuthCardModal';
import PreAuthSuccessModal from '@/components/PreAuthSuccessModal';
import PreAuthSignatureModal from '@/components/PreAuthSignatureModal';
import VoidPreAuthConfirmModal from '@/components/VoidPreAuthConfirmModal';
import { toast } from 'sonner';
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

interface OpenTab {
  id: string;
  name: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  preAuth?: PreAuthHold;
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

const DEMO_OPEN_TABS: OpenTab[] = [
  { id: 'tab1', name: 'Table 3', items: [{ ...PRODUCTS[0], quantity: 2 }, { ...PRODUCTS[4], quantity: 1 }], total: 10.0, createdAt: '10:30 AM' },
  { id: 'tab2', name: 'Bar - John', items: [{ ...PRODUCTS[1], quantity: 1 }, { ...PRODUCTS[8], quantity: 2 }], total: 12.5, createdAt: '11:15 AM' },
  { id: 'tab3', name: 'Table 7', items: [{ ...PRODUCTS[6], quantity: 2 }], total: 13.0, createdAt: '12:00 PM' },
];

const POSDashboard = () => {
  const { merchantName, staffName, staffRole, staffLogout } = useAuthStore();
  const { activeHold, setHold, voidHold, clearHold } = usePreAuthStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showOpenTabs, setShowOpenTabs] = useState(false);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>(DEMO_OPEN_TABS);
  const [tabCounter, setTabCounter] = useState(4);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCardInserted, setShowCardInserted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showDatafile, setShowDatafile] = useState(false);
  const [currentTipAmount, setCurrentTipAmount] = useState(0);
  const [creditCheckoutItems, setCreditCheckoutItems] = useState<CartItem[]>([]);
  const [creditCheckoutTotal, setCreditCheckoutTotal] = useState(0);

  // Pre-Authorization flow state
  const [showPreAuthAmount, setShowPreAuthAmount] = useState(false);
  const [showPreAuthCard, setShowPreAuthCard] = useState(false);
  const [showPreAuthSignature, setShowPreAuthSignature] = useState(false);
  const [showPreAuthSuccess, setShowPreAuthSuccess] = useState(false);
  const [preAuthAmount, setPreAuthAmount] = useState(0);
  const [pendingPreAuth, setPendingPreAuth] = useState<{ cardLast4: string; authCode: string } | null>(null);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [voidTabId, setVoidTabId] = useState<string | null>(null);

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

  const handleNewOrder = () => {
    if (cart.length === 0) return;
    if (editingTabId) {
      setOpenTabs((prev) =>
        prev.map((t) =>
          t.id === editingTabId ? { ...t, items: [...cart], total } : t
        )
      );
      setEditingTabId(null);
      setCart([]);
      return;
    }
    const newTab: OpenTab = {
      id: `tab${tabCounter}`,
      name: `Order #${tabCounter}`,
      items: [...cart],
      total,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setOpenTabs((prev) => [...prev, newTab]);
    setTabCounter((c) => c + 1);
    setCart([]);
  };

  const handleCheckout = (method: 'cash' | 'credit') => {
    if (cart.length === 0) return;
    if (method === 'cash') {
      setShowCashModal(true);
      return;
    }
    // Credit flow: save cart state for receipt, show tip modal
    setCreditCheckoutItems([...cart]);
    setCreditCheckoutTotal(total);
    setShowTipModal(true);
  };

  // ----- Pre-Authorization handlers -----
  const handleOpenPreAuth = () => {
    if (activeHold) {
      toast.info(`Active pre-auth of $${activeHold.amount.toFixed(2)} already on file.`);
      return;
    }
    setShowPreAuthAmount(true);
  };

  const handlePreAuthAmountConfirm = (amount: number) => {
    setPreAuthAmount(amount);
    setShowPreAuthAmount(false);
    setShowPreAuthCard(true);
  };

  const handlePreAuthAuthorized = (cardLast4: string, authCode: string) => {
    setPendingPreAuth({ cardLast4, authCode });
    setShowPreAuthCard(false);
    setShowPreAuthSignature(true);
  };

  const handlePreAuthSignatureConfirm = (_signatureDataUrl: string) => {
    if (!pendingPreAuth) return;
    const hold: PreAuthHold = {
      id: `PA-${Date.now().toString(36).toUpperCase()}`,
      amount: preAuthAmount,
      cardLast4: pendingPreAuth.cardLast4,
      authCode: pendingPreAuth.authCode,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHold(hold);
    // Create an open tab representing the pre-authorized hold
    const newTab: OpenTab = {
      id: `tab${tabCounter}`,
      name: `Pre-Auth #${tabCounter}`,
      items: [],
      total: preAuthAmount,
      createdAt: hold.createdAt,
      preAuth: hold,
    };
    setOpenTabs((prev) => [...prev, newTab]);
    setTabCounter((c) => c + 1);
    setPendingPreAuth(null);
    setShowPreAuthSignature(false);
    setShowPreAuthSuccess(true);
  };

  const handlePreAuthSuccessClose = () => {
    setShowPreAuthSuccess(false);
    setPreAuthAmount(0);
    clearHold();
  };

  const handleVoidConfirm = () => {
    voidHold();
    if (voidTabId) {
      setOpenTabs((prev) => prev.filter((t) => t.id !== voidTabId));
      setVoidTabId(null);
    }
    setShowVoidConfirm(false);
    toast.success('Pre-authorization voided. Amount released to customer.');
  };

  // Credit completion: if a pre-auth covers it, "release remainder" instead
  const completeCreditWithPreAuth = () => {
    if (activeHold) {
      const remainder = activeHold.amount - (creditCheckoutTotal * 1.08 + currentTipAmount);
      if (remainder > 0) {
        toast.success(`Pre-auth settled. $${remainder.toFixed(2)} released back to customer.`);
      } else {
        toast.success('Pre-auth settled in full.');
      }
      clearHold();
    }
  };

  const handleTipComplete = () => {
    // Tip selected & processed → show card inserted / receipt modal
    setShowTipModal(false);
    setShowCardInserted(true);
  };

  const handleCardInsertedComplete = () => {
    setShowCardInserted(false);
    setShowThankYou(true);
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    setShowDatafile(true);
  };

  const handleDatafileComplete = () => {
    setShowDatafile(false);
    // Settle pre-auth (release remainder) on credit close
    completeCreditWithPreAuth();
    // Complete the transaction
    if (editingTabId) {
      setOpenTabs((prev) => prev.filter((t) => t.id !== editingTabId));
      setEditingTabId(null);
    }
    setCart([]);
    setCreditCheckoutItems([]);
    setCreditCheckoutTotal(0);
    setCurrentTipAmount(0);
  };

  const completeCheckout = () => {
    if (editingTabId) {
      setOpenTabs((prev) => prev.filter((t) => t.id !== editingTabId));
      setEditingTabId(null);
    }
    setCart([]);
    setShowCashModal(false);
  };

  const handleTabAction = (tabId: string, action: 'cash' | 'credit' | 'add-items') => {
    const tab = openTabs.find((t) => t.id === tabId);
    if (!tab) return;
    if (action === 'add-items') {
      setCart([...tab.items]);
      setEditingTabId(tabId);
      setShowOpenTabs(false);
    } else if (action === 'cash' && tab.preAuth) {
      // Cash on a pre-auth tab → confirm void first
      setVoidTabId(tabId);
      setShowVoidConfirm(true);
    } else {
      setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
      toast.success(`Tab "${tab.name}" closed.`);
    }
  };

  const SUB_MENU = [
    { label: 'Pre-Authorization', icon: CreditCard },
    { label: 'Quick Sale', icon: Zap },
    { label: 'Datafile', icon: Database },
  ];

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
        <Button variant="ghost" size="sm" onClick={staffLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </header>

      {/* Sub Menu */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
        {SUB_MENU.map((item) => (
          <Button
            key={item.label}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              if (item.label === 'Pre-Authorization') handleOpenPreAuth();
            }}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </Button>
        ))}
        {activeHold && (
          <div className="ml-auto flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pre-Auth Hold: ${activeHold.amount.toFixed(2)} · ****{activeHold.cardLast4}
          </div>
        )}
      </div>

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

        {/* Right sidebar */}
        <div className="w-72 lg:w-80 border-l border-border bg-card flex flex-col">
          {/* Toggle: Cart / Open Tabs */}
          <div className="p-3 border-b border-border">
            <Button
              variant={showOpenTabs ? 'default' : 'outline'}
              size="sm"
              className="w-full gap-2"
              onClick={() => setShowOpenTabs(!showOpenTabs)}
            >
              <List className="w-4 h-4" />
              {showOpenTabs ? 'Back to Cart' : 'See Open Tabs'}
            </Button>
          </div>

          {showOpenTabs ? (
            /* Open Tabs Panel */
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h2 className="text-lg font-bold text-foreground mb-2">Open Tabs</h2>
              {openTabs.map((tab) => (
                <div key={tab.id} className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-foreground">{tab.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{tab.createdAt}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTabAction(tab.id, 'cash')}>
                            <Banknote className="w-4 h-4 mr-2" /> Cash
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTabAction(tab.id, 'credit')}>
                            <CreditCard className="w-4 h-4 mr-2" /> Credit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTabAction(tab.id, 'add-items')}>
                            <Plus className="w-4 h-4 mr-2" /> Add Items
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {tab.items.map((item) => (
                      <p key={item.id} className="text-xs text-muted-foreground">
                        {item.quantity}x {item.name} — ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-border/50">
                    <span className="text-xs font-medium text-foreground">Total</span>
                    <span className="text-sm font-bold text-primary">${tab.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {openTabs.length === 0 && (
                <p className="text-muted-foreground text-sm text-center mt-8">No open tabs</p>
              )}
            </div>
          ) : (
            /* Cart Panel */
            <>
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">
                  {editingTabId
                    ? `Editing: ${openTabs.find((t) => t.id === editingTabId)?.name}`
                    : 'Cart'}{' '}
                  {itemCount > 0 && <span className="text-primary">({itemCount})</span>}
                </h2>
                {editingTabId && (
                  <button
                    onClick={() => { setEditingTabId(null); setCart([]); }}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1"
                  >
                    Cancel editing
                  </button>
                )}
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCheckout('cash')}
                    disabled={cart.length === 0}
                    variant="outline"
                    className="flex-1 h-12 gap-2 font-bold"
                  >
                    <Banknote className="w-5 h-5" /> Cash
                  </Button>
                  <Button
                    onClick={() => handleCheckout('credit')}
                    disabled={cart.length === 0}
                    className="flex-1 h-12 gap-2 font-bold"
                  >
                    <CreditCard className="w-5 h-5" /> Credit
                  </Button>
                </div>
                <Button
                  onClick={handleNewOrder}
                  disabled={cart.length === 0}
                  variant="secondary"
                  className="w-full h-10 gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" /> {editingTabId ? 'Update Tab' : 'New Order'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <CashReceivedModal
        open={showCashModal}
        onClose={() => setShowCashModal(false)}
        subtotal={total}
        onComplete={completeCheckout}
      />
      <TipModal
        open={showTipModal}
        onClose={() => setShowTipModal(false)}
        subtotal={creditCheckoutTotal}
        onComplete={handleTipComplete}
      />
      <CardInsertedModal
        open={showCardInserted}
        onClose={() => setShowCardInserted(false)}
        items={creditCheckoutItems}
        subtotal={creditCheckoutTotal}
        tipAmount={currentTipAmount}
        staffName={staffName || ''}
        merchantName={merchantName || ''}
        onComplete={handleCardInsertedComplete}
      />
      <ThankYouPopup
        open={showThankYou}
        onClose={handleThankYouClose}
      />
      <DatafileModal
        open={showDatafile}
        onClose={handleDatafileComplete}
        onComplete={handleDatafileComplete}
      />

      {/* Pre-Authorization flow */}
      <PreAuthAmountModal
        open={showPreAuthAmount}
        onCancel={() => setShowPreAuthAmount(false)}
        onConfirm={handlePreAuthAmountConfirm}
      />
      <PreAuthCardModal
        open={showPreAuthCard}
        amount={preAuthAmount}
        onClose={() => setShowPreAuthCard(false)}
        onAuthorized={handlePreAuthAuthorized}
      />
      <PreAuthSignatureModal
        open={showPreAuthSignature}
        amount={preAuthAmount}
        onConfirm={handlePreAuthSignatureConfirm}
      />
      <PreAuthSuccessModal
        open={showPreAuthSuccess}
        hold={activeHold}
        onClose={handlePreAuthSuccessClose}
      />
      <VoidPreAuthConfirmModal
        open={showVoidConfirm}
        hold={activeHold}
        onCancel={() => setShowVoidConfirm(false)}
        onConfirm={handleVoidConfirm}
      />
    </div>
  );
};

export default POSDashboard;
