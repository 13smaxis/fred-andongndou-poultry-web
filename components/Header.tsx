"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import 
{
  STORE_NAME,
  STORE_WHATSAPP,
  STORE_FACEBOOK_URL,
  STORE_INSTAGRAM_URL,
  SHIPPING_RULES,
  SHOP_COLLECTIONS,
} from "@/lib/constants";
import 
{
  ShoppingCart,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
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
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  const navLinkClass =
    "relative px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-green-700"; //-Desktop link styling

  const navHoverLineClass =
    "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full";

  const socialHoverLineClass =
    "relative pb-0.5 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-yellow-100 after:transition-all after:duration-300 hover:after:w-full";

  const mobileNavLinkClass =
    "px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium";                    //-Mobile link styling

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <section className="bg-green-800 text-white text-sm py-2 px-4">                                       {/* Header bar */}
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
          <Link
            href="/shop/cart"
            className="
                        md:hidden
                        relative h-10 w-10
                        rounded-xl
                        bg-gradient-to-br from-green-600 to-emerald-700
                        text-white
                        shadow-[0_8px_20px_rgba(22,163,74,0.3)]
                        ring-1 ring-green-400/30
                        flex items-center
                        justify-center
                      "
            aria-label="Open cart"
            title="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <p className="hidden md:block text-amber-100 text-xs sm:text-sm">{SHIPPING_RULES}</p>
        </div>
      </section>

      <header className="sticky top-0 z-50 bg-white shadow-sm">                                               
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">                         {/* Navbar */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>                         {/* Logo link for mobile*/}
            <Image
              src="/logo_alpha.png"
              alt={`${STORE_NAME} logo`}
              width={1024}
              height={1024}
              className="h-14 sm:h-16 md:h-20 lg:h-34 w-auto shrink-0 object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">                                                   {/* Desktop Navigation */}
            <Link href="/" 
                  className={`
                              ${navLinkClass} 
                              ${navHoverLineClass}
                              ${isActive("/") ? "text-green-700" : ""}
                            `}
            >
              Home
          </Link>
          
            <Link href="/shop" 
                  className={`
                              ${navLinkClass} 
                              ${navHoverLineClass} 
                              ${isActive("/shop") ? "text-green-700" : ""}
                            `}
            >
              Shop
            </Link>
            <Link href="/about" className={`
                              ${navLinkClass} 
                              ${navHoverLineClass} 
                              ${isActive("/about") ? "text-green-700" : ""}`}
            >
              About
            </Link>
            <Link href="/knowledge" className={`
                              ${navLinkClass} 
                              ${navHoverLineClass} 
                              ${isActive("/knowledge") ? "text-green-700" : ""}`}>
              Guides
            </Link>
            <Link href="/contact" className={`
                              ${navLinkClass} 
                              ${navHoverLineClass} 
                              ${isActive("/contact") ? "text-green-700" : ""}`}>Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">                                                   {/* Desktop shopping cart */}
            <Link
              href="/shop/cart"
              className="
                          relative h-12 w-12 
                          rounded-2xl 
                          bg-gradient-to-br from-green-600 to-emerald-700 
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
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-gray-700 hover:bg-green-50 rounded-lg"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (mobileMenuOpen) {
                setMobileShopOpen(false);
              }
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <nav className="flex flex-col p-4 gap-1">
              <Link href="/" onClick={closeMobileMenu} className={mobileNavLinkClass}>Home</Link>
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="
                            px-4 py-3 
                            text-gray-700 
                            hover:bg-green-50 hover:text-green-700 
                            rounded-lg font-medium 
                            inline-flex items-center 
                            justify-between
                          "
                aria-expanded={mobileShopOpen}
              >
                Shop
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileShopOpen && (
                <div className="flex flex-col gap-1 pl-4">
                  {SHOP_COLLECTIONS.map((col) => (
                    <Link
                      key={col.id}
                      href={`/shop/collections/${col.handle}`}
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      {col.title}
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/about" onClick={closeMobileMenu} className={mobileNavLinkClass}>About</Link>
              <Link href="/knowledge" onClick={closeMobileMenu} className={mobileNavLinkClass}>Guides</Link>
              <Link href="/contact" onClick={closeMobileMenu} className={mobileNavLinkClass}>Contact</Link>
            </nav>
          </div>
        )}
      </header>

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