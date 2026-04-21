
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { STRIPE_ACCOUNT_ID, SHIPPING_RULES } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Truck, ChevronRight } from 'lucide-react';

const stripePromise = STRIPE_ACCOUNT_ID && STRIPE_ACCOUNT_ID !== 'STRIPE_ACCOUNT_ID'
  ? loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID })
  : null;

function PaymentForm({ onSuccess }: { onSuccess: (pi: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 bg-green-700 text-white py-3.5 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [processingShipping, setProcessingShipping] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US'
  });

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, []);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingShipping(true);
    setPaymentError('');

    let calculatedShipping = 0;
    let calculatedTax = 0;

    // Calculate shipping
    try {
      const { data: shipData } = await supabase.functions.invoke('calculate-shipping', {
        body: {
          cartItems: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
          shippingRules: SHIPPING_RULES,
          subtotal: cartTotal
        }
      });
      if (shipData?.success) {
        calculatedShipping = shipData.shippingCents;
        setShippingCost(calculatedShipping);
      }
    } catch (e) { console.error('Shipping calc error:', e); }

    // Calculate tax
    if (shippingAddress.state) {
      try {
        const { data: taxData } = await supabase.functions.invoke('calculate-tax', {
          body: { state: shippingAddress.state, subtotal: cartTotal }
        });
        if (taxData?.success) {
          calculatedTax = taxData.taxCents;
          setTax(calculatedTax);
        }
      } catch (e) { console.error('Tax calc error:', e); }
    }

    // Create payment intent with correct total
    const total = cartTotal + calculatedShipping + calculatedTax;
    if (total > 0) {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount: total, currency: 'usd', metadata: { customer_email: shippingAddress.email } }
        });
        if (error || !data?.clientSecret) {
          setPaymentError('Unable to initialize payment. Please try again or order via WhatsApp.');
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setPaymentError('Unable to initialize payment. Please try again.');
      }
    }

    setProcessingShipping(false);
    setStep('payment');
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    const subtotal = cartTotal;
    const orderTotal = subtotal + shippingCost + tax;

    try {
      const { data: customer } = await supabase
        .from('ecom_customers')
        .upsert({ email: shippingAddress.email, name: shippingAddress.name, phone: shippingAddress.phone }, { onConflict: 'email' })
        .select('id')
        .single();

      const { data: order } = await supabase
        .from('ecom_orders')
        .insert({
          customer_id: customer?.id,
          status: 'paid',
          subtotal,
          tax,
          shipping: shippingCost,
          total: orderTotal,
          shipping_address: shippingAddress,
          stripe_payment_intent_id: paymentIntent.id,
        })
        .select('id')
        .single();

      if (order) {
        const orderItems = cart.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          product_name: item.name,
          variant_title: item.variant_title || null,
          sku: item.sku || null,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.price * item.quantity,
        }));
        await supabase.from('ecom_order_items').insert(orderItems);

        // Send confirmation email
        try {
          await supabase.functions.invoke('send-order-confirmation', {
            body: {
              orderId: order.id,
              customerEmail: shippingAddress.email,
              customerName: shippingAddress.name,
              orderItems,
              subtotal,
              shipping: shippingCost,
              tax,
              total: orderTotal,
              shippingAddress
            }
          });
        } catch (e) { console.error('Email error:', e); }

        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    }
  };

  const updateField = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/" className="text-green-600 font-medium hover:underline">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/cart" className="hover:text-green-700">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className={step === 'shipping' ? 'text-green-700 font-medium' : 'text-gray-500'}>Shipping</span>
          <ChevronRight className="w-4 h-4" />
          <span className={step === 'payment' ? 'text-green-700 font-medium' : 'text-gray-500'}>Payment</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 'shipping' ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input required value={shippingAddress.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input required type="email" value={shippingAddress.email} onChange={e => updateField('email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input value={shippingAddress.phone} onChange={e => updateField('phone', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input required value={shippingAddress.address} onChange={e => updateField('address', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="123 Farm Road" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input required value={shippingAddress.city} onChange={e => updateField('city', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Green Valley" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input required value={shippingAddress.state} onChange={e => updateField('state', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="TX" maxLength={2} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                      <input required value={shippingAddress.zip} onChange={e => updateField('zip', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="75001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select value={shippingAddress.country} onChange={e => updateField('country', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="US">United States</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={processingShipping}
                    className="w-full bg-green-700 text-white py-3.5 rounded-lg font-semibold hover:bg-green-800 transition-colors mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingShipping ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Calculating...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                    <button onClick={() => setStep('shipping')} className="text-sm text-green-600 hover:underline">Edit</button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {shippingAddress.name}<br />
                    {shippingAddress.address}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Secure Payment
                  </h2>
                  {!stripePromise ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-yellow-800 font-medium mb-2">Payment processing is being set up</p>
                      <p className="text-yellow-700 text-sm">Please check back soon or order via WhatsApp for immediate processing.</p>
                    </div>
                  ) : paymentError ? (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-red-800">{paymentError}</p>
                      <button onClick={() => setStep('shipping')} className="text-red-600 text-sm font-medium hover:underline mt-2">Try Again</button>
                    </div>
                  ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#15803d' } } }}>
                      <PaymentForm onSuccess={handlePaymentSuccess} />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
                      <span className="ml-3 text-gray-600">Loading payment form...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={`${item.product_id}-${item.variant_id}-${idx}`} className="flex gap-3">
                    {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Pricing</span>
                  <span className="text-sm font-medium text-gray-500">Provided on confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
