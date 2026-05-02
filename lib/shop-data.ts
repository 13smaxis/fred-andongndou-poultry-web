import eggsImage from "@/images/eggs.jpg";
import wingsImage from "@/images/wings.png";
import breastsImage from "@/images/breasts.png";
import backsImage from "@/images/backs.png";
import thighsImage from "@/images/thighs.png";
import portionImage from "@/images/portions.png";
import broilerImage from "@/images/broilers.jpg";
import chicksImage from "@/images/day-old-broiler-chicks.jpg";
import hensImage from "@/images/point-of-lay-hens.jpg";
import freeRangeImage from "@/images/free-range-broilers.jpg";
import eggJumboImage from "@/images/jumbo-eggs.jpg";
import growerImage from "@/images/grower-feed.webp";
import layerImage from "@/images/layer-feed.jpg";

export type ShopCategory = "All" | "Live Chicken" | "Tender Chicken Portions" | "Eggs" | "Feed";

export interface ShopProduct 
{
    id: string;
    name: string;
    category: Exclude<ShopCategory, "All">;
    description: string;
    size: string;
    image: string;
    tags?: string[];
    price: number;
    inStock?: boolean;
}

export interface PromotionSlide 
{
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    image: string;
}

const eggsSrc = eggsImage.src;
const wingsSrc = wingsImage.src;
const breastsSrc = breastsImage.src;
const backsSrc = backsImage.src;
const thighsSrc = thighsImage.src;
const mixedPortionSrc = portionImage.src;
const broilersSrc = broilerImage.src;
const chicksSrc = chicksImage.src;
const hensSrc = hensImage.src;
const freeRangeSrc = freeRangeImage.src;
const jumboEggsSrc = eggJumboImage.src;
const growerFeedSrc = growerImage.src;
const layerFeedSrc = layerImage.src;

export const SHOP_CATEGORIES: ShopCategory[] = ["All", "Live Chicken", "Tender Chicken Portions", "Eggs", "Feed"];

export const SHOP_PRODUCTS: ShopProduct[] = [

    /*-------------- Chicken Portions --------------*/
    {
        id: "chicken-wings-premium",
        name: "Premium Chicken Wings",
        category: "Tender Chicken Portions",
        description: "Fresh-cut wings, perfect for grills and family meals.",
        size: "5kg pack",
        image: wingsSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 15.99,
    },
    {
        id: "chicken-drumsticks-premium",
        name: "Premium Chicken Drumsticks",
        category: "Tender Chicken Portions",
        description: "Tender drumsticks, perfect for grills and family meals.",
        size: "5kg pack",
        image: thighsSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 14.99,
    },
    {
        id: "chicken-mixed-portions",
        name: "Premium Chicken Mixed Portions",
        category: "Tender Chicken Portions",
        description: "Tender drumsticks, perfect for grills and family meals.",
        size: "5kg pack",
        image: mixedPortionSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 16.99,
    },
    {
        id: "chicken-thighs-premium",
        name: "Premium Chicken Thighs",
        category: "Tender Chicken Portions",
        description: "Tender chicken thighs, perfect for grills and family meals.",
        size: "5kg pack",
        image: thighsSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 14.99,
    },
    {
        id: "chicken-backs-premium",
        name: "Premium Chicken Backs",
        category: "Tender Chicken Portions",
        description: "Tender chicken backs, perfect for grills and family meals.",
        size: "5kg pack",
        image: backsSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 14.99,
    },
    {
        id: "chicken-breasts-premium",
        name: "Premium Chicken Breasts",
        category: "Tender Chicken Portions",
        description: "Tender chicken breasts, perfect for grills and family meals.",
        size: "5kg pack",
        image: breastsSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 15.99,
    },

    /*-------------- Live Chickens --------------*/
    {
        id: "broilers-premium",
        name: "Premium Broilers (Live)",
        category: "Live Chicken",
        description: "Healthy live broilers, ready for pickup or delivery.",
        size: "1-2kg",
        image: broilersSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 15.99,
    },
    {
        id: "broilers-day-old-chicks",
        name: "Day old chicks (Live)",
        category: "Live Chicken",
        description: "Healthy live chicks, ready for pickup or delivery.",
        size: "0.5-1kg",
        image: chicksSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 12.99,
    },
    {
        id: "point-of-lay-hens-premium",
        name: "Point of Lay Hens (Live)",
        category: "Live Chicken",
        description: "Healthy live layer hens, ready for pickup or delivery.",
        size: "1-2kg",
        image: hensSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 14.99,
    },
     {
        id: "free-range-broilers-premium",
        name: "Free-Range Broilers (Live)",
        category: "Live Chicken",
        description: "Healthy live free-range broilers, ready for pickup or delivery.",
        size: "1-2kg",
        image: freeRangeSrc,
        tags: ["featured", "bestseller"],
        inStock: true,
        price: 15.99,
    },

    /*-------------- Eggs --------------*/
    {
        id: "farm-eggs-tray-large",
        name: "Farm Fresh Eggs (Tray)",
        category: "Eggs",
        description: "Clean, fresh eggs packed daily from the farm.",
        size: "30 large eggs per tray",
        image: eggsSrc,
        tags: ["featured"],
        inStock: true,
        price: 12.99,
    },
    {
        id: "farm-eggs-jumbo",
        name: "Farm Eggs (Jumbo)",
        category: "Eggs",
        description: "Large-size eggs ideal for bakeries and caterers.",
        size: "60 jumbo eggs per tray",
        image: jumboEggsSrc,
        tags: ["bestseller"],
        inStock: true,
        price: 19.99,
    },

    /*-------------- Feed --------------*/
    {
        id: "grower-feed-25kg",
        name: "Grower Feed 25kg",
        category: "Feed",
        description: "Balanced nutrition for healthy growth.",
        size: "25kg bag",
        image: growerFeedSrc,
        tags: ["discount"],
        inStock: true,
        price: 14.99,
    },
    {
        id: "layer-feed-25kg",
        name: "Layer Feed 25kg",
        category: "Feed",
        description: "Formulated feed for strong egg production.",
        size: "25kg bag",
        image: layerFeedSrc,
        tags: ["discount"], 
        inStock: true,
        price: 12.99,
    },
];

/*-------------- Promotions Slide --------------*/

export const SHOP_PROMOTIONS: PromotionSlide[] = [
    {
        id: "best-sellers",
        title: "Best Sellers This Week",
        subtitle: "Top picks loved by households and restaurants.",
        badge: "Best Buy",
        image: broilersSrc,
    },
    {
        id: "weekly-discounts",
        title: "Weekly Discounts",
        subtitle: "Save more on bulk wings and feed bundles.",
        badge: "Discount",
        image: growerFeedSrc,
    },
    {
        id: "featured-items",
        title: "Featured Farm Picks",
        subtitle: "Fresh eggs picked daily from the farm.",
        badge: "Featured",
        image: eggsSrc,
    },
];
