'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import TrustBadgeMarquee from '@/components/TrustBadgesMarquee';
import broilerImage from '@/images/broilers.jpg';
import portionImage from '@/images/portions.png';
import StockAvailabilityCarousel from '@/components/StockAvailabilityCarousel';
import {
        STORE_NAME,
        GALLERY_IMAGES,
        STORE_WHATSAPP,
        STORE_PHONE,
        SHIPPING_RULES,
        HERO_IMAGE,
} from '@/lib/constants';
import { SHOP_CATEGORIES, SHOP_PRODUCTS } from '@/lib/shop-data';
import {
        ArrowRight, Phone, MessageCircle, Truck, Shield, Leaf, BookOpen,
        Camera, Calendar, ShoppingCart, Users, Heart, Egg, Syringe, Bug, Utensils,
} from 'lucide-react';


const stockUpdates = [
  { product: 'Premium Broilers', status: 'Available Now', qty: '200+ birds', color: 'green' as const },
  { product: 'Broiler Day-Old Chicks', status: 'Next batch: Every Monday', qty: '500+ weekly', color: 'green' as const },
  { product: 'Premium Chicken Thighs', status: 'Next batch: March 24', qty: '300 available', color: 'amber' as const },
  { product: 'Point-of-Lay Hens', status: 'Available Now', qty: '150 hens', color: 'green' as const },
  { product: 'Farm Fresh Eggs', status: 'Available Daily', qty: '100+ trays', color: 'green' as const },
  { product: 'Free-Range Broilers', status: 'Limited Stock', qty: '50 birds', color: 'amber' as const },
  { product: 'Premium Chicken Wings', status: 'Next batch: March 28', qty: '200+ packs', color: 'amber' as const },
  { product: 'Grower Feed', status: 'Available Now', qty: '100+ bags', color: 'green' as const },
  { product: 'Premium Chicken Mixed Portions', status: 'Next batch: March 30', qty: '150 bags', color: 'amber' as const },
] as const;


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
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const featuredProducts = SHOP_PRODUCTS.filter((product) => product.tags?.includes('featured'));

  const categoryList = useMemo(
    () => SHOP_CATEGORIES.filter((category) => category !== 'All'),
    []
  );

  useEffect(() => {
    const node = categoryRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCategoryVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      {
        threshold: [0.2, 0.35, 0.6],
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);


  /*
   * This object maps collection handles to specific category images for the "Shop by Category" section.
   * If a collection handle does not have a specific image, it falls back to the first image in the GALLERY_IMAGES array.
   */
  const categoryImages: Record<string, string> = {
    'Live Chicken': broilerImage.src,
    'Tender Chicken Portions': portionImage.src,
    Eggs: SHOP_PRODUCTS.find((product) => product.category === 'Eggs')?.image || GALLERY_IMAGES[0],
    Feed: SHOP_PRODUCTS.find((product) => product.category === 'Feed')?.image || GALLERY_IMAGES[0],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroCarousel />                                                                                          {/* HERO CAROUSEL imported from ./components/HeroCarousel */}
      <TrustBadgeMarquee />                                                                                     {/* TRUST BADGES MARQUEE imported from ./components/Marquee */}

      <section className="relative overflow-hidden bg-cover bg-center bg-fixed py-16" ref={categoryRef} >                                                                                                         {/* SHOP BY CATEGORY */}
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
            {categoryList.map((category, index) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={`
                            w-1/2 md:w-1/3 lg:w-1/5
                            group relative 
                            aspect-square 
                            overflow-hidden 
                            rounded-xl 
                            shadow-lg ring-1 ring-white/10 
                            ${isCategoryVisible ? 'animate-category-rise' : 'opacity-0'}
                            transition-all hover:-translate-y-1 
                            hover:shadow-2xl
                          `}
                style={{ animationDelay: isCategoryVisible ? `${index * 110}ms` : '0ms' }}
              >
                <Image
                  src={categoryImages[category] || GALLERY_IMAGES[0]}
                  alt={category}
                  width={1200}
                  height={1200}
                  className="
                              h-full w-full 
                              object-cover object-center 
                              transition-transform 
                              duration-500 
                              group-hover:scale-110
                            "
                />
                <div className="
                                  absolute inset-0 
                                  bg-linear-to-t 
                                  from-black/75 via-black/30 to-transparent
                                " 
                />                                                                                              {/* Gradient overlay for better text visibility */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{category}</h3>
                  <span className="
                                  mt-1 flex items-center 
                                  gap-1 text-sm text-green-300 
                                  transition-colors
                                  group-hover:text-amber-400 
                                "
                  > 
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-700">                                                                 {/* FEATURED PRODUCTS */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div className="w-full text-center">                                                                {/* Heading container */}
              <h1 className="mb-3 text-3xl font-bold md:text-4xl text-white">
                  Featured <span className="text-green-400"> Products</span>
              </h1>
              <p className="text-gray-200 mt-2">Our most popular items, handpicked for you</p>
            </div>
            <Link
              href="/shop"
              className="
                          hidden 
                          md:flex 
                          items-center 
                          gap-2 
                          h-10 px-6
                          rounded-2xl 
                          bg-linear-to-br from-green-600 to-emerald-700 
                          text-white 
                          shadow-[0_10px_25px_rgba(22,163,74,0.35)] 
                          ring-1 ring-green-400/30 
                          transition-all duration-300 
                          hover:-translate-y-0.5 
                          hover:scale-105 hover:from-green-500 hover:to-emerald-600 
                          font-semibold
                          whitespace-nowrap
                        "
            >                                                                                                   {/* View All Link */}
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
            <div
              className="absolute inset-0 bg-fixed bg-center bg-cover"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/40 via-slate-900/35 to-black/25" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="text-center mb-6">
                <Calendar className="w-10 h-10 text-white mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Stock <span className="text-yellow-400">Availability</span>
                </h2>
              </div>

              <div className="flex justify-center mb-6">
                <p className="text-center text-lg text-gray-200 bg-amber-800 inline-flex px-4 py-2 rounded-lg">
                  Stock updates as of{' '}
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <StockAvailabilityCarousel stockUpdates={stockUpdates} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
            <div
              className="absolute inset-0 bg-fixed bg-center bg-cover"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/40 via-slate-900/35 to-black/25" />
            <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="text-center mb-6">
                <BookOpen className="w-10 h-10 text-green-200 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Poultry <span className="text-yellow-400">Care Guides</span>
                </h2>
                <p className="text-center text-lg text-gray-200 bg-amber-800 inline-flex px-4 py-2 rounded-lg">
                  Expert knowledge to help you raise healthy, productive poultry
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'How to Raise Broilers', desc: 'Complete guide from day-old to market weight', Icon: Egg },
                  { title: 'Feeding Schedules', desc: 'Optimal nutrition for every growth stage', Icon: Utensils },
                  { title: 'Disease Prevention', desc: 'Keep your flock healthy and productive', Icon: Bug },
                  { title: 'Vaccination Calendar', desc: 'Complete schedule for broilers and layers', Icon: Syringe },
                ].map((guide, idx) => (
                  <Link
                    key={idx}
                    href="/knowledge"
                    className="group flex items-start gap-4 p-3 rounded hover:bg-white/5 transition-colors"
                  >
                    <guide.Icon className="w-7 h-7 text-green-300 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-green-300">{guide.title}</h3>
                      <p className="text-gray-300 text-sm">{guide.desc}</p>
                    </div>
                    <span className="text-yellow-400 mt-1"><ArrowRight className="w-4 h-4" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

  {/*   <section className="py-16 bg-gray-50 relative pt-12">                                                    TESTIMONIALS 
  Top torn paper divider 
        <svg className="absolute top-0 left-0 right-0 h-8 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,8 Q8,4 16,8 T32,8 T48,8 T64,8 T80,8 T96,8 T112,8 T128,8 T144,8 T160,8 T176,8 T192,8 T208,8 T224,8 T240,8 T256,8 T272,8 T288,8 T304,8 T320,8 T336,8 T352,8 T368,8 T384,8 T400,8 T416,8 T432,8 T448,8 T464,8 T480,8 T496,8 T512,8 T528,8 T544,8 T560,8 T576,8 T592,8 T608,8 T624,8 T640,8 T656,8 T672,8 T688,8 T704,8 T720,8 T736,8 T752,8 T768,8 T784,8 T800,8 T816,8 T832,8 T848,8 T864,8 T880,8 T896,8 T912,8 T928,8 T944,8 T960,8 T976,8 T992,8 T1008,8 T1024,8 T1040,8 T1056,8 T1072,8 T1088,8 T1104,8 T1120,8 T1136,8 T1152,8 T1168,8 T1184,8 T1200,8 L1200,0 L0,0 Z" fill="white" stroke="none" />
        </svg>
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
  More testimonials row 
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
  Bottom torn paper divider 
        <svg className="absolute bottom-0 left-0 right-0 h-8 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,16 Q8,20 16,16 T32,16 T48,16 T64,16 T80,16 T96,16 T112,16 T128,16 T144,16 T160,16 T176,16 T192,16 T208,16 T224,16 T240,16 T256,16 T272,16 T288,16 T304,16 T320,16 T336,16 T352,16 T368,16 T384,16 T400,16 T416,16 T432,16 T448,16 T464,16 T480,16 T496,16 T512,16 T528,16 T544,16 T560,16 T576,16 T592,16 T608,16 T624,16 T640,16 T656,16 T672,16 T688,16 T704,16 T720,16 T736,16 T752,16 T768,16 T784,16 T800,16 T816,16 T832,16 T848,16 T864,16 T880,16 T896,16 T912,16 T928,16 T944,16 T960,16 T976,16 T992,16 T1008,16 T1024,16 T1040,16 T1056,16 T1072,16 T1088,16 T1104,16 T1120,16 T1136,16 T1152,16 T1168,16 T1184,16 T1200,16 L1200,24 L0,24 Z" fill="white" stroke="none" />
        </svg>
      </section>  */}

      <section className="py-16 bg-gray-50">                                                                  {/* GALLERY */}
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
          <Image
            src={GALLERY_IMAGES[galleryModal]}
            alt=""
            width={1600}
            height={1200}
            className="max-w-full max-h-[80vh] rounded-xl object-contain"
          />
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
              className="
                          bg-white/20 
                          hover:bg-white/30 
                          text-white 
                          px-8 py-4 
                          rounded-lg 
                          font-semibold 
                          flex items-center 
                          justify-center 
                          gap-2 
                          transition-colors 
                          backdrop-blur-sm text-lg
                        "
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
