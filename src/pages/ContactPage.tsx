
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { STORE_NAME, STORE_PHONE, STORE_EMAIL, STORE_ADDRESS, STORE_WHATSAPP } from '@/lib/constants';
import { Phone, Mail, MapPin, MessageCircle, Clock, Truck, Send, CheckCircle, Package, Calendar } from 'lucide-react';


const deliveryZones = [
  { zone: 'Green Valley & Surrounding', days: 'Mon, Wed, Fri', time: 'Same day' },
  { zone: 'Dallas / Fort Worth Metro', days: 'Tue, Thu', time: 'Next day' },
  { zone: 'Greater Texas (within 200mi)', days: 'Saturdays', time: '2-3 days' },
  { zone: 'Nationwide Shipping', days: 'Mon - Fri', time: '3-5 days' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setSending(false);
  };

  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-green-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-green-200 max-w-xl mx-auto">Have questions? Need a bulk order quote? We're here to help. Reach out via phone, WhatsApp, or the form below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <a href={`tel:${STORE_PHONE}`} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-green-100 group">
            <Phone className="w-10 h-10 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
            <p className="text-green-700 font-medium">{STORE_PHONE}</p>
            <p className="text-sm text-gray-500 mt-1">Mon-Sat 6AM-6PM</p>
          </a>
          <a href={`https://wa.me/${STORE_WHATSAPP}`} target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-green-100 group">
            <MessageCircle className="w-10 h-10 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-green-700 font-medium">Quick Order & Chat</p>
            <p className="text-sm text-gray-500 mt-1">Available 24/7</p>
          </a>
          <a href={`mailto:${STORE_EMAIL}`} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow border border-green-100 group">
            <Mail className="w-10 h-10 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-green-700 font-medium">{STORE_EMAIL}</p>
            <p className="text-sm text-gray-500 mt-1">Reply within 24 hours</p>
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="mt-4 text-green-600 font-medium hover:underline">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={formData.phone} onChange={e => updateField('phone', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select required value={formData.subject} onChange={e => updateField('subject', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select a topic</option>
                      <option value="order">Place an Order</option>
                      <option value="bulk">Bulk Order Enquiry</option>
                      <option value="availability">Stock Availability</option>
                      <option value="delivery">Delivery Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea required rows={5} value={formData.message} onChange={e => updateField('message', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Tell us what you need..." />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                  <Send className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Map & Location */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Farm Location
              </h2>
              <div className="bg-gray-200 rounded-lg h-48 mb-4 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214587.67358!2d-96.87!3d32.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Farm Location"
                />
              </div>
              <p className="text-gray-600 text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                {STORE_ADDRESS}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday - Friday', hours: '6:00 AM - 6:00 PM' },
                  { day: 'Saturday', hours: '6:00 AM - 4:00 PM' },
                  { day: 'Sunday', hours: '8:00 AM - 2:00 PM' },
                ].map(item => (
                  <div key={item.day} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-medium text-gray-900">{item.hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Farm pickup available during business hours. Please call ahead.</p>
            </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-2">
            <Truck className="w-8 h-8 text-green-600" />
            Delivery Zones & Schedule
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryZones.map(zone => (
              <div key={zone.zone} className="bg-white rounded-xl shadow-sm p-5 border border-green-100 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-3">{zone.zone}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">{zone.days}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Minimum order applies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">{zone.time} delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 rounded-xl p-4 mt-6 text-center">
            <p className="text-amber-800 text-sm font-medium">
              Farm pickup is always available during business hours. No minimum order for pickup. Call ahead to confirm stock availability.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
