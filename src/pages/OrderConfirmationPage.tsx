
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { STORE_PHONE, STORE_WHATSAPP } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Phone, MessageCircle, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const { data: orderData } = await supabase
        .from('ecom_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderData) {
        setOrder(orderData);
        const { data: itemsData } = await supabase
          .from('ecom_order_items')
          .select('*')
          .eq('order_id', orderId);
        setItems(itemsData || []);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your order. We'll start preparing it right away.</p>
          {order && (
            <p className="text-sm text-gray-500">
              Order #{orderId?.slice(0, 8).toUpperCase()} &middot; {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Order Details
            </h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Order Status</span><span className="text-green-700 font-medium">Confirmed</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="text-green-600">{order.shipping === 0 ? 'Free' : 'Standard'}</span></div>
            </div>
          </div>
        )}

        {order?.shipping_address && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-3">Shipping Address</h2>
            <p className="text-gray-600 text-sm">
              {order.shipping_address.name}<br />
              {order.shipping_address.address}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
            </p>
          </div>
        )}

        <div className="bg-green-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-3">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`tel:${STORE_PHONE}`} className="flex-1 flex items-center justify-center gap-2 bg-white text-green-700 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-200">
              <Phone className="w-4 h-4" /> Call Us
            </a>
            <a href={`https://wa.me/${STORE_WHATSAPP}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
