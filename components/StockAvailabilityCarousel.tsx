"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { SHOP_PRODUCTS } from '@/lib/shop-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface StockItem {
  product: string;
  status: string;
  qty: string;
  color: 'green' | 'amber';
}

interface StockAvailabilityCarouselProps {
  stockUpdates: readonly StockItem[];
}

const getProductImage = (productName: string): string => {
  const productLower = productName.toLowerCase();
  
  if (productLower.includes('egg')) {
    const eggProduct = SHOP_PRODUCTS.find(p => p.category === 'Eggs');
    return eggProduct?.image || SHOP_PRODUCTS[0]?.image || '';
  }
  
  if (productLower.includes('free-range') || productLower.includes('broiler')) {
    const broilerProduct = SHOP_PRODUCTS.find(p => p.category === 'Live Chicken');
    return broilerProduct?.image || SHOP_PRODUCTS[0]?.image || '';
  }
  
  if (productLower.includes('chick')) {
    const chicksProduct = SHOP_PRODUCTS.find(p => p.name.toLowerCase().includes('chick'));
    return chicksProduct?.image || SHOP_PRODUCTS[0]?.image || '';
  }
  
  return SHOP_PRODUCTS[0]?.image || '';
};

const STOCK_BREAKPOINTS = {
  0: { slidesPerView: 1.0, spaceBetween: 10 },
  768: { slidesPerView: 1.8, spaceBetween: 12 },
  960: { slidesPerView: 2.4, spaceBetween: 14 },
  1280: { slidesPerView: 3.1, spaceBetween: 16 },
  1536: { slidesPerView: 3.9, spaceBetween: 18 },
} as const;

const MOBILE_BREAKPOINTS = {
  0: { slidesPerView: 1, spaceBetween: 12 },
  480: { slidesPerView: 1, spaceBetween: 14 },
  640: { slidesPerView: 1, spaceBetween: 16 },
} as const;

export default function StockAvailabilityCarousel({ stockUpdates }: StockAvailabilityCarouselProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const swiperConfig = useMemo(() => {
    if (isMobile) {
      return {
        effect: 'slide' as const,
        centeredSlides: false,
        speed: 600,
        breakpoints: MOBILE_BREAKPOINTS,
      };
    }

    return {
      effect: 'coverflow' as const,
      centeredSlides: true,
      speed: 800,
      breakpoints: STOCK_BREAKPOINTS,
      coverflowEffect: {
        rotate: 8,
        stretch: -12,
        depth: 150,
        modifier: 1,
        slideShadows: false,
      },
    };
  }, [isMobile]);

  const cycleRegion = useCallback(
    (direction: 1 | -1) => {
      if (!swiperInstance) return;

      if (direction > 0) {
        swiperInstance.slideNext();
      } else {
        swiperInstance.slidePrev();
      }
    },
    [swiperInstance]
  );

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    setSwiperInstance(swiper);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isCarouselVisible) return;

    const fallbackTimer = window.setTimeout(() => {
      setIsCarouselVisible(true);
    }, 800);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          setIsCarouselVisible(true);
          window.clearTimeout(fallbackTimer);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.2, 0.5, 1], rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(section);

    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [isCarouselVisible]);

  return (
    <section ref={sectionRef} className="relative py-8 [--swiper-theme-color:#16a34a]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isCarouselVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full md:left-1/2 md:w-screen md:-translate-x-1/2"
      >
        <div className="relative w-full">
          {!isMobile && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-20 bg-linear-to-r from-gray-700 via-gray-700/75 to-transparent md:w-28" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-20 bg-linear-to-l from-gray-700 via-gray-700/75 to-transparent md:w-28" />
            </>
          )}

          <Swiper
            modules={[EffectCoverflow, A11y, Mousewheel]}
            dir="ltr"
            onSwiper={handleSwiperInit}
            onSlideChangeTransitionEnd={(swiper: SwiperType) => {
              setActiveIndex(swiper.realIndex);
            }}
            effect={swiperConfig.effect}
            centeredSlides={swiperConfig.centeredSlides}
            slidesPerGroup={1}
            loop={false}
            rewind={true}
            grabCursor
            mousewheel={
              !isMobile
                ? {
                    forceToAxis: true,
                    releaseOnEdges: true,
                    sensitivity: 1,
                    thresholdDelta: 36,
                    thresholdTime: 300,
                  }
                : false
            }
            speed={swiperConfig.speed}
            spaceBetween={18}
            breakpoints={swiperConfig.breakpoints}
            className="stock-carousel overflow-visible! px-2 md:px-8"
            {...(swiperConfig.effect === 'coverflow' && swiperConfig.coverflowEffect
              ? { coverflowEffect: swiperConfig.coverflowEffect }
              : {})}
          >
            {stockUpdates.map((item, index) => {
              const image = getProductImage(item.product);

              return (
                <SwiperSlide key={`${item.product}-${index}`} className="h-auto! py-3">
                  <div className="relative overflow-hidden rounded-2xl border border-green-500/30 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:border-green-500/60 h-70 md:h-90">
                    <Image
                      src={image}
                      alt={item.product}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.color === 'green' ? 'bg-green-400' : 'bg-amber-400'
                          } animate-pulse`}
                        />
                        <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                          Stock Available
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.product}</h3>
                      <p className="text-green-200 text-sm md:text-base font-semibold">{item.qty}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => cycleRegion(-1)}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-12 rounded-full bg-green-500 p-2 text-white transition-all hover:bg-green-600 md:left-4 md:translate-x-0"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={() => cycleRegion(1)}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-12 rounded-full bg-green-500 p-2 text-white transition-all hover:bg-green-600 md:right-4 md:translate-x-0"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Pagination Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {stockUpdates.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => swiperInstance?.slideTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'w-8 bg-green-500' : 'w-2 bg-green-300/50 hover:bg-green-300'
                }`}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}