"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, Phone, ShoppingCart } from "lucide-react";

import {
  HERO_CAROUSEL_IMAGES,
  STORE_NAME,
  STORE_PHONE,
  STORE_WHATSAPP,
} from "@/lib/constants";

const AUTOPLAY_DELAY = 5500;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isResettingTransform, setIsResettingTransform] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(media.matches);
    };

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isPaused || HERO_CAROUSEL_IMAGES.length < 2 || !isImageLoaded || nextIndex !== null) {
      return;
    }

    const timer = window.setTimeout(() => {
      const upcomingIndex = (activeIndex + 1) % HERO_CAROUSEL_IMAGES.length;

      if (prefersReducedMotion) {
        setActiveIndex(upcomingIndex);
        return;
      }

      setNextIndex(upcomingIndex);
    }, AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, isImageLoaded, nextIndex, prefersReducedMotion]);

  useEffect(() => {
    if (!isResettingTransform) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsResettingTransform(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isResettingTransform]);

  return (
    <section
      className="relative isolate min-h-[82vh] overflow-hidden bg-black md:min-h-[88vh]"
      aria-roledescription="carousel"
      aria-label="Farm hero showcase"
    >
      <div className="relative min-h-[82vh] lg:hidden">
        <div className="absolute inset-0 overflow-hidden bg-black">
          <div className="relative h-full w-full overflow-hidden">
            <div
              className={`flex h-full w-full ${
                isResettingTransform
                  ? "transition-none"
                  : "transition-transform duration-1000 ease-out"
              } ${isTransitioning ? "-translate-x-full" : "translate-x-0"}`}
              onTransitionEnd={(event) => {
                if (event.target !== event.currentTarget || nextIndex === null) {
                  return;
                }

                setActiveIndex(nextIndex);
                setNextIndex(null);
                setIsTransitioning(false);
                setIsResettingTransform(true);
                setIsImageLoaded(false);
              }}
            >
              <div className="relative h-full w-full shrink-0 overflow-hidden">
                <Image
                  key={HERO_CAROUSEL_IMAGES[activeIndex].src}
                  src={HERO_CAROUSEL_IMAGES[activeIndex]}
                  alt={`${STORE_NAME} hero image ${activeIndex + 1}`}
                  fill
                  priority={activeIndex === 0}
                  sizes="100vw"
                  className="object-cover"
                  onLoadingComplete={() => {
                    setIsImageLoaded(true);
                  }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              {nextIndex !== null && (
                <div className="relative h-full w-full shrink-0 overflow-hidden">
                  <Image
                    key={HERO_CAROUSEL_IMAGES[nextIndex].src}
                    src={HERO_CAROUSEL_IMAGES[nextIndex]}
                    alt={`${STORE_NAME} hero image ${nextIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    onLoadingComplete={() => {
                      setIsTransitioning(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              )}
            </div>
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 pt-24 sm:px-8 sm:pb-10">
          <div className="max-w-md text-white">
            {/*  <span className="mb-4 inline-flex rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20">
              Trusted Since 2009
            </span>*/}
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Fresh. Healthy.
              <br />
              <span className="text-amber-300">Trusted.</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-emerald-50/95 md:text-lg">
              Premium poultry products from our family farm to your table. Broilers, layers, day-old chicks,
              eggs, and chicken mixed portions.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <ShoppingCart className="h-5 w-5" />
                Shop Now
              </Link>
              <a
                href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
                  "Hi! I would like to place an order."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Order
              </a>
              <a
                href={`tel:${STORE_PHONE}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-100/80">
              <span className="h-px w-10 bg-emerald-100/60" />
              Farm direct delivery
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-h-[82vh] flex-col lg:flex lg:min-h-[88vh] lg:flex-row">
        <div className="flex w-full items-center bg-emerald-950 px-6 py-14 sm:px-8 md:px-10 lg:w-[30%] lg:px-12">
          <div className="max-w-md text-white">
            {/*  <span className="mb-4 inline-flex rounded-full bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20">
              Trusted Since 2009
            </span>*/}
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Fresh. Healthy.
              <br />
              <span className="text-amber-300">Trusted.</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-emerald-50/95 md:text-lg">
              Premium poultry products from our family farm to your table. Broilers, layers, day-old chicks,
              eggs, and chicken mixed portions.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <ShoppingCart className="h-5 w-5" />
                Shop Now
              </Link>
              <a
                href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
                  "Hi! I would like to place an order."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Order
              </a>
              <a
                href={`tel:${STORE_PHONE}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-100/80">
              <span className="h-px w-10 bg-emerald-100/60" />
              Farm direct delivery
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden bg-black lg:w-[70%]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="relative h-full w-full overflow-hidden">
              <div
                className={`flex h-full w-full ${
                  isResettingTransform
                    ? "transition-none"
                    : "transition-transform duration-1000 ease-out"
                } ${isTransitioning ? "-translate-x-full" : "translate-x-0"}`}
                onTransitionEnd={(event) => {
                  if (event.target !== event.currentTarget || nextIndex === null) {
                    return;
                  }

                  setActiveIndex(nextIndex);
                  setNextIndex(null);
                  setIsTransitioning(false);
                  setIsResettingTransform(true);
                  setIsImageLoaded(false);
                }}
              >
                <div className="relative h-full w-full shrink-0 overflow-hidden">
                  <Image
                    key={HERO_CAROUSEL_IMAGES[activeIndex].src}
                    src={HERO_CAROUSEL_IMAGES[activeIndex]}
                    alt={`${STORE_NAME} hero image ${activeIndex + 1}`}
                    fill
                    priority={activeIndex === 0}
                    sizes="70vw"
                    className="object-cover"
                    onLoadingComplete={() => {
                      setIsImageLoaded(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                {nextIndex !== null && (
                  <div className="relative h-full w-full shrink-0 overflow-hidden">
                    <Image
                      key={HERO_CAROUSEL_IMAGES[nextIndex].src}
                      src={HERO_CAROUSEL_IMAGES[nextIndex]}
                      alt={`${STORE_NAME} hero image ${nextIndex + 1}`}
                      fill
                      sizes="70vw"
                      className="object-cover"
                      onLoadingComplete={() => {
                        setIsTransitioning(true);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                )}
              </div>
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}