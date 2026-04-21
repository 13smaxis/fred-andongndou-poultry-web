
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { STORE_WHATSAPP } from '@/lib/constants';
import { ShoppingCart, MessageCircle, Eye } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const getInStock = (): boolean => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    }
    if (product.has_variants) return true;
    if (product.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };

  const inStock = getInStock();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    if (product.has_variants && product.variants?.length > 0) {
      // Navigate to product page for variant selection
      window.location.href = `/products/${product.handle}`;
      return;
    }

    addToCart({
      product_id: product.id,
      variant_id: undefined,
      name: product.name,
      variant_title: undefined,
      sku: product.sku || product.handle,
      price: product.price,
      image: product.images?.[0],
    });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = encodeURIComponent(`Hi! I'm interested in ordering: ${product.name}. Please let me know about availability.`);
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, '_blank');
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">Out of Stock</span>
            </div>
          )}
          {inStock && product.tags?.includes('featured') && (
            <span className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>
          )}
          {inStock && product.tags?.includes('bestseller') && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Bestseller</span>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={!inStock}
                className="flex-1 bg-white text-green-800 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.has_variants ? 'View Options' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors"
                title="Order via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">{product.product_type}</p>
          <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Contact us for availability</p>
            {inStock ? (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">In Stock</span>
            ) : (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">Sold Out</span>
            )}
          </div>
          {product.metadata?.next_batch && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {product.metadata.next_batch}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
