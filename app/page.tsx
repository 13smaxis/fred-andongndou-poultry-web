'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import TrustBadgeMarquee from '@/components/Marquee';
import 
{
  STORE_NAME,
  GALLERY_IMAGES,
  STORE_WHATSAPP,
  STORE_PHONE,
  SHIPPING_RULES,
  HERO_IMAGE,
} from '@/lib/constants';
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from '@/lib/shop-data';
import 
{
  ArrowRight, Phone, MessageCircle, Truck, Shield, Leaf, Star, BookOpen,
  Camera, Calendar, ShoppingCart, Users, Heart, Egg, Syringe, Bug, Utensils,
} from 'lucide-react';


/*
 * This is testimonial data for the Home page. 
 * Each testimonial includes the customer's name, role, testimonial text, and a rating out of 5.
 * The testimonials are displayed in a grid format on the Home page, with an auto-rotate feature that cycles through them every 5 seconds.
 */
const testimonials = [
  {
    name: 'James Okonkwo',
    role: 'Local Farmer',
    text: 'Best broilers in the region! My birds always reach market weight on time. The day-old chicks are strong and healthy.',
    rating: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Restaurant Owner',
    text: `We've been sourcing eggs and broilers from ${STORE_NAME} for 3 years. Consistent quality and reliable delivery every time.`,
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Egg Retailer',
    text: 'The eggs are always fresh with beautiful golden yolks. My customers love them and keep coming back for more.',
    rating: 5,
  },
  {
    name: 'Maria Rodriguez',
    role: 'Small-Scale Farmer',
    text: 'Started my poultry farm with their day-old chicks and chicken mixed portions. Their guidance and quality products made all the difference.',
    rating: 5,
  },
  {
    name: 'Robert Thompson',
    role: 'Catering Business',
    text: 'Bulk orders are handled professionally. The free-range broilers have superior taste that our clients notice immediately.',
    rating: 5,
  },
  {
    name: 'Grace Adeyemi',
    role: 'Poultry Farmer',
    text: 'The point-of-lay hens started producing within 10 days of purchase. Excellent vaccination records and healthy birds.',
    rating: 4,
  },
  {
    name: 'Michael Brown',
    role: 'Grocery Store Owner',
    text: 'Reliable supply of fresh eggs every week. Their delivery is always on time and the products are consistently high quality.',
    rating: 5,
  },
  {
    name: 'Linda Nguyen',
    role: 'Home Cook & Buyer',
    text: `I drive 30 miles to buy from ${STORE_NAME} because the quality is unmatched. Their free-range eggs are the best I've ever had.`,
    rating: 5,
  },
];

const stockUpdates = [
  { product: 'Premium Broilers', status: 'Available Now', qty: '200+ birds', color: 'green' },
  { product: 'Broiler Day-Old Chicks', status: 'Next batch: Every Monday', qty: '500+ weekly', color: 'green' },
  { product: 'Layer Day-Old Chicks', status: 'Next batch: March 24', qty: '300 available', color: 'amber' },
  { product: 'Point-of-Lay Hens', status: 'Available Now', qty: '150 hens', color: 'green' },
  { product: 'Farm Fresh Eggs', status: 'Available Daily', qty: '100+ trays', color: 'green' },
  { product: 'Free-Range Broilers', status: 'Limited Stock', qty: '50 birds', color: 'amber' },
];


/*
 * The Home component fetches featured products and collections from Supabase on mount. 
 * It also sets up an interval to auto-rotate testimonials every 5 seconds. 
 * The page is structured into multiple sections: 
 *    - Hero, Trust Badges, Shop by Category, Featured Products, Stock Availability, About Preview, Testimonials, 
 *    - Knowledge Preview, Gallery, CTA, and Delivery Info. 
 */
