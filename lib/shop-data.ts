import eggsImage from "@/images/eggs.jpg";
import wingsImage from "@/images/wings.png";

export type ShopCategory = "All" | "Chicken" | "Eggs" | "Feed" | "Equipment";

export interface ShopProduct {
  id: string;
  name: string;
  category: Exclude<ShopCategory, "All">;
  description: string;
  image: string;
  tags?: string[];
  inStock?: boolean;
}

export interface PromotionSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
}

const eggsSrc = eggsImage.src;
const wingsSrc = wingsImage.src;

export const SHOP_CATEGORIES: ShopCategory[] = ["All", "Chicken", "Eggs", "Feed", "Equipment"];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "chicken-wings-premium",
    name: "Premium Chicken Wings",
    category: "Chicken",
    description: "Fresh-cut wings, perfect for grills and family meals.",
    image: wingsSrc,
    tags: ["featured", "bestseller"],
    inStock: true,
  },
  {
    id: "chicken-wings-bulk",
    name: "Chicken Wings (Bulk Pack)",
    category: "Chicken",
    description: "Value pack for restaurants and events.",
    image: wingsSrc,
    tags: ["discount"],
    inStock: true,
  },
  {
    id: "farm-eggs-tray",
    name: "Farm Fresh Eggs (Tray)",
    category: "Eggs",
    description: "Clean, fresh eggs packed daily from the farm.",
    image: eggsSrc,
    tags: ["featured"],
    inStock: true,
  },
  {
    id: "farm-eggs-jumbo",
    name: "Farm Eggs (Jumbo)",
    category: "Eggs",
    description: "Large-size eggs ideal for bakeries and caterers.",
    image: eggsSrc,
    tags: ["bestseller"],
    inStock: true,
  },
  {
    id: "grower-feed-25kg",
    name: "Grower Feed 25kg",
    category: "Feed",
    description: "Balanced nutrition for healthy growth.",
    image: wingsSrc,
    tags: ["discount"],
    inStock: true,
  },
  {
    id: "layer-feed-25kg",
    name: "Layer Feed 25kg",
    category: "Feed",
    description: "Formulated feed for strong egg production.",
    image: eggsSrc,
    inStock: true,
  },
  {
    id: "brooder-heater-kit",
    name: "Brooder Heater Kit",
    category: "Equipment",
    description: "Reliable starter kit for day-old chicks.",
    image: wingsSrc,
    inStock: true,
  },
  {
    id: "drinkers-feeders-set",
    name: "Drinkers and Feeders Set",
    category: "Equipment",
    description: "Durable feeding and watering set for daily use.",
    image: eggsSrc,
    inStock: true,
  },
];

export const SHOP_PROMOTIONS: PromotionSlide[] = [
  {
    id: "best-sellers",
    title: "Best Sellers This Week",
    subtitle: "Top picks loved by households and restaurants.",
    badge: "Best Buy",
    image: wingsSrc,
  },
  {
    id: "weekly-discounts",
    title: "Weekly Discounts",
    subtitle: "Save more on bulk wings and feed bundles.",
    badge: "Discount",
    image: eggsSrc,
  },
  {
    id: "featured-items",
    title: "Featured Farm Picks",
    subtitle: "Fresh eggs and premium chicken cuts ready now.",
    badge: "Featured",
    image: wingsSrc,
  },
];
