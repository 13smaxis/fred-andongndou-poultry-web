"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useCart } from "@/contexts/CartContext";
import {
  STORE_NAME,
  STORE_WHATSAPP,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_URL,
  SHIPPING_RULES,
} from "@/lib/constants";
import {
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

/*
* Builds an svg icon for a header social media link. This is used for Facebook and Instagram icons in the header.
* @param {string} className - Optional CSS classes to apply to the svg element for styling.
* @returns {JSX.Element} A JSX element representing the SVG icon.
*/ 
function FacebookIcon({ className }: { className?: string }) 
{
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" 
         className={className}
    >
      <path d="M13.5 8H16V5h-2.5A3.5 3.5 0 0 0 10 8.5V11H8v3h2v6h3v-6h2.4l.6-3H13v-2.1c0-.52.42-.9.9-.9Z" />
    </svg>
  );
}

/*
* Builds an svg icon for a header social media link. 
* This is used for Facebook and Instagram icons in the header.
* @param {string} className - Optional CSS classes to apply to the svg element for styling.
* @returns {JSX.Element} A JSX element representing the SVG icon.
*/
function InstagramIcon({ className }: { className?: string }) 
{
  return (
    <svg viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         strokeWidth="2" 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         aria-hidden="true" 
         className={className}
    >
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Header() 
{
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { cartCount, cartBumpToken } = useCart();
  const isHome = pathname === "/";
  const isCartActive = cartCount > 0;
  const shouldFixHeader = !isHome || isScrolled || isCartActive;
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 8);
      setShowScrollTop(scrollY > 360);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const hardNavigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMobileMenu();
    window.location.assign(href);
  };

  const navLinkClass = `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
    isTransparent ? "text-white hover:text-amber-200" : "text-gray-700 hover:text-green-700"
  }`;

  const navHoverLineClass =
                            `after:content-[''] after:absolute 
                             after:left-1/2 after:-translate-x-1/2 
                             after:bottom-0.5 after:h-0.5 after:w-0 
                             after:rounded-full after:transition-all 
                             after:duration-300 
                             hover:after:w-full 
                             after:bg-green-600
                            `;

  const socialHoverLineClass =
    "relative pb-0.5 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-yellow-100 after:transition-all after:duration-300 hover:after:w-full";

  const mobileNavLinkClass = "px-4 py-3 text-white hover:bg-white/10 rounded-lg font-medium";                    //-Mobile link styling

  const headerClassName = "fixed top-0 z-50 w-full";

  const mobileMenuClassName = "lg:hidden border-t border-white/10 bg-green-800 text-white";

  const mobileMenuButtonClassName = "lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg";

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <section className={isHome ? "hidden" : "bg-green-800 text-white text-sm py-2 px-4"}>                 {/* Header bar */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">                                                             {/* Social media links */}
            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={`
                          flex items-center gap-1 
                          text-amber-200 
                          hover:text-yellow-100 
                          transition-colors 
                          ${socialHoverLineClass}
                        `}
            >
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a
              href={STORE_INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={`
                          flex items-center gap-1 
                          text-amber-200 
                          hover:text-yellow-100 
                          transition-colors 
                          ${socialHoverLineClass}
                        `}
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a
              href={`https://wa.me/${STORE_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={`
                          flex items-center 
                          gap-1 text-amber-200 
                          hover:text-yellow-100 
                          transition-colors 
                          ${socialHoverLineClass}
                        `}
            >
              <MessageCircle className="w-4.5 h-4.5" />
            </a>
          </div>
          <p className="hidden md:block text-amber-100 text-xs sm:text-sm">{SHIPPING_RULES}</p>
        </div>
      </section>

      <header className={headerClassName}>                                                                      {/* Navbar */}
        <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`hidden lg:flex shrink-0 lg:ml-50 transition-all duration-300 ${isScrolled ? "pointer-events-none opacity-0 -translate-y-2 scale-95" : "opacity-100"}`}>
          {/* Desktop logo (hidden on mobile) */}
            <Link href="/" className="flex items-center gap-2" onClick={hardNavigate("/")}>                     
              <Image
                src="/logo_alpha.png"
                alt={`${STORE_NAME} logo`}
                width={1024}
                height={1024}
                className="h-14 sm:h-16 md:h-20 lg:h-34 w-auto shrink-0 object-contain"
                priority
              />
            </Link>
          </div>

          <div className="
                            hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex 
                            items-center 
                            px-2 py-2 
                            rounded-full 
                            backdrop-blur-sm 
                            bg-white/10 
                            border border-white/20 
                            shadow-lg
                          "
          >
            <nav className="flex items-center gap-1">                                                           {/* Desktop Navigation */}
              <Link href="/" 
                    onClick={hardNavigate("/")}
                    className={`
                                ${navLinkClass} 
                                ${navHoverLineClass}
                                ${isActive("/") ? "text-green-700" : ""}
                              `}
              >
                Home
            </Link>
            
              <Link href="/shop" 
                    onClick={hardNavigate("/shop")}
                    className={`
                                ${navLinkClass} 
                                ${navHoverLineClass} 
                                ${isActive("/shop") ? "text-green-700" : ""}
                              `}
              >
                Shop
              </Link>
              <Link href="/about" onClick={hardNavigate("/about")} className={`
                                ${navLinkClass} 
                                ${navHoverLineClass} 
                                ${isActive("/about") ? "text-green-700" : ""}`}
              >
                About
              </Link>
              <Link href="/products" onClick={hardNavigate("/products")} className={`
                                ${navLinkClass} 
                                ${navHoverLineClass} 
                                ${isActive("/products") ? "text-green-700" : ""}`}>
                Products
              </Link>
              <Link href="/contact" onClick={hardNavigate("/contact")} className={`
                                ${navLinkClass} 
                                ${navHoverLineClass} 
                                ${isActive("/contact") ? "text-green-700" : ""}`}>Contact</Link>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3">                                                   {/* Desktop shopping cart */}
            {cartCount > 0 && (
              <Link
                href="/shop/cart"
                onClick={hardNavigate("/shop/cart")}
                className="
                            relative h-12 w-12 
                            rounded-2xl 
                            bg-linear-to-br from-green-600 to-emerald-700 
                            text-white 
                            shadow-[0_10px_25px_rgba(22,163,74,0.35)] 
                            ring-1 ring-green-400/30 
                            transition-all duration-300 
                            hover:-translate-y-0.5 
                            hover:scale-105 hover:from-green-500 hover:to-emerald-600 
                            flex items-center 
                            justify-center
                          "
                aria-label="Open cart"
                title="Open cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <span
                  key={cartBumpToken}
                  className="animate-cart-bubble-pop absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white ring-2 ring-white"
                >
                  {cartCount}
                </span>
              </Link>
            )}
          </div>

          {/* Mobile row below header: logo left, cart + hamburger right */}
          <div className="lg:hidden w-full">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={hardNavigate("/")}>
                <Image
                  src="/logo_alpha.png"
                  alt={`${STORE_NAME} logo`}
                  width={1024}
                  height={1024}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>

              <div className="flex items-center gap-3">
                {cartCount > 0 && (
                  <Link
                    href="/shop/cart"
                    onClick={hardNavigate("/shop/cart")}
                    className="relative h-10 w-10 rounded-xl bg-linear-to-br from-green-600 to-emerald-700 text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)] ring-1 ring-green-400/30 flex items-center justify-center"
                    aria-label="Open cart"
                    title="Open cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span key={cartBumpToken} className="animate-cart-bubble-pop absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white ring-2 ring-white">{cartCount}</span>
                  </Link>
                )}
                <button className={`${mobileMenuButtonClassName}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${mobileMenuClassName} overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <nav className="flex flex-col gap-1 p-4">
              <Link href="/" onClick={hardNavigate("/")} className={mobileNavLinkClass}>Home</Link>
              <Link href="/shop" onClick={hardNavigate("/shop")} className={mobileNavLinkClass}>Shop</Link>
              <Link href="/about" onClick={hardNavigate("/about")} className={mobileNavLinkClass}>About</Link>
              <Link href="/products" onClick={hardNavigate("/products")} className={mobileNavLinkClass}>Products</Link>
              <Link href="/contact" onClick={hardNavigate("/contact")} className={mobileNavLinkClass}>Contact</Link>
          </nav>
        </div>
      </header>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        title="Scroll to top"
        className={`fixed bottom-24 right-0 z-40 flex h-28 w-11 items-center justify-center rounded-l-2xl bg-black text-white shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900 md:bottom-28 ${
          showScrollTop
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-5 opacity-0"
        }`}
      >
        <span className="rotate-180 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
          Back To Top
        </span>
      </button>

      <a
        href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent("Hi! I would like to place an order.")}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        title="Order via WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </>
  );
}