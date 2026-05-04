import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Recycle, Calendar, ShoppingBag, ArrowRight, Star, Leaf, Upload, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';

export default function Landing() {
  const [products, setProducts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').limit(4).then(({ data }) => { if (data) setProducts(data); });
    supabase.from('events').select('*').eq('is_active', true).order('event_date', { ascending: true }).limit(4)
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  const howItWorksSteps = [
    { icon: <Upload className="w-6 h-6 text-[#2e7d32]" />, step: '01', title: 'Dispose Responsibly', desc: 'Drop plastic into recycling bins.' },
    { icon: <Leaf className="w-6 h-6 text-[#2e7d32]" />, step: '02', title: 'Snap & Upload', desc: 'Photo-proof your deposit on the app.' },
    { icon: <Star className="w-6 h-6 text-[#ffb300]" />, step: '03', title: 'Earn Points', desc: 'Admin verifies and rewards you.' },
  ];

  const serviceCards = [
    { icon: <Recycle className="w-6 h-6 text-[#2e7d32]" />, title: 'Recycled Products', desc: 'Durable goods crafted entirely from collected MLP plastic.' },
    { icon: <Calendar className="w-6 h-6 text-[#2e7d32]" />, title: 'Circular Economy', desc: 'Use → collect → reuse. Plastic stays out of landfills.' },
    { icon: <Star className="w-6 h-6 text-[#ffb300]" />, title: 'Earn & Redeem', desc: 'Turn eco actions into reward points and discounts.' },
  ];

  const stats = [
    { val: '1,200+', label: 'Members', icon: '🌿' },
    { val: '4.5T', label: 'Waste Collected', icon: '♻️' },
    { val: '8,000+', label: 'G Coins Awarded', icon: '🪙' },
  ];

  return (
    <div className="fade-in bottom-nav-safe">
      <Helmet>
        <title>TechzGreen – Earn Green Rewards for Responsible Waste Disposal</title>
        <meta name="description" content="Turn plastic waste into green reward points. Join 1,200+ members earning eco-rewards on India's sustainability platform." />
        <link rel="canonical" href="https://techzgreen.in/" />
        <meta property="og:title" content="TechzGreen – Earn Green Rewards for Responsible Waste Disposal" />
        <meta property="og:description" content="Turn plastic waste into green reward points. Join 1,200+ members earning eco-rewards." />
        <meta property="og:url" content="https://techzgreen.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization",
          "name": "TechzGreen", "url": "https://techzgreen.in",
          "logo": "https://techzgreen.in/favicon.png",
          "description": "TechzGreen empowers communities to dispose of plastic waste responsibly.",
          "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "email": "techzgreen23@gmail.com" },
          "address": { "@type": "PostalAddress", "addressCountry": "IN" }
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="px-4 pt-4 pb-5">
        <div className="max-w-7xl mx-auto space-y-3">

          {/* Hero image banner */}
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: '260px', maxHeight: '520px', aspectRatio: '16/7' }}>
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1400"
              alt="Eco-friendly waste disposal"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(27,94,32,0.9)] via-[rgba(27,94,32,0.65)] to-[rgba(27,94,32,0.15)]" />
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 lg:px-16">
              <div className="max-w-lg">
                <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 w-fit mb-2 sm:mb-3">
                  <Leaf className="w-3 h-3" /> Eco Rewards Platform
                </span>
                <h1 className="text-white font-black leading-tight mb-2 sm:mb-3" style={{ fontSize: 'clamp(1.5rem, 5.5vw, 3.2rem)', fontFamily: 'Outfit,sans-serif' }}>
                  Turn Waste Into<br />
                  <span className="text-[#ffb300]">Green Rewards</span>
                </h1>
                <p className="text-white/80 text-xs sm:text-sm lg:text-base leading-relaxed mb-4 max-w-xs sm:max-w-sm">
                  Dispose plastic, snap a photo, earn points. Every bin counts.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-[#ffb300] text-black font-black text-sm px-5 py-2.5 rounded-xl shadow-lg hover:bg-[#ffa000] transition-colors w-fit">
                    Join Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/about" className="hidden sm:inline-flex items-center gap-2 bg-white/15 text-white font-bold text-sm px-5 py-2.5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors w-fit">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row — 3-col on all screens */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {stats.map(({ val, label, icon }) => (
              <div key={label} className="glass-panel px-2 sm:px-4 py-3 text-center">
                <p className="text-base sm:text-xl mb-0.5">{icon}</p>
                <p className="font-black text-[#2e7d32] text-sm sm:text-xl leading-none" style={{ fontFamily: 'Outfit,sans-serif' }}>{val}</p>
                <p className="text-[9px] sm:text-xs text-[#5f7a60] font-semibold mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Banner Carousel ── */}
      <div className="px-4 mb-5 sm:mb-6">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel />
        </div>
      </div>

      {/* ── How It Works ── */}
      <section className="mb-6 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="font-black text-[#1a3d1f] text-base sm:text-2xl" style={{ fontFamily: 'Outfit,sans-serif' }}>How It Works</h2>
          </div>
          {/* Mobile: horizontal snap */}
          <div className="sm:hidden">
            <div className="snap-x-scroll -mx-4 px-4">
              {howItWorksSteps.map(({ icon, step, title, desc }) => (
                <div key={step} className="glass-card p-4 w-[200px] tap-card flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="bg-[rgba(46,125,50,0.1)] p-2 rounded-xl border border-[rgba(46,125,50,0.12)]">{icon}</div>
                    <span className="text-2xl font-black text-[rgba(46,125,50,0.15)]" style={{ fontFamily: 'Outfit,sans-serif' }}>{step}</span>
                  </div>
                  <h3 className="font-bold text-[#1a3d1f] text-sm mb-1">{title}</h3>
                  <p className="text-[#5f7a60] text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-5 lg:gap-6">
            {howItWorksSteps.map(({ icon, step, title, desc }) => (
              <div key={step} className="glass-card p-6 lg:p-8 tap-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[rgba(46,125,50,0.1)] p-3 rounded-xl border border-[rgba(46,125,50,0.12)]">{icon}</div>
                  <span className="text-4xl font-black text-[rgba(46,125,50,0.15)]" style={{ fontFamily: 'Outfit,sans-serif' }}>{step}</span>
                </div>
                <h3 className="font-bold text-[#1a3d1f] text-base sm:text-lg mb-2">{title}</h3>
                <p className="text-[#5f7a60] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="mb-6 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="font-black text-[#1a3d1f] text-base sm:text-2xl" style={{ fontFamily: 'Outfit,sans-serif' }}>Eco Events</h2>
            <Link to="/events" className="flex items-center gap-1 text-[#2e7d32] font-bold text-xs sm:text-sm hover:underline">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <Calendar className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" />
              <p className="text-[#5f7a60] text-sm font-medium">No upcoming events yet.</p>
            </div>
          ) : (
            <>
              {/* Mobile: horizontal snap */}
              <div className="sm:hidden">
                <div className="snap-x-scroll -mx-4 px-4">
                  {events.map((event: any) => (
                    <div key={event.id} className="glass-card overflow-hidden w-[240px] tap-card flex-shrink-0">
                      <div className="relative h-32">
                        <img src={event.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400'} alt={event.title} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#2e7d32] px-2 py-0.5 rounded-full">
                            <Calendar className="w-2.5 h-2.5" />{new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-[#1a3d1f] text-sm line-clamp-1">{event.title}</h3>
                        {event.location && <p className="text-[10px] text-[#5f7a60] mt-0.5">{event.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop: grid */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {events.map((event: any) => (
                  <div key={event.id} className="glass-card overflow-hidden tap-card">
                    <div className="relative h-44">
                      <img src={event.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400'} alt={event.title} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#2e7d32] px-2.5 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />{new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#1a3d1f] text-sm line-clamp-1">{event.title}</h3>
                      {event.location && <p className="text-xs text-[#5f7a60] mt-1">{event.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Eco Shop Preview ── */}
      <section className="mb-6 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="font-black text-[#1a3d1f] text-base sm:text-2xl" style={{ fontFamily: 'Outfit,sans-serif' }}>Eco Shop</h2>
            <Link to="/shop" className="flex items-center gap-1 text-[#2e7d32] font-bold text-xs sm:text-sm hover:underline">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <ShoppingBag className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" />
              <p className="text-[#5f7a60] text-sm font-medium">Products coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {products.map(product => (
                <div key={product.id} className="glass-card overflow-hidden tap-card">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full object-cover h-[130px] sm:h-[160px] lg:h-[180px]"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-[#1a3d1f] text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-[#5f7a60] text-xs line-clamp-1 mt-0.5 hidden sm:block">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-[#2e7d32] text-base" style={{ fontFamily: 'Outfit,sans-serif' }}>
                        ₹{Number(product.price).toFixed(0)}
                      </span>
                      <Link to="/shop" className="bg-[#2e7d32] text-white text-[11px] font-black px-3 py-1.5 rounded-lg hover:bg-[#1b5e20] transition-colors">
                        Shop
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why TechzGreen (Services) ── */}
      <section className="mb-6 sm:mb-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop heading */}
          <div className="hidden sm:block mb-5">
            <h2 className="font-black text-[#1a3d1f] text-2xl" style={{ fontFamily: 'Outfit,sans-serif' }}>Why TechzGreen?</h2>
            <p className="text-[#5f7a60] text-sm mt-1">Three pillars of our circular ecosystem.</p>
          </div>
          {/* Mobile: horizontal snap */}
          <div className="sm:hidden">
            <div className="snap-x-scroll -mx-4 px-4">
              {serviceCards.map(({ icon, title, desc }) => (
                <div key={title} className="glass-card p-4 w-[170px] text-center tap-card flex-shrink-0">
                  <div className="bg-[rgba(46,125,50,0.1)] w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-[rgba(46,125,50,0.15)]">{icon}</div>
                  <h3 className="font-bold text-[#1a3d1f] text-sm mb-1">{title}</h3>
                  <p className="text-[#5f7a60] text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-3 gap-5 lg:gap-6">
            {serviceCards.map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-6 lg:p-8 tap-card">
                <div className="bg-[rgba(46,125,50,0.1)] w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-[rgba(46,125,50,0.15)]">{icon}</div>
                <h3 className="font-bold text-[#1a3d1f] text-base sm:text-lg mb-2">{title}</h3>
                <p className="text-[#5f7a60] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-4 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel-dark p-7 sm:p-12 text-center relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
            <div className="relative z-10">
              <Leaf className="w-9 h-9 sm:w-12 sm:h-12 text-[#ffb300] mx-auto mb-3" />
              <h2 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3" style={{ fontFamily: 'Outfit,sans-serif' }}>
                Ready to Make a Difference?
              </h2>
              <p className="text-[rgba(200,230,201,0.85)] text-sm sm:text-base mb-5 sm:mb-7 leading-relaxed max-w-lg mx-auto">
                Join thousands earning rewards while cleaning our planet.
              </p>
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-[#ffb300] text-black font-black text-sm px-8 py-3 rounded-xl shadow-lg hover:bg-[#ffa000] transition-colors">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
