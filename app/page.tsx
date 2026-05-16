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
  ArrowRight, Phone, MessageCircle, Truck, Shield, Leaf,
  Camera, Calendar, ShoppingCart, Users, Heart, Egg, Syringe, Bug, Utensils,
  Bird, Drumstick, Package, Wheat,
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
 *    - Products Preview, Gallery, CTA, and Delivery Info. 
 */
export default function Home() 
{
  const [galleryModal, setGalleryModal] = useState<number | null>(null);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const featuredProducts = useMemo(() => {
    const seen = new Set<string>();
    return SHOP_PRODUCTS.filter((product) => product.tags?.includes('featured')).filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, []);

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

      <section className="py-16 bg-gray-700">                                                                   {/* FEATURED PRODUCTS */}
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
          <div className="mx-auto grid w-fit grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-0.5 bg-gray-700">                                                                  {/* STOCK AVAILABILITY */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="rounded-4xl bg-gray-700 p-3">
            <div className="relative rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
              <div
                className="absolute inset-0 bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url(${HERO_IMAGE})` }}
              />
              <div className="
                                absolute 
                                inset-0 
                              " 
              />                                                                                                {/* No overlay for this section to keep it brighter for readability bg-linear-to-br from-black/40 via-slate-900/35 to-black/25 */}
              <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="text-center mb-6">
                  <Calendar className="w-10 h-10 text-white mx-auto mb-3" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    Stock <span className="text-yellow-400">Availability</span>
                  </h2>
                </div>

                <div className="flex justify-center mb-6">
                  <p className="
                                  text-center text-lg text-gray-200 
                                  bg-amber-800 
                                  inline-flex 
                                  px-4 py-2 
                                  rounded-lg
                                "
                  >
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
        </div>
      </section>

      <section className="py-px bg-gray-700 md:sticky md:top-[0.7rem] md:z-10">                                 {/* OUR PRODUCTS SECTION*/}
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="rounded-4xl bg-gray-700 p-3 mb-32">
            <div className="relative overflow-hidden rounded-4xl border border-white/10 shadow-2xl">
              <div className="
                              absolute 
                              inset-0 
                              bg-fixed bg-center bg-cover" 
                   style={{ backgroundImage: `url(${HERO_IMAGE})` }} 
              />
              <div className="absolute inset-0" />
              <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
                <div className="mb-6 text-center">
                  <Package className="mx-auto mb-3 h-10 w-10 text-green-200" />
                  <h2 className="mb-1 text-2xl font-bold text-white md:text-3xl">
                    Our <span className="text-yellow-400">Products</span>
                  </h2>
                 
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      title: 'Live Chickens',
                      desc: 'Healthy broilers, day-old chicks, hens, and free-range birds for every flock size.',
                      Icon: Bird,
                      category: 'Live Chicken',
                    },
                    {
                      title: 'Chicken Portions',
                      desc: 'Fresh-cut wings, thighs, breasts, backs, and mixed portions for easy meals.',
                      Icon: Drumstick,
                      category: 'Tender Chicken Portions',
                    },
                    {
                      title: 'Eggs',
                      desc: 'Farm-fresh trays of large and jumbo eggs for households, bakeries, and caterers.',
                      Icon: Egg,
                      category: 'Eggs',
                    },
                    {
                      title: 'Feed',
                      desc: 'Grower and layer feed designed to support healthy growth and strong egg output.',
                      Icon: Wheat,
                      category: 'Feed',
                    },
                  ].map((product) => (
                    <Link
                      key={product.title}
                      href={`/products?category=${encodeURIComponent(product.category)}`}
                      className="
                                  group 
                                  flex h-full flex-col 
                                  gap-4 
                                  rounded-2xl 
                                  border border-white/10 bg-white/10 p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="
                                        flex h-12 w-12 
                                        items-center 
                                        justify-center 
                                        rounded-2xl 
                                        bg-emerald-400/20 
                                        text-green-200 
                                        ring-1 ring-white/10
                                      "
                        >
                          <product.Icon className="h-6 w-6" />
                        </div>
                        <span className="
                                          rounded-full 
                                          bg-white/10 
                                          px-3 py-1 
                                          text-xs font-medium text-green-100
                                        "
                                      >
                                  View range
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="
                                        text-lg 
                                        font-semibold text-white 
                                        group-hover:text-green-300
                                      "
                        >
                            {product.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-200">{product.desc}</p>
                      </div>
                      <span className="
                                        mt-auto 
                                        inline-flex 
                                        items-center 
                                        gap-2 
                                        text-sm font-semibold text-yellow-300
                                      "
                      >
                          Explore products
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mt-24 rounded-t-[40px] bg-gray-50 py-16 shadow-2xl">                    {/* GALLERY SECTION */}
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
                className="aspect-video overflow-hidden rounded-xl shadow-sm transition-all hover:shadow-lg group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Farm gallery ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {galleryModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setGalleryModal(null)}>
          <Image
            src={GALLERY_IMAGES[galleryModal]}
            alt=""
            width={1600}
            height={1200}
            className="max-h-[80vh] max-w-full rounded-xl object-contain"
          />
          <button
            onClick={() => setGalleryModal(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70"
          >
            ×
          </button>
        </div>
      )}

      <section className="py-24 bg-gray-50 md:sticky md:top-[0.7rem] md:z-30">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-4xl bg-green-800 px-6 py-12 shadow-2xl ring-1 ring-black/10 sm:px-10 md:px-12">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Order?</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-green-200">
              Whether you need a few birds for your family or thousands for your business, we&apos;re here to serve you.
              <span className="font-bold text-yellow-300"> Order online or via WhatsApp today.</span>
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push('/shop')}
                className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <ShoppingCart className="h-5 w-5" />
                Browse Products
              </button>
              <a
                href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent('Hi! I would like to place a bulk order. Please share product availability.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Bulk Order Enquiry
              </a>
              <a
                href={`tel:${STORE_PHONE}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-t-[40px] bg-green-400 py-2 md:sticky md:top-[0.7rem] md:z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <Truck className="mx-auto mb-3 h-10 w-10 text-green-600" />
            <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">Delivery & Pickup</h2>
            <p className="text-gray-600">We deliver across the region. {SHIPPING_RULES}.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { area: 'Local Area', days: 'Mon, Wed, Fri', time: 'Same day' },
              { area: 'Metro Area', days: 'Tue, Thu', time: 'Next day' },
              { area: 'Regional', days: 'Saturdays', time: '2-3 days' },
              { area: 'Nationwide', days: 'Mon - Fri', time: '3-5 days' },
            ].map((zone) => (
              <div key={zone.area} className="rounded-xl bg-green-50 p-5 text-center">
                <h3 className="mb-2 font-bold text-gray-900">{zone.area}</h3>
                <p className="mb-1 text-sm text-gray-600">{zone.days}</p>
                <p className="text-sm font-medium text-green-600">{zone.time} delivery</p>
                <p className="mt-2 text-xs text-gray-500">Minimum order applies</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800">
              View Full Delivery Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
