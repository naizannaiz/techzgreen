import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Plus, Search } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').then(({ data, error }) => {
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 fade-in">
      <Helmet>
        <title>Eco Products Shop – Redeem Green Points | TechzGreen</title>
        <meta name="description" content="Browse and buy sustainable eco-friendly products. Redeem your green reward points for bamboo, recycled-plastic, and upcycled goods on TechzGreen." />
        <link rel="canonical" href="https://techzgreen.in/shop" />
        <meta property="og:title" content="Eco Products Shop – Redeem Green Points | TechzGreen" />
        <meta property="og:description" content="Browse and buy sustainable eco-friendly products. Redeem your green reward points for eco-friendly goods." />
        <meta property="og:url" content="https://techzgreen.in/shop" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="section-label mb-4 inline-flex"><ShoppingBag className="w-3.5 h-3.5" />Eco Shop</span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1a3d1f] mt-3">Our Eco Products</h1>
          <p className="text-[#5f7a60] mt-2 max-w-lg">Handpicked sustainable products you can buy or redeem using your earned green points.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-md mb-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 py-3"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="glass-panel p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-[rgba(46,125,50,0.2)] mx-auto mb-4" />
            <p className="text-[#5f7a60] font-semibold text-lg">
              {search ? 'No products match your search.' : 'No products yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filtered.map(product => (
              <div key={product.id} className="glass-card overflow-hidden flex flex-col group cursor-default">
                <div className="overflow-hidden relative">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-40 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock !== undefined && product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-black text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl text-[#1a3d1f] mb-1">{product.name}</h3>
                  <p className="text-[#5f7a60] text-sm mb-5 line-clamp-2 flex-grow">{product.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-[rgba(46,125,50,0.1)]">
                    <span className="font-black text-[#2e7d32] text-2xl" style={{fontFamily:'Outfit,sans-serif'}}>
                      ₹{Number(product.price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock !== undefined && product.stock <= 0}
                      className="btn-accent flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" /> {product.stock !== undefined && product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
