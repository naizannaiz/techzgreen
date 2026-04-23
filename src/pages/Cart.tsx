import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 fade-in">
        <div className="glass-panel p-12 text-center max-w-md w-full">
          <ShoppingBag className="w-16 h-16 text-[rgba(46,125,50,0.25)] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1a3d1f] mb-2">Your Cart is Empty</h2>
          <p className="text-[#5f7a60] text-sm mb-8 leading-relaxed">
            Looks like you haven't added any eco-friendly products yet.
          </p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 fade-in pb-24 sm:pb-10">
      {/* Header */}
      <div className="mb-8">
        <span className="section-label mb-3 inline-flex"><ShoppingBag className="w-3.5 h-3.5" />Cart</span>
        <h1 className="text-4xl font-black text-[#1a3d1f] mt-3">Shopping Cart</h1>
        <p className="text-[#5f7a60] mt-1 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Items list */}
        <div className="lg:col-span-2 glass-panel overflow-hidden">
          <ul className="divide-y divide-[rgba(46,125,50,0.08)]">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 hover:bg-[rgba(46,125,50,0.02)] transition-colors">
                {/* Image */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-[rgba(46,125,50,0.1)]"
                />

                {/* Info */}
                <div className="flex-grow text-center sm:text-left min-w-0">
                  <h3 className="font-bold text-lg text-[#1a3d1f] truncate">{product.name}</h3>
                  <p className="font-black text-[#2e7d32] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                </div>

                {/* Qty controls + delete */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center border border-[rgba(46,125,50,0.2)] rounded-xl overflow-hidden bg-white/60">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-2 text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)] transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-2 font-black text-[#1a3d1f] min-w-[2.5rem] text-center text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-2 text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="glass-panel p-6 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-black text-xl text-[#1a3d1f]" style={{ fontFamily: 'Outfit, sans-serif' }}>Order Summary</h2>

          <div className="space-y-3 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-[#5f7a60]">
                <span className="truncate mr-4">{product.name} × {quantity}</span>
                <span className="font-semibold text-[#2d4a30] flex-shrink-0">
                  ₹{(Number(product.price) * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[rgba(46,125,50,0.12)] pt-4 flex justify-between items-center">
            <span className="font-bold text-[#2d4a30]">Subtotal</span>
            <span className="font-black text-[#2e7d32] text-2xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>

          <Link
            to="/checkout"
            className="btn-accent w-full flex items-center justify-center gap-2 !py-3"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="block text-center text-sm font-semibold text-[#5f7a60] hover:text-[#2e7d32] transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
