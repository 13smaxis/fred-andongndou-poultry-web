import type { StaticImageData } from "next/image";

import heroBgEgg from "../images/hero-bg-egg.jpg";
import heroBgFullChicken from "../images/hero-bg-full-chicken.jpg";
import heroBgThigh from "../images/hero-bg-thigh.jpg";
import broilerFeed from "../images/broiler-feed.jpg";
import freeRangeBroilers from "../images/free-range-broilers.jpg";
import thighs from "../images/thighs.png";

export const STORE_NAME = "Five Seasons Farm";
export const STORE_TAGLINE = "Fresh. Healthy. Trusted.";
export const STORE_PHONE = "+447533 621359";
export const STORE_WHATSAPP = "447533621359";
export const STORE_FACEBOOK_URL = "https://www.facebook.com/fiveseasonsfarm";
export const STORE_INSTAGRAM_URL = "https://www.instagram.com/fiveseasonsfarm";
export const STORE_EMAIL = "orders@fiveseasonsfarm.com";
export const STORE_ADDRESS = "1234 Farm Road, Green Valley, 7000";
export const SHIPPING_RULES = "Free shipping on all orders";

export const HERO_IMAGE = "/hero.png";

export const HERO_CAROUSEL_IMAGES: StaticImageData[] = [
  heroBgEgg,
  heroBgThigh,
  heroBgFullChicken,
  thighs,
  broilerFeed,
  freeRangeBroilers,
];

export const GALLERY_IMAGES = [
  "https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149519358_ae033f06.jpg",
  "https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149520636_5431aa6c.jpg",
  "https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149514570_6008e229.jpg",
  "https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149522381_a3f3f7fa.jpg",
];

export const SHOP_COLLECTIONS = [
  { id: "live-birds", title: "Live Birds", handle: "live-birds" },
  { id: "day-old-chicks", title: "Day-Old Chicks", handle: "day-old-chicks" },
  { id: "farm-fresh-eggs", title: "Farm Fresh Eggs", handle: "farm-fresh-eggs" },
  { id: "chicken-mixed-portions", title: "Chicken Mixed Portions", handle: "chicken-mixed-portions" },
];