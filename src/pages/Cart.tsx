import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-md w-full">
          <ShoppingBag className="w-16 h-16 text-[#c8e6c9] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1b5e20] mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any eco-friendly products to your cart yet.</p>
          <Link to="/shop" className="bg-[#2e7d32] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1b5e20] transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-[#1b5e20] mb-8">Shopping Cart</h2>
      
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
        <ul className="divide-y divide-gray-100">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
              <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold text-xl text-[#1b5e20] mb-1">{product.name}</h3>
                <p className="font-semibold text-gray-700">${Number(product.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                  <span className="px-4 py-1 font-semibold">{quantity}</span>
                  <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                </div>
                <button onClick={() => removeFromCart(product.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-gray-500">Total Amount</p>
          <p className="text-3xl font-black text-[#2e7d32]">${totalAmount.toFixed(2)}</p>
        </div>
        <Link to="/checkout" className="w-full sm:w-auto bg-[#ffb300] text-black px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors">
          Proceed to Checkout <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
