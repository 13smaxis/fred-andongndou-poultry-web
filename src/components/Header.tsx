
import { useState, useEffect, type MouseEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { smoothScrollToTop } from '@/lib/scrollToTop';
import {
  STORE_NAME,
  STORE_WHATSAPP,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_URL,
  SHIPPING_RULES,
} from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  Facebook,
  Instagram,
  User,
  ChevronDown,
  Minus,
  Plus,
  Trash2,
  ArrowUp,
} from 'lucide-react';

type Collection = {
  id: string;
  title: string;
  handle: string;
};

export default function Header() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { cart, cartCount, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await supabase
        .from('ecom_collections')
        .select('id, title, handle')
        .eq('is_visible', true)
        .order('created_at');
      if (data) {
        const normalized = data
          .filter(c => c.handle !== 'featured' && c.handle !== 'equipment')
          .map(c => c.handle === 'poultry-feed' ? { ...c, title: 'Chicken Mixed Portions', handle: 'chicken-mixed-portions' } : c);
        setCollections(normalized);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const maxScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScrollable > 0 ? y / maxScrollable : 0;

      setScrolled(y > 20);
      setShowScrollTop(progress >= 0.6);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);

    if (location.pathname === '/') {
      event.preventDefault();
      smoothScrollToTop(1600);
      return;
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  const navLinkClass =
    'relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-green-700 focus-visible:text-green-700 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[calc(100%-1.5rem)] after:-translate-x-1/2 after:origin-center after:scale-x-0 after:rounded-full after:bg-green-700 after:opacity-0 after:transition-all after:duration-300 after:ease-out hover:after:scale-x-100 hover:after:opacity-100 focus-visible:after:scale-x-100 focus-visible:after:opacity-100';

  const mobileNavLinkClass = 'px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium';

  const findCollection = (aliases: string[]) =>
    collections.find((col) => aliases.includes(String(col.title).toLowerCase()) || aliases.includes(String(col.handle).toLowerCase()));

  const shopCollections = [
    findCollection(['live birds', 'live-birds']),
    findCollection(['day-old chicks', 'day-old-chicks']),
    findCollection(['farm fresh eggs', 'farm-fresh-eggs']),
    findCollection(['chicken portions', 'chicken mixed portions', 'chicken-portions', 'chicken-mixed-portions', 'poultry-feed']),
  ].filter(Boolean);

  return (
    <>
      
      <section className="bg-green-800 text-white text-sm py-2 px-4">                                           {/* Top bar */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex items-center gap-1 text-amber-200 hover:text-yellow-100 transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
              href={STORE_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-1 text-amber-200 hover:text-yellow-100 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href={`https://wa.me/${STORE_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex items-center gap-1 text-amber-200 hover:text-yellow-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
          <p className="hidden md:block text-amber-100 text-xs sm:text-sm">{SHIPPING_RULES}</p>
        </div>
      </section>

      
      <header className={`
                          sticky top-0 z-50 
                          bg-white transition-shadow 
                          duration-300 
                          ${scrolled ? 'shadow-md' : 'shadow-sm'}
                        `}
      >                                                                                                         {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" 
                className="flex items-center gap-2" 
                onClick={handleLogoClick}
          > 
            <img
              src="/logo_alpha.png"
              alt={`${STORE_NAME} logo`}
              className="h-32 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass}>Home</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`${navLinkClass} inline-flex items-center gap-1`}
                >
                  Shop
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={2}
                className="w-56"
              >
                {shopCollections.map((col) => (
                  <DropdownMenuItem key={col.id} asChild>
                    <Link to={`/collections/${col.handle}`}>{col.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/about" className={navLinkClass}>About</Link>
            <Link to="/knowledge" className={navLinkClass}>Guides</Link>
            <Link to="/contact" className={navLinkClass}>Contact</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 text-white shadow-[0_10px_25px_rgba(22,163,74,0.35)] ring-1 ring-green-400/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:from-green-500 hover:to-emerald-600"
              aria-label="Open cart"
              title="Open cart"
            >
              <ShoppingCart className="mx-auto h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[11px] min-w-[1.5rem] h-6 px-1 flex items-center justify-center rounded-full font-extrabold shadow-lg ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-green-50 rounded-lg"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileMenuOpen) {
                  setMobileShopOpen(false);
                }
              }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">                                             {/* Mobile menu */}
            <nav className="flex flex-col p-4 gap-1">
              <Link to="/" onClick={closeMobileMenu} className={mobileNavLinkClass}>Home</Link>
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium inline-flex items-center justify-between"
                aria-expanded={mobileShopOpen}
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileShopOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileShopOpen && (
                <div className="flex flex-col gap-1 pl-4">
                  {shopCollections.map((col) => (
                    <Link
                      key={col.id}
                      to={`/collections/${col.handle}`}
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      {col.title}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/about" onClick={closeMobileMenu} className={mobileNavLinkClass}>About</Link>
              <Link to="/knowledge" onClick={closeMobileMenu} className={mobileNavLinkClass}>Guides</Link>
              <Link to="/contact" onClick={closeMobileMenu} className={mobileNavLinkClass}>Contact</Link>
            </nav>
          </div>
        )}
      </header>

      
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setIsCartOpen(false)} />             {/* Cart Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <button onClick={() => { setIsCartOpen(false); navigate('/'); }} className="mt-4 text-green-600 font-medium hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white border rounded hover:bg-gray-100">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white border rounded hover:bg-gray-100">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items</span>
                  <span className="text-xl font-bold text-green-800">{cartCount}</span>
                </div>
                <p className="text-xs text-green-600 font-medium">Free Shipping</p>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/cart'); }}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                  className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent('Hi! I would like to place an order.')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        title="Order via WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => smoothScrollToTop(1700)}
          className="fixed bottom-24 left-6 z-40 h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-[0_10px_30px_rgba(234,88,12,0.35)] ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ArrowUp className="mx-auto h-5 w-5" />
        </button>
      )}
    </>
  );
}
