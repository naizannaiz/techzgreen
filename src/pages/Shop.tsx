import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GCoinIcon } from '../components/GCoin';
import { ShoppingBag, Search, Check, Leaf } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const { totalPoints, user } = useAuth();

  useEffect(() => {
    supabase.from('products').select('*').then(({ data, error }) => {
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedIds(prev => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fade-in bottom-nav-safe">
      <Helmet>
        <title>Eco Products Shop – Redeem Green Points | TechzGreen</title>
        <meta name="description" content="Browse and buy sustainable eco-friendly products. Redeem your green reward points for bamboo, recycled-plastic, and upcycled goods on TechzGreen." />
        <link rel="canonical" href="https://techzgreen.in/shop" />
        <meta property="og:title" content="Eco Products Shop – Redeem Green Points | TechzGreen" />
        <meta property="og:url" content="https://techzgreen.in/shop" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Desktop Hero Header ── */}
      <div className="hidden sm:block px-4 pt-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="section-label inline-flex"><Leaf className="w-3.5 h-3.5" />Sustainable Store</span>
              <h1 className="text-4xl lg:text-5xl font-black text-[#1a3d1f] mt-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Eco Shop
              </h1>
              <p className="text-[#5f7a60] text-base max-w-md leading-relaxed">
                Browse eco-friendly products made from recycled materials. Every purchase supports a greener future.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                  <GCoinIcon size={28} />
                  <div className="text-left">
                    <p className="text-[10px] text-[#5f7a60] font-bold uppercase tracking-wide">Your Balance</p>
                    <p className="text-xl font-black text-[#1a3d1f] leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{totalPoints} G</p>
                  </div>
                </div>
              )}
              <div className="text-right">
                <p className="text-3xl font-black text-[#2e7d32]" style={{ fontFamily: 'Outfit, sans-serif' }}>{filtered.length}</p>
                <p className="text-sm text-[#5f7a60] font-semibold">Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Search Bar ── */}
      <div className="sticky top-[72px] z-30 bg-[rgba(238,245,233,0.95)] backdrop-blur-sm px-4 pt-3 pb-3 border-b border-[rgba(46,125,50,0.08)]">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: title + count inline */}
          <div className="flex items-center gap-3 mb-2 sm:hidden">
            <ShoppingBag className="w-5 h-5 text-[#2e7d32]" />
            <h1 className="font-black text-[#1a3d1f] text-xl" style={{ fontFamily: 'Outfit,sans-serif' }}>Eco Shop</h1>
            {user && (
              <span className="ml-auto flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                <GCoinIcon size={16} />
                <span className="text-xs font-black text-[#1a3d1f]">{totalPoints}</span>
              </span>
            )}
            <span className={`text-xs text-[#5f7a60] font-semibold ${user ? '' : 'ml-auto'}`}>{filtered.length} items</span>
          </div>
          {/* Search row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-grow sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-glass !py-2.5"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <span className="hidden sm:block text-sm text-[#5f7a60] font-semibold shrink-0">{filtered.length} items</span>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="glass-panel p-16 text-center mt-4">
              <ShoppingBag className="w-16 h-16 text-[rgba(46,125,50,0.2)] mx-auto mb-4" />
              <p className="text-[#5f7a60] font-semibold text-lg">
                {search ? 'No products match your search.' : 'No products yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {filtered.map(product => {
                const outOfStock = product.stock !== undefined && product.stock <= 0;
                const added = addedIds.has(product.id);
                return (
                  <div key={product.id} className="glass-card overflow-hidden flex flex-col tap-card">
                    {/* Image */}
                    <div className="relative overflow-hidden h-[150px] sm:h-[180px] lg:h-[210px]">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {outOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-black text-xs bg-red-600 px-2.5 py-1 rounded-full">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#1a3d1f] text-sm sm:text-base line-clamp-1">{product.name}</h3>
                      <p className="text-[#5f7a60] text-[11px] sm:text-xs line-clamp-2 mt-0.5 sm:mt-1 flex-grow leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[rgba(46,125,50,0.08)] flex items-center justify-between gap-2">
                        <span className="font-black text-[#2e7d32] text-base sm:text-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>
                          ₹{Number(product.price).toFixed(0)}
                        </span>
                        <button
                          onClick={() => !outOfStock && handleAdd(product)}
                          disabled={outOfStock}
                          className={`flex items-center gap-1 text-[11px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95 disabled:opacity-40 cursor-pointer ${
                            added
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-[#ffb300] text-black shadow-sm hover:bg-[#ffa000]'
                          }`}
                        >
                          {outOfStock ? 'Sold Out' : added ? <><Check className="w-3 h-3" /> Added</> : '+ Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
