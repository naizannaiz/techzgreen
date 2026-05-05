import { Sparkles } from 'lucide-react';
import { GCoinIcon } from './GCoin';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { computeCartRedemption, isItemEligible } from '../lib/redeemCap';

export default function RedeemPanel() {
  const { items, redeemToggleMap } = useCart();
  const { totalPoints } = useAuth();

  if (!items.some(isItemEligible)) return null;

  const { totalCoinsUsed, totalDiscount } = computeCartRedemption(items, totalPoints, redeemToggleMap);
  const remaining = Math.max(0, totalPoints - totalCoinsUsed);

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-3">
        <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl">
          <GCoinIcon size={24} />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-xs text-[#5f7a60]">
            Balance: <strong>{totalPoints}</strong> · Remaining: <strong>{remaining}</strong>
          </p>
          <p className="text-[10px] text-[#5f7a60]">Toggle G Coin redemption per item above.</p>
        </div>
        {totalCoinsUsed > 0 && (
          <span className="font-black text-green-700 text-sm flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" /> {totalCoinsUsed} G · −₹{totalDiscount.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
