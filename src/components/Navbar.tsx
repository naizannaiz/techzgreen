import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, LogOut, LogIn, Calendar, Home, Store, Star, Menu, X, Info } from 'lucide-react';
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

  const mobileLinkClass = (path: string) =>
    `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all text-xs font-bold cursor-pointer
    ${isActive(path) ? 'text-[#2e7d32]' : 'text-[#5f7a60]'}`;

  return (
    <>
      {/* ── Top Navbar ── */}
      <div className="sticky top-3 z-50 px-4">
        <nav className="glass-nav max-w-7xl mx-auto rounded-2xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/favicon.png" alt="TechzGreen" className="h-8 w-8 rounded-lg object-contain" />
              <span className="font-black text-lg tracking-tight" style={{fontFamily:'Outfit, sans-serif'}}>
                <span className="text-[#111111]">Techz</span><span className="text-[#2e7d32]">Green</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/" className={linkClass('/')}>Home</Link>
              <Link to="/about" className={linkClass('/about')}>About</Link>
              <Link to="/shop" className={linkClass('/shop')}>Shop</Link>
              <Link to="/events" className={linkClass('/events')}><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Events</span></Link>
              {user && profileRole === 'user' && (
                <Link to="/rewards" className={linkClass('/rewards')}>Earn Points</Link>
              )}
              {user && (
                <Link to={profileRole === 'admin' ? '/admin' : '/dashboard'} className={linkClass(profileRole === 'admin' ? '/admin' : '/dashboard')}>
                  <span className="flex items-center gap-1.5"><LayoutDashboard className="w-3.5 h-3.5" />Dashboard</span>
                </Link>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-[rgba(46,125,50,0.1)] text-[#2d4a30] hover:text-[#1b5e20] transition-colors cursor-pointer">
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
                  {/* Mobile hamburger — always visible for guests */}
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
                  {/* Mobile hamburger — logged-in users */}
                  <button
                    onClick={() => setMobileMenuOpen(o => !o)}
                    className="sm:hidden p-2 rounded-lg text-[#2d4a30] hover:bg-[rgba(46,125,50,0.1)] transition-colors cursor-pointer"
                  >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-3 pt-2 border-t border-[rgba(46,125,50,0.1)] mt-1 flex flex-col gap-0.5">
              {/* Nav links */}
              <Link to="/" onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive('/') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                <Home className="w-4 h-4 flex-shrink-0" /> Home
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive('/about') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                <Info className="w-4 h-4 flex-shrink-0" /> About
              </Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive('/shop') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                <Store className="w-4 h-4 flex-shrink-0" /> Shop
              </Link>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive('/events') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                <Calendar className="w-4 h-4 flex-shrink-0" /> Events
              </Link>
              {user && profileRole === 'user' && (
                <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive('/rewards') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                  <Star className="w-4 h-4 flex-shrink-0" /> Earn Points
                </Link>
              )}
              {user && (
                <Link to={profileRole === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${isActive(profileRole === 'admin' ? '/admin' : '/dashboard') ? 'bg-[rgba(46,125,50,0.12)] text-[#1b5e20]' : 'text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> Dashboard
                </Link>
              )}
              {/* Auth action */}
              <div className="mt-1 pt-2 border-t border-[rgba(46,125,50,0.08)]">
                {!user ? (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#2e7d32] bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.14)] transition-colors">
                    <LogIn className="w-4 h-4 flex-shrink-0" /> Login / Join
                  </Link>
                ) : (
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[#c62828] hover:bg-red-50 transition-colors text-left cursor-pointer">
                    <LogOut className="w-4 h-4 flex-shrink-0" /> Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* ── Mobile Bottom Nav (visible only on mobile, for logged-in users) ── */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
          <div className="glass-nav mx-3 mb-3 rounded-2xl px-2 py-2">
            <div className="flex justify-around items-center">
              <Link to="/" className={mobileLinkClass('/')}>
                <Home className="w-5 h-5" /> Home
              </Link>
              <Link to="/shop" className={mobileLinkClass('/shop')}>
                <Store className="w-5 h-5" />
                <span className="relative">
                  Shop
                  {cartItemCount > 0 && <span className="absolute -top-1 -right-2 bg-[#ffb300] text-black text-[10px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">{cartItemCount}</span>}
                </span>
              </Link>
              <Link to="/events" className={mobileLinkClass('/events')}>
                <Calendar className="w-5 h-5" /> Events
              </Link>
              {profileRole === 'user' && (
                <Link to="/rewards" className={mobileLinkClass('/rewards')}>
                  <Star className="w-5 h-5" /> Points
                </Link>
              )}
              <Link to={profileRole === 'admin' ? '/admin' : '/dashboard'} className={mobileLinkClass(profileRole === 'admin' ? '/admin' : '/dashboard')}>
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
