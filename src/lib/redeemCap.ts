import type { CartItem } from '../context/CartContext';

// Per-item hard cap: bounded by product cap (∞ if NULL) AND item subtotal in points.
export function itemRedeemCap(item: CartItem, pointToRs: number): number {
  if (pointToRs <= 0) return 0;
  const itemSubtotal = item.product.price * item.quantity;
  const valueCap = Math.floor(itemSubtotal / pointToRs);
  const lim = item.product.max_redeemable_points;
  const productCap = lim == null ? Infinity : lim * item.quantity;
  return Math.max(0, Math.min(valueCap, productCap));
}

// Effective live max for a single item, given other items already consume some of the user's balance.
export function effectiveItemMax(
  item: CartItem,
  pointToRs: number,
  totalPoints: number,
  redeemMap: Record<string, number>
): number {
  const otherUsed = Object.entries(redeemMap)
    .filter(([id]) => id !== item.product.id)
    .reduce((s, [, v]) => s + (v || 0), 0);
  const remainingBudget = Math.max(0, totalPoints - otherUsed);
  return Math.min(itemRedeemCap(item, pointToRs), remainingBudget);
}
