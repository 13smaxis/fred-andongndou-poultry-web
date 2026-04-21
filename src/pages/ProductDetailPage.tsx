
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { STORE_WHATSAPP } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingCart, MessageCircle, ChevronRight, Minus, Plus, Truck, Shield, Clock, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      setSelectedVariant(null);
      setSelectedOption('');
      setQuantity(1);

      const { data } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .eq('handle', handle)
        .single();

      if (data) {
        let variants = data.variants || [];
        if (data.has_variants && variants.length === 0) {
          const { data: variantData } = await supabase
            .from('ecom_product_variants')
            .select('*')
            .eq('product_id', data.id)
            .order('position');
          variants = variantData || [];
          data.variants = variants;
        }

        setProduct(data);
        if (variants.length > 0) {
          const sorted = [...variants].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          const firstInStock = sorted.find((v: any) => v.inventory_qty == null || v.inventory_qty > 0) || sorted[0];
          setSelectedVariant(firstInStock);
          setSelectedOption(firstInStock?.option1 || '');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [handle]);

  const handleOptionSelect = (opt: string) => {
    setSelectedOption(opt);
    const variant = product?.variants?.find((v: any) =>
      v.option1 === opt || v.title?.toLowerCase().includes(opt.toLowerCase())
    );
    if (variant) setSelectedVariant(variant);
  };

  const variantOptions = [...new Set(product?.variants?.map((v: any) => v.option1).filter(Boolean) || [])];
  const hasVariants = product?.has_variants && product?.variants?.length > 0;

  const getInStock = (): boolean => {
    if (selectedVariant) {
      if (selectedVariant.inventory_qty == null) return true;
      return selectedVariant.inventory_qty > 0;
    }
    if (product?.variants?.length > 0) {
      return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    }
    if (product?.has_variants) return true;
    if (product?.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };
  const inStock = getInStock();

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariants && !selectedOption) return;
    if (!inStock) return;

    addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || undefined,
      name: product.name,
      variant_title: selectedVariant?.title || selectedOption || undefined,
      sku: selectedVariant?.sku || product.sku || product.handle,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0],
    }, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const variant = selectedVariant?.title || selectedOption || '';
    const msg = encodeURIComponent(
      `Hi! I'd like to order:\n\nProduct: ${product?.name}\n${variant ? `Option: ${variant}\n` : ''}Quantity: ${quantity}\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/" className="text-green-600 font-medium hover:underline">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
              <img
                src={product.images?.[selectedImage] || product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-green-600' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-green-600 font-medium uppercase tracking-wider mb-1">{product.product_type}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">Contact us for pricing</span>
              {inStock ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">In Stock</span>
              ) : (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Variant Selector */}
            {hasVariants && variantOptions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Select Option</label>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map((opt: string) => {
                    const variant = product.variants?.find((v: any) => v.option1 === opt);
                    const optInStock = variant ? (variant.inventory_qty == null || variant.inventory_qty > 0) : true;
                    return (
                      <button
                        key={opt}
                        onClick={() => optInStock && handleOptionSelect(opt)}
                        disabled={!optInStock}
                        className={`px-4 py-2.5 border-2 rounded-lg font-medium text-sm transition-all ${
                          selectedOption === opt
                            ? 'bg-green-700 text-white border-green-700'
                            : optInStock
                            ? 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-green-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:border-green-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={(hasVariants && !selectedOption) || !inStock}
                className={`flex-1 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-green-600 text-white'
                    : !inStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-700 text-white hover:bg-green-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Added to Cart!' : !inStock ? 'Out of Stock' : hasVariants && !selectedOption ? 'Select an Option' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none bg-green-500 text-white py-3.5 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Health Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 font-medium">Fresh & Healthy</span>
              </div>
            </div>

            {/* Metadata */}
            {product.metadata && Object.keys(product.metadata).length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.metadata).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
