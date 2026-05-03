import gcoinLogo from '../assets/gcoin_bg-removed.png';

interface GCoinProps {
  /** Icon size in pixels — maps to both width and height */
  size?: number;
  className?: string;
}

/**
 * GCoin icon — drop-in replacement for the Star icon in all reward contexts.
 */
export function GCoinIcon({ size = 24, className = '' }: GCoinProps) {
  return (
    <img
      src={gcoinLogo}
      alt="G Coin"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', objectFit: 'contain' }}
    />
  );
}

/** Inline "X G Coins" badge — amber gradient pill */
export function GCoinBadge({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#ffb300] to-[#ffd54f] text-[#1a1a1a] font-black px-3 py-1 rounded-full text-sm shadow-sm">
      <GCoinIcon size={22} />
      {amount} G Coins
    </span>
  );
}
