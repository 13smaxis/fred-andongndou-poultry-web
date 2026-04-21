
export const STORE_NAME = 'Five Seasons Farm';
export const STORE_TAGLINE = 'Fresh. Healthy. Trusted.';
export const STORE_PHONE = '+447533 621359';
export const STORE_WHATSAPP = '447533621359';
export const STORE_FACEBOOK_URL = 'https://www.facebook.com/fiveseasonsfarm';
export const STORE_INSTAGRAM_URL = 'https://www.instagram.com/fiveseasonsfarm';
export const STORE_EMAIL = 'orders@fiveseasonsfarm.com';
export const STORE_ADDRESS = '1234 Farm Road, Green Valley, 7000';
export const SHIPPING_RULES = 'Free shipping on all orders';

export const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149356465_6a11b9c7.jpg';

export const GALLERY_IMAGES = [
  'https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149519358_ae033f06.jpg',
  'https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149520636_5431aa6c.jpg',
  'https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149514570_6008e229.jpg',
  'https://d64gsuwffb70l.cloudfront.net/69b01c4429e71c971920f7e9_1773149522381_a3f3f7fa.jpg',
];

export const STRIPE_ACCOUNT_ID = 'STRIPE_ACCOUNT_ID';

export const formatPrice = (cents: number) => {
  return '$' + (cents / 100).toFixed(2);
};
