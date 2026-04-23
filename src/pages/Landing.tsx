import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { Recycle, Calendar, Droplet, ShoppingBag, ArrowRight, Star, Leaf, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';

export default function Landing() {
  const [products, setProducts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').limit(3).then(({ data }) => {
      if (data) setProducts(data);
    });
    supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true })
      .limit(4)
      .then(({ data }) => { if (data) setEvents(data); });
  }, []);

  return (
    <div className="fade-in">
      <Helmet>
        <title>TechzGreen – Earn Green Rewards for Responsible Waste Disposal</title>
        <meta name="description" content="Turn plastic waste into green reward points. Join 1,200+ members earning eco-rewards on India's sustainability platform. Upload waste photos and redeem for eco-friendly products." />
        <link rel="canonical" href="https://techzgreen.in/" />
        <meta property="og:title" content="TechzGreen – Earn Green Rewards for Responsible Waste Disposal" />
        <meta property="og:description" content="Turn plastic waste into green reward points. Join 1,200+ members earning eco-rewards on India's sustainability platform." />
        <meta property="og:url" content="https://techzgreen.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TechzGreen – Earn Green Rewards for Responsible Waste Disposal" />
        <meta name="twitter:description" content="Turn plastic waste into green reward points. Join 1,200+ members earning eco-rewards on India's sustainability platform." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TechzGreen",
          "url": "https://techzgreen.in",
          "logo": "https://techzgreen.in/favicon.png",
          "description": "TechzGreen empowers communities to dispose of plastic waste responsibly. Upload evidence, earn green reward points, and redeem them for eco-friendly products.",
          "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "email": "techzgreen23@gmail.com" },
          "address": { "@type": "PostalAddress", "addressCountry": "IN" }
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Copy */}
            <div className="space-y-5 sm:space-y-6">
              <span className="section-label"><Leaf className="w-3.5 h-3.5" />Eco Rewards Platform</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a3d1f] leading-tight">
                Turn Waste Into<br/>
                <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg, #2e7d32, #4caf50)'}}>
                  Green Rewards
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#5f7a60] leading-relaxed max-w-md">
                Responsibly dispose of plastic waste, snap a photo, and earn points redeemable for eco-friendly products. Every bin counts.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/signup" className="btn-primary flex items-center gap-2">
                  Join the Movement <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#about" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[#2e7d32] glass-panel hover:shadow-lg transition-all text-sm border border-[rgba(46,125,50,0.2)] cursor-pointer">
                  Learn More
                </a>
              </div>
              {/* Stats row */}
              <div className="flex gap-4 sm:gap-6 pt-4">
                {[['1,200+', 'Members'], ['4.5T', 'Waste Collected'], ['8,000+', 'Points Awarded']].map(([val, label]) => (
                  <div key={label}>
                    <p className="text-xl sm:text-2xl font-black text-[#2e7d32]" style={{fontFamily:'Outfit,sans-serif'}}>{val}</p>
                    <p className="text-xs text-[#5f7a60] font-semibold">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mt-4 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 to-amber-100/30 rounded-3xl blur-2xl scale-95"></div>
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=900"
                alt="Eco-friendly waste disposal"
                fetchPriority="high"
                width="900" height="600"
                className="relative z-10 rounded-3xl shadow-2xl w-full object-cover h-[240px] sm:h-[340px] lg:h-[420px]"
              />
              {/* Floating cards — hidden on mobile to prevent overflow */}
              <div className="hidden sm:flex absolute -bottom-5 -left-4 z-20 glass-panel px-4 py-3 items-center gap-3">
                <div className="bg-[#ffb300] p-2.5 rounded-xl">
                  <Recycle className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#1a3d1f] text-sm" style={{fontFamily:'Outfit,sans-serif'}}>Circular Economy</p>
                  <p className="text-xs text-[#5f7a60]">Zero Waste Goal</p>
                </div>
              </div>
              {/* Points badge */}
              <div className="hidden sm:block absolute -top-4 -right-4 z-20 glass-panel px-4 py-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#ffb300] fill-[#ffb300]" />
                  <p className="font-black text-[#1a3d1f] text-sm" style={{fontFamily:'Outfit,sans-serif'}}>Earn Points</p>
                </div>
                <p className="text-xs text-[#5f7a60] mt-0.5">Each bin = rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner Carousel ── */}
      <div className="max-w-7xl mx-auto">
        <BannerCarousel />
      </div>

      {/* ── How It Works ── */}
      <section id="about" className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="section-label mb-4 inline-flex">Our Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3d1f] mt-4">Three Steps to Go Green</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Simple, rewarding, and impactful. Here's how TechzGreen works.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <Upload className="w-7 h-7 text-[#2e7d32]" />, step:'01', title: 'Dispose Responsibly', desc: 'Drop your plastic waste into designated recycling bins.' },
              { icon: <Leaf className="w-7 h-7 text-[#2e7d32]" />, step:'02', title: 'Snap & Upload', desc: 'Take a clear photo showing the deposit and upload it to our platform.' },
              { icon: <Star className="w-7 h-7 text-[#ffb300]" />, step:'03', title: 'Earn Green Points', desc: 'Admin verifies and rewards your points. Redeem them for eco products!' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="glass-card p-8 cursor-default">
                <div className="flex items-start gap-4 mb-5">
                  <div className="bg-[rgba(46,125,50,0.08)] p-3 rounded-2xl border border-[rgba(46,125,50,0.12)]">
                    {icon}
                  </div>
                  <span className="text-4xl font-black text-[rgba(46,125,50,0.12)]" style={{fontFamily:'Outfit,sans-serif'}}>{step}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a3d1f] mb-2">{title}</h3>
                <p className="text-[#5f7a60] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="section-label mb-4 inline-flex">Services</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3d1f] mt-4">Our Sustainable Services</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Efficient, community-driven ways to tackle plastic waste.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: <Recycle className="w-8 h-8 text-[#2e7d32]" />, title: 'Recycled Products', desc: 'High-quality goods crafted from collected and recycled plastic materials.' },
              { icon: <Calendar className="w-8 h-8 text-[#2e7d32]" />, title: 'Circular Economy', desc: 'Closing the loop — from use to collection, cleaning, and reuse.' },
              { icon: <Droplet className="w-8 h-8 text-[#2e7d32]" />, title: 'Sustainable Transformation', desc: 'Green evolution through community-driven, sustainable change.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-8 text-center cursor-default">
                <div className="bg-[rgba(46,125,50,0.1)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[rgba(46,125,50,0.15)]">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-[#1a3d1f] mb-3">{title}</h3>
                <p className="text-[#5f7a60] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="section-label mb-3 inline-flex">Community</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1a3d1f] mt-3">Upcoming Eco-Events</h2>
            </div>
            <Link to="/events" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#2e7d32] hover:underline cursor-pointer">View All <ArrowRight className="w-4 h-4"/></Link>
          </div>
          {events.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <Calendar className="w-12 h-12 text-[rgba(46,125,50,0.25)] mx-auto mb-3" />
              <p className="text-[#5f7a60] font-medium">No upcoming events yet.</p>
              <p className="text-xs text-[#5f7a60] mt-1 opacity-70">Check back soon — the admin will post events here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {events.map((event: any) => (
                <div key={event.id} className="glass-card overflow-hidden flex flex-col sm:flex-row cursor-default">
                  <img
                    src={event.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600'}
                    alt={event.title}
                    loading="lazy"
                    width="192" height="192"
                    className="sm:w-48 object-cover h-48 sm:h-auto rounded-l-none sm:rounded-l-2xl rounded-tl-2xl rounded-tr-2xl sm:rounded-tr-none"
                  />
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-[#1a3d1f] mb-2">{event.title}</h3>
                      <p className="text-[#5f7a60] text-sm mb-4 leading-relaxed line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] bg-[rgba(46,125,50,0.08)] border border-[rgba(46,125,50,0.15)] px-3 py-1.5 rounded-lg w-fit">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.event_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </div>
                      {event.location && (
                        <span className="text-xs text-[#5f7a60] pl-1">{event.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Product Catalog ── */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="section-label mb-3 inline-flex"><ShoppingBag className="w-3.5 h-3.5"/>Shop</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1a3d1f] mt-3">Eco-Rewards Catalog</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#2e7d32] hover:underline cursor-pointer">View All <ArrowRight className="w-4 h-4"/></Link>
          </div>
          {products.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-[rgba(46,125,50,0.3)] mx-auto mb-3" />
              <p className="text-[#5f7a60] font-medium">Products coming soon. Check back later!</p>
              <p className="text-xs text-[#5f7a60] mt-1 opacity-70">Admin needs to add products via the dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {products.map(product => (
                <div key={product.id} className="glass-card overflow-hidden cursor-default">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80'} alt={product.name} loading="lazy" className="w-full h-52 object-cover" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-[#1a3d1f] mb-1">{product.name}</h3>
                    <p className="text-[#5f7a60] text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-[#2e7d32] text-lg">₹{Number(product.price).toFixed(2)}</span>
                      <Link to="/shop" className="btn-accent text-sm !py-1.5 !px-4">Shop Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel-dark p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
            <div className="relative z-10">
              <Leaf className="w-12 h-12 text-[#ffb300] mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Make a Difference?</h2>
              <p className="text-[rgba(200,230,201,0.9)] mb-8 max-w-lg mx-auto">Join thousands of eco-warriors earning rewards while cleaning up our planet. Every action counts.</p>
              <Link to="/signup" className="btn-accent inline-flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
