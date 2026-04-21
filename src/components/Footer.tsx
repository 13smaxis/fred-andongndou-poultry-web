
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { STORE_NAME, STORE_PHONE, STORE_EMAIL, STORE_ADDRESS, STORE_WHATSAPP, SHIPPING_RULES } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Truck } from 'lucide-react';

export default function Footer() {
  const [collections, setCollections] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    supabase.from('ecom_collections').select('id, title, handle').eq('is_visible', true).order('created_at')
      .then(({ data }) => {
        if (data) {
          const normalized = data
            .filter(c => c.handle !== 'featured' && c.handle !== 'equipment')
            .map(c => c.handle === 'poultry-feed' ? { ...c, title: 'Chicken Mixed Portions', handle: 'chicken-mixed-portions' } : c);
          setCollections(normalized);
        }
      });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-green-900 text-white">
      {/* Newsletter */}
      <div className="bg-green-800 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-green-200 mb-6 max-w-lg mx-auto">Get notified about stock availability, new batches, and exclusive farm deals.</p>
          {subscribed ? (
            <p className="text-green-300 font-semibold text-lg">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/logo_alpha.png"
              alt={`${STORE_NAME} logo`}
              className="h-24 w-auto object-contain"
            />
            <h4 className="text-lg font-bold">{STORE_NAME}</h4>
          </div>
          <p className="text-green-300 text-sm leading-relaxed mb-4">
            Your trusted source for premium poultry products. Over 15 years of experience in raising healthy birds with the highest biosecurity standards.
          </p>
          <div className="flex gap-3">
            <a href={`https://wa.me/${STORE_WHATSAPP}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href={`tel:${STORE_PHONE}`} className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a href={`mailto:${STORE_EMAIL}`} className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>                                                                                                   {/* Shop */}
          <h4 className="text-lg font-bold mb-4">Shop</h4>
          <ul className="space-y-2">
            {collections.map(col => (
              <li key={col.id}>
                <Link to={`/collections/${col.handle}`} className="text-green-300 hover:text-white text-sm transition-colors">{col.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-green-300 hover:text-white text-sm transition-colors">About Our Farm</Link></li>
            <li><Link to="/knowledge" className="text-green-300 hover:text-white text-sm transition-colors">Poultry Guides</Link></li>
            <li><Link to="/contact" className="text-green-300 hover:text-white text-sm transition-colors">Contact Us</Link></li>
            <li><Link to="/cart" className="text-green-300 hover:text-white text-sm transition-colors">Shopping Cart</Link></li>
          </ul>
          <div className="mt-4 flex items-center gap-2 text-green-300 text-sm">
            <Truck className="w-4 h-4" />
            <span>{SHIPPING_RULES}</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-bold mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-green-300 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{STORE_ADDRESS}</span>
            </li>
            <li>
              <a href={`tel:${STORE_PHONE}`} className="flex items-center gap-2 text-green-300 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {STORE_PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${STORE_EMAIL}`} className="flex items-center gap-2 text-green-300 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                {STORE_EMAIL}
              </a>
            </li>
            <li className="flex items-start gap-2 text-green-300 text-sm">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>Mon - Sat: 6:00 AM - 6:00 PM</p>
                <p>Sunday: 8:00 AM - 2:00 PM</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-800 py-6 text-center text-green-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
