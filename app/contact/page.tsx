"use client";

import { useState } from "react";
import {
  STORE_PHONE,
  STORE_EMAIL,
  STORE_ADDRESS,
  STORE_WHATSAPP,
} from "@/lib/constants";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Truck,
  Send,
  CheckCircle,
  Package,
  Calendar,
} from "lucide-react";

const deliveryZones = [
  { zone: "Green Valley & Surrounding", days: "Mon, Wed, Fri", time: "Same day" },
  { zone: "Dallas / Fort Worth Metro", days: "Tue, Thu", time: "Next day" },
  { zone: "Greater Texas (within 200mi)", days: "Saturdays", time: "2-3 days" },
  { zone: "Nationwide Shipping", days: "Mon - Fri", time: "3-5 days" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSending(false);
  };

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <div className="bg-green-800 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Contact Us</h1>
          <p className="mx-auto max-w-xl text-green-200">
            Have questions? Need a bulk order quote? We&apos;re here to help. Reach out via phone, WhatsApp, or the form below.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          <a
            href={`tel:${STORE_PHONE}`}
            className="group rounded-xl border border-green-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <Phone className="mx-auto mb-3 h-10 w-10 text-green-600 transition-transform group-hover:scale-110" />
            <h3 className="mb-1 font-semibold text-gray-900">Call Us</h3>
            <p className="font-medium text-green-700">{STORE_PHONE}</p>
            <p className="mt-1 text-sm text-gray-500">Mon-Sat 6AM-6PM</p>
          </a>
          <a
            href={`https://wa.me/${STORE_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-green-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <MessageCircle className="mx-auto mb-3 h-10 w-10 text-green-500 transition-transform group-hover:scale-110" />
            <h3 className="mb-1 font-semibold text-gray-900">WhatsApp</h3>
            <p className="font-medium text-green-700">Quick Order & Chat</p>
            <p className="mt-1 text-sm text-gray-500">Available 24/7</p>
          </a>
          <a
            href={`mailto:${STORE_EMAIL}`}
            className="group rounded-xl border border-green-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <Mail className="mx-auto mb-3 h-10 w-10 text-green-600 transition-transform group-hover:scale-110" />
            <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
            <p className="font-medium text-green-700">{STORE_EMAIL}</p>
            <p className="mt-1 text-sm text-gray-500">Reply within 24 hours</p>
          </a>
        </div>

        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Send Us a Message</h2>
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                  }}
                  className="mt-4 font-medium text-green-600 hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us what you need..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-3 font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                <MapPin className="h-5 w-5 text-green-600" />
                Farm Location
              </h2>
              <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
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
              <p className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                {STORE_ADDRESS}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                <Clock className="h-5 w-5 text-green-600" />
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Monday - Friday", hours: "6:00 AM - 6:00 PM" },
                  { day: "Saturday", hours: "6:00 AM - 4:00 PM" },
                  { day: "Sunday", hours: "8:00 AM - 2:00 PM" },
                ].map((item) => (
                  <div key={item.day} className="flex justify-between border-b border-gray-100 py-1.5 last:border-0">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-medium text-gray-900">{item.hours}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Farm pickup available during business hours. Please call ahead.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="mb-8 flex items-center justify-center gap-2 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            <Truck className="h-8 w-8 text-green-600" />
            Delivery Zones & Schedule
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryZones.map((zone) => (
              <div
                key={zone.zone}
                className="rounded-xl border border-green-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="mb-3 font-semibold text-gray-900">{zone.zone}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{zone.days}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Minimum order applies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{zone.time} delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-center">
            <p className="text-sm font-medium text-amber-800">
              Farm pickup is always available during business hours. No minimum order for pickup. Call ahead to confirm stock availability.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}