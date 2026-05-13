"use client";

import 
{
  Phone, MessageCircle, Truck, Shield, Award, Leaf, MapPin, ShoppingCart,
} from 'lucide-react';

/*
 * This declares a list of trust badges that will be displayed in a marquee format on the Home page.
 */
const badges = [
  { icon: Truck,         text: 'Free Delivery',    sub: 'On all orders' },
  { icon: Shield,        text: 'Health Guaranteed', sub: 'Vaccinated birds' },
  { icon: Award,         text: '15+ Years',         sub: 'Of experience' },
  { icon: Leaf,          text: 'Farm Fresh',        sub: 'Daily collection' },
  { icon: MapPin,        text: 'Locally Sourced',   sub: 'Local farms' },
  { icon: MessageCircle, text: 'WhatsApp Orders',   sub: 'Instant response' },
  { icon: Phone, text: 'Call Orders',   sub: 'Quick Delivery' },
  { icon: ShoppingCart, text: 'Online Shop',   sub: 'Instant Ordering' },
];

/*
 * Self contained TrustBadgeMarquee component creates a continuously scrolling marquee of trust badges. 
 * It duplicates the badges array to create a seamless scrolling effect and fades both edges.
 * The marquee pauses on hover, allowing users to read the badges without distraction.
 */
export function TrustBadgeMarquee()                                                                             
{
  const doubled = [...badges, ...badges];                                                                       

  return (
    <section className="trust-badge-marquee bg-white py-5 border-b overflow-hidden relative">                 {/* ← relative is required */}
      <div className="
                        pointer-events-none 
                        absolute 
                        inset-y-0 left-0 
                        w-32 md:w-40
                        bg-linear-to-r from-white to-transparent 
                        z-10
                      " 
      />                                                                                                        {/* Fades edges on the left */}
      <div className="
                        pointer-events-none 
                        absolute 
                        inset-y-0 right-0 
                        w-32 md:w-40
                        bg-linear-to-l from-white to-transparent 
                        z-10
                      " 
      />                                                                                                        {/* Fades edges on the right */}
      <div className="flex w-max animate-marquee">                                                              {/* Scrolling track pauses on hover */}
        {doubled.map((badge, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 px-10 border-r border-gray-200 whitespace-nowrap"
          >
            <badge.icon className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{badge.text}</p>
              <p className="text-xs text-gray-500">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default TrustBadgeMarquee;