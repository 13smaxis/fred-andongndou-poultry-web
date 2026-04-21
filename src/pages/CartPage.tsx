
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { STORE_WHATSAPP } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageCircle, Truck } from 'lucide-react';

export default function CartPage() {
  const { cart, cartCount, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleWhatsAppOrder = () => {
    const items = cart.map(i => `- ${i.name}${i.variant_title ? ` (${i.variant_title})` : ''} x${i.quantity}`).join('\n');
    const msg = encodeURIComponent(`Hi! I'd like to place an order:\n\n${items}\n\nPlease confirm availability and delivery.`);
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our products and add items to your cart.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-50">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{cartCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Pricing</span>
                    <span className="text-sm font-medium text-gray-500">Provided on confirmation</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-green-700 text-white py-3.5 rounded-lg font-semibold hover:bg-green-800 transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-500 text-white py-3.5 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </button>
                <Link to="/" className="block text-center text-sm text-green-600 font-medium hover:underline mt-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
