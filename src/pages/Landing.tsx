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
      <section className="px-4 pt-4 pb-6">
        {/* Full-width hero image */}
        <div className="relative rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/7' }}>
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=900"
            alt="Eco-friendly waste disposal"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(27,94,32,0.82)] to-[rgba(27,94,32,0.35)]" />
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30 w-fit mb-3">
              <Leaf className="w-3 h-3" /> Eco Rewards Platform
            </span>
            <h1 className="text-white font-black leading-tight mb-2" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', fontFamily: 'Outfit,sans-serif' }}>
              Turn Waste Into<br />
              <span className="text-[#ffb300]">Green Rewards</span>
            </h1>
            <p className="text-white/80 text-xs leading-relaxed mb-4 max-w-[260px]">
              Dispose plastic, snap photo, earn points. Every bin counts.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-[#ffb300] text-black font-black text-sm px-4 py-2.5 rounded-xl w-fit shadow-lg">
              Join the Movement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
          {[['1,200+', 'Members', '🌿'], ['4.5T', 'Waste Collected', '♻️'], ['8,000+', 'G Coins Awarded', '🪙']].map(([val, label, icon]) => (
            <div key={label} className="glass-panel flex-shrink-0 px-4 py-3 text-center min-w-[110px]">
              <p className="text-lg">{icon}</p>
              <p className="font-black text-[#2e7d32] text-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>{val}</p>
              <p className="text-[10px] text-[#5f7a60] font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Banner Carousel ── */}
      <div className="px-4 mb-6">
        <BannerCarousel />
      </div>

      {/* ── How It Works (horizontal snap) ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-black text-[#1a3d1f] text-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>How It Works</h2>
        </div>
        <div className="snap-x-scroll px-4">
          {[
            { icon: <Upload className="w-6 h-6 text-[#2e7d32]" />, step: '01', title: 'Dispose Responsibly', desc: 'Drop plastic into recycling bins.' },
            { icon: <Leaf className="w-6 h-6 text-[#2e7d32]" />, step: '02', title: 'Snap & Upload', desc: 'Photo-proof your deposit on the app.' },
            { icon: <Star className="w-6 h-6 text-[#ffb300]" />, step: '03', title: 'Earn Points', desc: 'Admin verifies and rewards you.' },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} className="glass-card p-5 w-[220px] tap-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[rgba(46,125,50,0.1)] p-2.5 rounded-xl border border-[rgba(46,125,50,0.12)]">
                  {icon}
                </div>
                <span className="text-3xl font-black text-[rgba(46,125,50,0.15)]" style={{ fontFamily: 'Outfit,sans-serif' }}>{step}</span>
              </div>
              <h3 className="font-bold text-[#1a3d1f] text-sm mb-1">{title}</h3>
              <p className="text-[#5f7a60] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events (horizontal snap) ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-black text-[#1a3d1f] text-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>Eco Events</h2>
          <Link to="/events" className="flex items-center gap-1 text-[#2e7d32] font-bold text-xs">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="mx-4 glass-panel p-8 text-center">
            <Calendar className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" />
            <p className="text-[#5f7a60] text-sm font-medium">No upcoming events yet.</p>
          </div>
        ) : (
          <div className="snap-x-scroll px-4">
            {events.map((event: any) => (
              <div key={event.id} className="glass-card overflow-hidden w-[260px] tap-card flex-shrink-0">
                <div className="relative h-36">
                  <img
                    src={event.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400'}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#2e7d32] px-2 py-0.5 rounded-full">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
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
        )}
      </section>

      {/* ── Products ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-black text-[#1a3d1f] text-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>Eco Shop</h2>
          <Link to="/shop" className="flex items-center gap-1 text-[#2e7d32] font-bold text-xs">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="mx-4 glass-panel p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" />
            <p className="text-[#5f7a60] text-sm font-medium">Products coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4">
            {products.map(product => (
              <div key={product.id} className="glass-card overflow-hidden tap-card">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&q=80'}
                  alt={product.name}
                  loading="lazy"
                  className="w-full object-cover"
                  style={{ height: '140px' }}
                />
                <div className="p-3">
                  <h3 className="font-bold text-[#1a3d1f] text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-[#5f7a60] text-xs line-clamp-1 mt-0.5">{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-[#2e7d32] text-base" style={{ fontFamily: 'Outfit,sans-serif' }}>
                      ₹{Number(product.price).toFixed(0)}
                    </span>
                    <Link to="/shop" className="bg-[#2e7d32] text-white text-[11px] font-black px-3 py-1.5 rounded-lg">
                      Shop
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Services strip ── */}
      <section className="mb-8">
        <div className="snap-x-scroll px-4">
          {[
            { icon: <Recycle className="w-5 h-5 text-[#2e7d32]" />, title: 'Recycled Products', desc: 'Crafted from collected plastic.' },
            { icon: <Calendar className="w-5 h-5 text-[#2e7d32]" />, title: 'Circular Economy', desc: 'Use → collect → reuse loop.' },
            { icon: <Star className="w-5 h-5 text-[#ffb300]" />, title: 'Earn & Redeem', desc: 'Points for eco actions.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-card p-4 w-[180px] text-center tap-card">
              <div className="bg-[rgba(46,125,50,0.1)] w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[rgba(46,125,50,0.15)]">
                {icon}
              </div>
              <h3 className="font-bold text-[#1a3d1f] text-sm mb-1">{title}</h3>
              <p className="text-[#5f7a60] text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-4 pb-4">
        <div className="glass-panel-dark p-7 text-center relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
          <div className="relative z-10">
            <Leaf className="w-10 h-10 text-[#ffb300] mx-auto mb-3" />
            <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Outfit,sans-serif' }}>
              Ready to Make a Difference?
            </h2>
            <p className="text-[rgba(200,230,201,0.85)] text-sm mb-5 leading-relaxed">
              Join thousands earning rewards while cleaning our planet.
            </p>
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-[#ffb300] text-black font-black text-sm px-6 py-3 rounded-xl w-full shadow-lg">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
