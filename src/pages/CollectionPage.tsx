
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('manual');

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!handle) return;
      setLoading(true);

      const sourceHandle = handle === 'chicken-mixed-portions' ? 'poultry-feed' : handle;

      const { data: collectionData } = await supabase
        .from('ecom_collections')
        .select('*')
        .eq('handle', sourceHandle)
        .single();

      if (!collectionData) { setLoading(false); return; }
      const normalizedCollection = sourceHandle === 'poultry-feed'
        ? { ...collectionData, title: 'Chicken Mixed Portions', handle: 'chicken-mixed-portions' }
        : collectionData;
      setCollection(normalizedCollection);

      const { data: productLinks } = await supabase
        .from('ecom_product_collections')
        .select('product_id, position')
        .eq('collection_id', collectionData.id)
        .order('position');

      if (!productLinks || productLinks.length === 0) { setProducts([]); setLoading(false); return; }

      const productIds = productLinks.map(pl => pl.product_id);
      const { data: productsData } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .in('id', productIds)
        .eq('status', 'active');

      const sortedProducts = productIds.map(id => productsData?.find(p => p.id === id)).filter(Boolean);
      setProducts(sortedProducts as any[]);
      setLoading(false);
    };

    fetchCollectionProducts();
  }, [handle]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-700">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{collection?.title || 'Collection'}</span>
        </nav>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{collection?.title}</h1>
                {collection?.description && <p className="text-gray-600 mt-2 max-w-2xl">{collection.description}</p>}
                <p className="text-sm text-gray-500 mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="manual">Default</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products in this collection yet.</p>
                <Link to="/" className="text-green-600 font-medium hover:underline mt-2 inline-block">Browse all products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
