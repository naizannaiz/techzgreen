import { useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { GCoinIcon } from './GCoin';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { effectiveItemMax, itemRedeemCap } from '../lib/redeemCap';

interface Props {
  pointToRs: number;
}

export default function RedeemPanel({ pointToRs }: Props) {
  const { items, redeemMap, setRedeemForItem, totalPointsToRedeem, usePoints, setUsePoints } = useCart();
  const { totalPoints } = useAuth();

  // Bug A: clamp each item's redeem when caps shrink (qty change, removed item, etc.)
  useEffect(() => {
    items.forEach((item) => {
      const cur = redeemMap[item.product.id] || 0;
      const max = effectiveItemMax(item, pointToRs, totalPoints, redeemMap);
      if (cur > max) setRedeemForItem(item.product.id, max);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, pointToRs, totalPoints]);

  if (totalPoints <= 0) return null;

  const totalDiscount = totalPointsToRedeem * pointToRs;
  const remainingBudget = Math.max(0, totalPoints - totalPointsToRedeem);

  return (
    <div className="glass-panel p-6">
      <button
        onClick={() => setUsePoints(!usePoints)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl">
            <GCoinIcon size={28} />
          </div>
          <div className="text-left">
            <p className="font-bold text-[#1a3d1f] text-sm">Redeem G Coins</p>
            <p className="text-xs text-[#5f7a60]">
              You have <strong>{totalPoints} G Coins</strong> · 1 G Coin = ₹{pointToRs.toFixed(2)}
            </p>
          </div>
        </div>
        {usePoints ? <ChevronUp className="w-4 h-4 text-[#5f7a60]" /> : <ChevronDown className="w-4 h-4 text-[#5f7a60]" />}
      </button>

      {usePoints && (
        <div className="mt-4 space-y-4">
          <p className="text-[11px] text-[#5f7a60]">
            Adjust redemption per product. Remaining balance: <strong>{remainingBudget} G Coins</strong>
          </p>

          {items.map((item) => {
            const id = item.product.id;
            const cur = redeemMap[id] || 0;
            const hardMax = itemRedeemCap(item, pointToRs);
            const liveMax = effectiveItemMax(item, pointToRs, totalPoints, redeemMap);
            const itemDiscount = cur * pointToRs;
            const isCapped = item.product.max_redeemable_points != null;

            return (
              <div key={id} className="border border-[rgba(46,125,50,0.12)] rounded-xl p-3 bg-white/40">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-[#1a3d1f] text-xs truncate">{item.product.name} × {item.quantity}</p>
                    <p className="text-[10px] text-[#5f7a60]">
                      Cap: {isCapped ? `${item.product.max_redeemable_points} × ${item.quantity} = ${item.product.max_redeemable_points! * item.quantity} G` : '∞'}
                      {' · '}Item subtotal: ₹{(item.product.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                  <span className="font-black text-[#2e7d32] text-xs whitespace-nowrap">{cur} G</span>
                </div>

                {hardMax === 0 ? (
                  <p className="text-[11px] text-[#5f7a60] italic">Not redeemable.</p>
                ) : (
                  <>
                    <input
                      type="range"
                      min={0}
                      max={hardMax}
                      value={cur}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        setRedeemForItem(id, Math.min(v, liveMax));
                      }}
                      className="w-full accent-[#2e7d32]"
                    />
                    <div className="flex justify-between text-[10px] text-[#5f7a60] mt-1">
                      <span>0</span>
                      <span className="text-green-700 font-bold">−₹{itemDiscount.toFixed(2)}</span>
                      <span>{hardMax}{liveMax < hardMax && ` (live ${liveMax})`}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setRedeemForItem(id, 0)} className="text-[10px] text-[#5f7a60] hover:text-[#2e7d32] cursor-pointer">Use 0</button>
                      <span className="text-[#5f7a60] text-[10px]">·</span>
                      <button onClick={() => setRedeemForItem(id, liveMax)} className="text-[10px] text-[#5f7a60] hover:text-[#2e7d32] cursor-pointer font-bold">Max ({liveMax})</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="border-t border-[rgba(46,125,50,0.15)] pt-3 flex justify-between items-center">
            <span className="text-xs font-bold text-[#1a3d1f] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-green-700" /> Total Redeem
            </span>
            <span className="font-black text-green-700 text-sm">
              {totalPointsToRedeem} G · −₹{totalDiscount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
