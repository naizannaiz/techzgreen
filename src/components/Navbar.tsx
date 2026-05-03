import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, LogOut, LogIn, Calendar, Home, Store, Menu, X, Info, User } from 'lucide-react';
import { GCoinIcon } from './GCoin';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profileRole, signOut } = useAuth();
  const { items } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `relative px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer
    ${isActive(path)
      ? 'bg-[#2e7d32] text-white shadow-sm'
      : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.1)] hover:text-[#1b5e20]'}`;

  // Bottom nav tab config
  const userTabs = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { to: '/shop', icon: (
      <span className="relative">
        <Store className="w-5 h-5" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-[#ffb300] text-black text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
            {cartItemCount}
          </span>
        )}
      </span>
    ), label: 'Shop' },
    { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
    { to: '/rewards', icon: <GCoinIcon size={32} />, label: 'G Coins' },
    { to: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  const adminTabs = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { to: '/shop', icon: <Store className="w-5 h-5" />, label: 'Shop' },
    { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
    { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Admin' },
  ];

  const bottomTabs = profileRole === 'admin' ? adminTabs : userTabs;

  return (
    <>
      {/* ── Top Navbar ── */}
      <div className="sticky top-3 z-50 px-4">
        <nav className="glass-nav max-w-7xl mx-auto rounded-2xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/favicon.png" alt="TechzGreen" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-[#111111]">Techz</span><span className="text-[#2e7d32]">Green</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/" className={linkClass('/')}>Home</Link>
              <Link to="/about" className={linkClass('/about')}>About</Link>
              <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
              <Link to="/events" className={linkClass('/events')}>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Events</span>
              </Link>
              {user && profileRole === 'user' && (
                <Link to="/rewards" className={linkClass('/rewards')}>Earn Points</Link>
              )}
              {user && profileRole === 'user' && (
                <Link to="/profile" className={linkClass('/profile')}>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Profile</span>
                </Link>
              )}
              {user && (
                <Link to={profileRole === 'admin' ? '/admin' : '/dashboard'} className={linkClass(profileRole === 'admin' ? '/admin' : '/dashboard')}>
                  <span className="flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" />Dashboard</span>
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart — desktop only (mobile uses bottom nav shop tab) */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-[rgba(46,125,50,0.1)] text-[#2d4a30] hover:text-[#1b5e20] transition-colors cursor-pointer hidden sm:block">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#ffb300] text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Mobile cart icon (top bar) */}
              <Link to="/cart" className="relative p-2 rounded-lg text-[#2d4a30] transition-colors cursor-pointer sm:hidden">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#ffb300] text-black text-xs font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {!user ? (
                <>
                  <Link to="/login" className="btn-accent hidden sm:flex items-center gap-1.5 text-sm !py-2 !px-4">
                    <LogIn className="w-4 h-4" /> Login / Join
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(o => !o)}
                    className="sm:hidden p-2 rounded-lg text-[#2d4a30] hover:bg-[rgba(46,125,50,0.1)] transition-colors cursor-pointer"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  {/* Desktop logout */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#c62828] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile dropdown — guests only */}
          {mobileMenuOpen && !user && (
            <div className="sm:hidden pb-3 pt-2 border-t border-[rgba(46,125,50,0.1)] mt-1 flex flex-col gap-0.5">
              {[
                { to: '/', icon: <Home className="w-4 h-4 flex-shrink-0" />, label: 'Home' },
                { to: '/about', icon: <Info className="w-4 h-4 flex-shrink-0" />, label: 'About' },
                { to: '/shop', icon: <Store className="w-4 h-4 flex-shrink-0" />, label: 'Shop' },
                { to: '/events', icon: <Calendar className="w-4 h-4 flex-shrink-0" />, label: 'Events' },
              ].map(({ to, icon, label }) => (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive(to) ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                  {icon} {label}
                </Link>
              ))}
              <div className="mt-1 pt-2 border-t border-[rgba(46,125,50,0.08)]">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#2e7d32] bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.14)] transition-colors">
                  <LogIn className="w-4 h-4 flex-shrink-0" /> Login / Join
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* ── Mobile Bottom Nav (logged-in users) ── */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="glass-nav mx-3 mb-3 rounded-2xl px-1 py-2">
            <div className="flex justify-around items-center">
              {bottomTabs.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-[11px] font-bold cursor-pointer relative ${
                    isActive(to) ? 'text-[#2e7d32]' : 'text-[#5f7a60]'
                  }`}
                >
                  {isActive(to) && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#2e7d32] rounded-full" />
                  )}
                  {icon}
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-red-400 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Out
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