export default function Home() 
{
  const [galleryModal, setGalleryModal] = useState<number | null>(null);
  const router = useRouter();
  const featuredProducts = SHOP_PRODUCTS.filter((product) => product.tags?.includes('featured'));

  /*
   * This object maps collection handles to specific category images for the "Shop by Category" section.
   * If a collection handle does not have a specific image, it falls back to the first image in the GALLERY_IMAGES array.
   */
  const categoryImages: Record<string, string> = {
    Live_Chicken: SHOP_PRODUCTS.find((product) => product.category === 'Live Chicken')?.image || GALLERY_IMAGES[0],
    Tender_Chicken_Portions: SHOP_PRODUCTS.find((product) => product.category === 'Tender Chicken Portions')?.image || GALLERY_IMAGES[0],
    Eggs: SHOP_PRODUCTS.find((product) => product.category === 'Eggs')?.image || GALLERY_IMAGES[0],
    Feed: SHOP_PRODUCTS.find((product) => product.category === 'Feed')?.image || GALLERY_IMAGES[0],
  };

  return (
    <div className="min-h-screen bg-gray-50"> 
      <HeroCarousel />                        
      <TrustBadgeMarquee />                                                                                     {/* TRUST BADGES MARQUEE */}

      <section className="relative overflow-hidden bg-cover bg-center bg-fixed py-16" >                                                                                                         {/* SHOP BY CATEGORY */}
        <div className="
                        absolute inset-0 
                        bg-linear-to-br from-emerald-950/80 via-slate-900/65 to-amber-900/70
                      " 
        />                                                                                                      {/* Overlay */}
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Shop by 
              <span className="text-amber-200"> Category</span>
            </h2>
            <p className="mx-auto max-w-xl text-green-100/90">
              Browse our complete range of poultry products, from live birds to chicken mixed portions.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">                                                 {/* Category links */}
            {SHOP_CATEGORIES.filter((category) => category !== 'All').map((category) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="
                            w-1/2 md:w-1/3 lg:w-1/5
                            group relative 
                            aspect-square 
                            overflow-hidden 
                            rounded-xl 
                            shadow-lg ring-1 ring-white/10 
                            transition-all hover:-translate-y-1 
                            hover:shadow-2xl
                          "
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={categoryImages[category] || GALLERY_IMAGES[0]}
                  alt={category}
                  className="
                              w-full h-full 
                              object-cover object-center 
                              group-hover:scale-110 
                              transition-transform 
                              duration-500
                            "
                />
                <div className="
                                  absolute inset-0 
                                  bg-linear-to-t from-black/75 via-black/30 to-transparent
                                " />                                                                            {/* Gradient overlay for better text visibility */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{category}</h3>
                  <span className="
                                  text-green-300 text-sm flex 
                                  items-center 
                                  gap-1 mt-1 
                                  group-hover:text-amber-400 
                                  transition-colors
                                "
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">                                                                    {/* FEATURED PRODUCTS */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="w-full text-center">                                                                {/* Heading container */}
              <h2 className="mb-3 text-3xl font-bold md:text-4xl">Featured 
                <span className="text-emerald-700"> Products</span>
              </h2>
              <p className="text-gray-600 mt-2">Our most popular items, handpicked for you</p>
            </div>
            <Link
              href="/shop"
              className="
                          hidden 
                          md:flex 
                          items-center 
                          gap-1 
                          text-green-700 font-semibold 
                          hover:text-green-800
                        "
            >                                                                                                   {/* View All Link */}
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div
        className="relative bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
       <div className="absolute inset-0 bg-blue-300/20" />
        <section className="relative z-10 py-16 back">                                                          {/* STOCK AVAILABILITY */}
          <div className="max-w-7xl mx-auto px-4">                                                              {/* Section containder */}
            <div className="text-center mb-10">
              <Calendar className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Stock Availability</h2>
              <p className="text-gray-600">Real-time stock updates so you know exactly what&apos;s available</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {stockUpdates.map((item) => (
                <div
                  key={item.product}
                  className="
                            bg-green-300
                            rounded-xl 
                            p-4 shadow-sm 
                            flex items-center 
                            gap-4 
                          "
                >
                  <div
                    className={`
                                w-3 h-3 rounded-full shrink-0 
                                ${ item.color === 'green' ? 'bg-green-500' : 'bg-amber-500' } 
                                animate-pulse
                             `}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{item.product}</h4>
                    <p className="text-xs text-gray-500">{item.status}</p>
                    <p className="text-xs text-green-600 font-medium">{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Stock updates as of{' '}
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              . Contact us for real-time availability.
            </p>
          </div>
        </section>

        <section className="py-16">                                                                             {/* ABOUT PREVIEW */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-3">
                {GALLERY_IMAGES.map((img, idx) => (
                  <div key={idx} 
                       className={`
                                   rounded-xl 
                                   overflow-hidden 
                                   shadow-sm 
                                   ${idx === 0 ? 'row-span-2' : ''}
                                `}
                  >
                    <img
                      src={img}
                      alt={`Farm ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
              <div backdrop-blur-sm className="bg-white/75 rounded-xl p-8 shadow-lg">
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">About Our Farm</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">A Legacy of Quality Poultry Farming</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  For over 15 years, {STORE_NAME} has been the trusted name in premium poultry products. Our farm combines
                  traditional farming values with modern agricultural practices to deliver the healthiest birds and freshest eggs to
                  your doorstep.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Shield, text: 'USDA Certified' },
                    { icon: Heart, text: 'Animal Welfare' },
                    { icon: Leaf, text: 'Sustainable Methods' },
                    { icon: Users, text: '500+ Customers' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                  Learn More About Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600">Trusted by farmers, restaurants, and families across the region</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.slice(0, 4).map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          {/* More testimonials row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {testimonials.slice(4, 8).map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KNOWLEDGE PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <BookOpen className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Poultry Care Guides</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Expert knowledge to help you raise healthy, productive poultry</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'How to Raise Broilers', desc: 'Complete guide from day-old to market weight', Icon: Egg },
              { title: 'Feeding Schedules', desc: 'Optimal nutrition for every growth stage', Icon: Utensils },
              { title: 'Disease Prevention', desc: 'Keep your flock healthy and productive', Icon: Bug },
              { title: 'Vaccination Calendar', desc: 'Complete schedule for broilers and layers', Icon: Syringe },
            ].map((guide, idx) => (
              <Link key={idx} href="/knowledge" className="bg-green-50 rounded-xl p-6 hover:bg-green-100 transition-colors group">
                <guide.Icon className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-700">{guide.title}</h3>
                <p className="text-sm text-gray-600">{guide.desc}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 mt-3">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <Camera className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Farm Gallery</h2>
            <p className="text-gray-600">Take a look inside our farm operations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryModal(idx)}
                className="aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Farm gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {galleryModal !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setGalleryModal(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={GALLERY_IMAGES[galleryModal]} alt="" className="max-w-full max-h-[80vh] rounded-xl" />
          <button
            onClick={() => setGalleryModal(null)}
            className="absolute top-4 right-4 text-white text-xl bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
          >
            ×
          </button>
        </div>
      )}

      {/* CTA SECTION */}
      <section className="py-16 bg-green-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
            Whether you need a few birds for your family or thousands for your business, we&apos;re here to serve you. Order online or
            via WhatsApp today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/shop')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Browse Products
            </button>
            <a
              href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
                'Hi! I would like to place a bulk order. Please share product availability.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Bulk Order Enquiry
            </a>
            <a
              href={`tel:${STORE_PHONE}`}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors backdrop-blur-sm text-lg"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* DELIVERY INFO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <Truck className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Delivery & Pickup</h2>
            <p className="text-gray-600">
              We deliver across the region. {SHIPPING_RULES}.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { area: 'Local Area', days: 'Mon, Wed, Fri', time: 'Same day' },
              { area: 'Metro Area', days: 'Tue, Thu', time: 'Next day' },
              { area: 'Regional', days: 'Saturdays', time: '2-3 days' },
              { area: 'Nationwide', days: 'Mon - Fri', time: '3-5 days' },
            ].map((zone) => (
              <div key={zone.area} className="bg-green-50 rounded-xl p-5 text-center">
                <h3 className="font-bold text-gray-900 mb-2">{zone.area}</h3>
                <p className="text-sm text-gray-600 mb-1">{zone.days}</p>
                <p className="text-sm text-green-600 font-medium">{zone.time} delivery</p>
                <p className="text-xs text-gray-500 mt-2">Minimum order applies</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/contact" className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-800">
              View Full Delivery Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
