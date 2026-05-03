import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 fade-in">
        <div className="glass-panel p-10 text-center max-w-sm w-full">
          <ShoppingBag className="w-14 h-14 text-[rgba(46,125,50,0.25)] mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#1a3d1f] mb-2">Your Cart is Empty</h2>
          <p className="text-[#5f7a60] text-sm mb-6 leading-relaxed">
            No eco-friendly products added yet.
          </p>
          <Link to="/shop" className="btn-primary flex items-center justify-center gap-2 w-full">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in pb-36 sm:pb-10">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-[rgba(46,125,50,0.08)]">
        <ShoppingBag className="w-5 h-5 text-[#2e7d32]" />
        <h1 className="font-black text-[#1a3d1f] text-xl" style={{ fontFamily: 'Outfit,sans-serif' }}>
          My Cart
        </h1>
        <span className="ml-auto text-xs text-[#5f7a60] font-semibold">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Item list */}
      <div className="px-4 pt-3 space-y-3">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="glass-card p-3 flex gap-3 items-center">
            {/* Image */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-[rgba(46,125,50,0.1)]"
            />

            {/* Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-[#1a3d1f] text-sm line-clamp-1">{product.name}</h3>
              <p className="font-black text-[#2e7d32] text-base mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                ₹{Number(product.price).toFixed(0)}
              </p>

              {/* Qty + delete row */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center border border-[rgba(46,125,50,0.2)] rounded-xl overflow-hidden bg-white/60">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1.5 text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 font-black text-[#1a3d1f] min-w-[2rem] text-center text-sm" style={{ fontFamily: 'Outfit,sans-serif' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1.5 text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="ml-auto text-xs font-bold text-[#5f7a60]">
                  ₹{(Number(product.price) * quantity).toFixed(0)}
                </span>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary (above sticky bar, visible on desktop) */}
      <div className="hidden sm:block px-4 mt-6">
        <div className="glass-panel p-5 space-y-4 max-w-sm ml-auto">
          <h2 className="font-black text-lg text-[#1a3d1f]" style={{ fontFamily: 'Outfit,sans-serif' }}>Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-[#5f7a60]">
                <span className="truncate mr-3">{product.name} × {quantity}</span>
                <span className="font-semibold text-[#2d4a30]">₹{(Number(product.price) * quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgba(46,125,50,0.12)] pt-3 flex justify-between items-center">
            <span className="font-bold text-[#2d4a30]">Subtotal</span>
            <span className="font-black text-[#2e7d32] text-xl" style={{ fontFamily: 'Outfit,sans-serif' }}>
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
          <Link to="/checkout" className="btn-accent w-full flex items-center justify-center gap-2 !py-3">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/shop" className="block text-center text-sm font-semibold text-[#5f7a60] hover:text-[#2e7d32]">
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* ── Sticky bottom bar (mobile only) ── */}
      <div className="sticky-bottom-bar sm:hidden flex items-center gap-3">
        <div className="flex-grow min-w-0">
          <p className="text-xs text-[#5f7a60] font-semibold">Total</p>
          <p className="font-black text-[#1a3d1f] text-xl" style={{ fontFamily: 'Outfit,sans-serif' }}>
            ₹{totalAmount.toFixed(2)}
          </p>
        </div>
        <Link
          to="/checkout"
          className="flex-shrink-0 flex items-center gap-2 bg-[#2e7d32] text-white font-black text-sm px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
