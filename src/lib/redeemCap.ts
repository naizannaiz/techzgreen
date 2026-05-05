import type { CartItem } from '../context/CartContext';

export interface ItemRedemption {
  unitsRedeemed: number;
  coinsUsed: number;
  discountAmount: number;
  perUnitDiscount: number;
  coinsPerUnit: number;
  discountPercent: number;
  eligible: boolean;
}

export function isItemEligible(item: CartItem): boolean {
  return (Number(item.product.redeem_discount_percent) || 0) > 0
      && (Number(item.product.redeem_coins_required) || 0) > 0;
}

// Greedy allocation: each toggled item consumes coinsPerUnit × quantity (capped by remaining balance).
export function computeCartRedemption(
  items: CartItem[],
  totalCoins: number,
  toggleMap: Record<string, boolean>,
) {
  let remaining = totalCoins;
  const perItem: Record<string, ItemRedemption> = {};
  let totalCoinsUsed = 0;
  let totalDiscount = 0;

  for (const item of items) {
    const pct = Number(item.product.redeem_discount_percent) || 0;
    const coinsPerUnit = Number(item.product.redeem_coins_required) || 0;
    const eligible = pct > 0 && coinsPerUnit > 0;
    const perUnitDiscount = eligible ? (item.product.price * pct) / 100 : 0;

    let unitsRedeemed = 0;
    if (eligible && toggleMap[item.product.id]) {
      const affordable = Math.floor(remaining / coinsPerUnit);
      unitsRedeemed = Math.min(item.quantity, affordable);
    }
    const coinsUsed = unitsRedeemed * coinsPerUnit;
    const discountAmount = unitsRedeemed * perUnitDiscount;
    remaining -= coinsUsed;
    totalCoinsUsed += coinsUsed;
    totalDiscount += discountAmount;

    perItem[item.product.id] = {
      unitsRedeemed,
      coinsUsed,
      discountAmount,
      perUnitDiscount,
      coinsPerUnit,
      discountPercent: pct,
      eligible,
    };
  }
  return { perItem, totalCoinsUsed, totalDiscount };
}
