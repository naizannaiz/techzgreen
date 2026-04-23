import { Link } from 'react-router-dom';
import { Recycle, Star, Leaf, Users, ArrowRight, CheckCircle, Globe, Award, Heart, Package, Building2 } from 'lucide-react';

export default function About() {
  return (
    <div className="fade-in pb-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-8 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div className="space-y-6">
              <span className="section-label"><Leaf className="w-3.5 h-3.5" />Our Story</span>
              <h1 className="text-4xl lg:text-5xl font-black text-[#1a3d1f] leading-tight">
                TechzGreen's Visionary Journey To A{' '}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #2e7d32, #4caf50)' }}
                >
                  Greener Tomorrow
                </span>
              </h1>
              <p className="text-lg text-[#5f7a60] leading-relaxed max-w-md">
                At Techzgreen, we transform plastic waste — especially Multi-Layer Plastic (MLP) — into durable and valuable products through innovative recycling and upcycling technologies. Our mission is to help industries, institutions, and communities implement effective waste management systems while converting non-valuable plastic waste into high-quality, long-lasting materials.
              </p>
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 w-fit">
                Join Our Movement <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2×2 Image grid with stat badges */}
            <div className="relative grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600"
                alt="Community recycling"
                className="rounded-2xl object-cover h-52 w-full"
              />
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
                alt="Eco products"
                className="rounded-2xl object-cover h-52 w-full mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=600"
                alt="Waste sorting"
                className="rounded-2xl object-cover h-52 w-full -mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600"
                alt="Green future"
                className="rounded-2xl object-cover h-52 w-full"
              />
              {/* Stat badge — top left */}
              <div className="absolute -left-4 top-16 glass-panel px-4 py-3 z-10 shadow-lg">
                <p className="font-black text-2xl text-[#2e7d32]" style={{ fontFamily: 'Outfit, sans-serif' }}>32+</p>
                <p className="text-xs text-[#5f7a60] font-semibold mt-0.5">Years Experience</p>
              </div>
              {/* Stat badge — bottom right */}
              <div className="absolute -right-4 bottom-16 glass-panel px-4 py-3 z-10 shadow-lg">
                <p className="font-black text-2xl text-[#2e7d32]" style={{ fontFamily: 'Outfit, sans-serif' }}>1200+</p>
                <p className="text-xs text-[#5f7a60] font-semibold mt-0.5">Community Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-20 px-4 bg-[rgba(46,125,50,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: text + checklist */}
            <div className="space-y-6">
              <span className="section-label"><Users className="w-3.5 h-3.5" />Who We Are</span>
              <h2 className="text-4xl font-black text-[#1a3d1f] mt-4">Sustainability Pioneers</h2>
              <p className="text-[#5f7a60] leading-relaxed">
                We manufacture a wide range of eco-friendly products — school benches, tables, furniture, outdoor benches, TV units, roofing sheets, flooring panels, ceiling boards, partitions, and custom items like momentos. These products are waterproof, pest-proof, fungus-resistant, high-density, and long-lasting, making them suitable for both indoor and outdoor applications.
              </p>
              <ul className="space-y-3">
                {[
                  'Waterproof, pest-proof & fungus-resistant products for indoor & outdoor use',
                  'Innovative MLP recycling and upcycling technology',
                  'Consultation & technical guidance for effective waste management',
                  'Waste becomes a resource — environmental impact & sustainable advertising',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
                    <span className="text-[#2d4a30] text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: skill bars */}
            <div className="space-y-8">
              {[
                { label: 'Recycled Products', pct: 90 },
                { label: 'Circular Economy', pct: 93 },
                { label: 'Sustainable Transformation', pct: 95 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#1a3d1f] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</span>
                    <span className="font-black text-[#2e7d32] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{pct}%</span>
                  </div>
                  <div className="h-3 bg-[rgba(46,125,50,0.12)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #2e7d32, #4caf50)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4 inline-flex"><Star className="w-3.5 h-3.5" />Purpose</span>
            <h2 className="text-4xl font-black text-[#1a3d1f] mt-4">Mission & Vision</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Two forces driving everything we build and every community we serve.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="glass-panel p-10 space-y-5">
              <div className="bg-[rgba(46,125,50,0.1)] w-14 h-14 rounded-2xl flex items-center justify-center border border-[rgba(46,125,50,0.15)]">
                <Recycle className="w-7 h-7 text-[#2e7d32]" />
              </div>
              <h3 className="text-2xl font-black text-[#1a3d1f]">Our Mission</h3>
              <p className="text-[#5f7a60] leading-relaxed">
                To help industries, institutions, and communities implement effective waste management systems while converting non-valuable plastic waste into high-quality, long-lasting materials — contributing to the circular loop of plastic and promoting a sustainable future.
              </p>
            </div>
            {/* Vision */}
            <div className="glass-panel-dark p-10 space-y-5">
              <div className="bg-[rgba(255,179,0,0.15)] w-14 h-14 rounded-2xl flex items-center justify-center border border-[rgba(255,179,0,0.3)]">
                <Star className="w-7 h-7 text-[#ffb300] fill-[#ffb300]" />
              </div>
              <h3 className="text-2xl font-black text-white">Our Vision</h3>
              <p className="text-[rgba(200,230,201,0.85)] leading-relaxed">
                A world where waste becomes a resource — creating environmental impact, sustainable advertising opportunities, and a cleaner planet for future generations. Through our solutions, plastic stops being a problem and starts being a possibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 px-4 bg-[rgba(46,125,50,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4 inline-flex">What We Do</span>
            <h2 className="text-4xl font-black text-[#1a3d1f] mt-4">Our Services</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Four pillars that power TechzGreen's circular ecosystem.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Recycle className="w-8 h-8 text-[#2e7d32]" />,
                title: 'Recycled Products',
                desc: 'School benches, tables, furniture, outdoor benches, TV units, roofing sheets, flooring panels, ceiling boards, partitions, and custom momentos — all manufactured from recycled plastic.',
              },
              {
                icon: <Globe className="w-8 h-8 text-[#2e7d32]" />,
                title: 'Circular Economy',
                desc: 'Closing the loop — from MLP collection to durable product manufacture, ensuring plastic waste is never an endpoint but always a starting point.',
              },
              {
                icon: <Leaf className="w-8 h-8 text-[#2e7d32]" />,
                title: 'Sustainable Transformation',
                desc: 'Converting non-valuable plastic waste into high-quality, long-lasting materials that are waterproof, pest-proof, fungus-resistant, and high-density.',
              },
              {
                icon: <Heart className="w-8 h-8 text-[#2e7d32]" />,
                title: 'Community Engagement',
                desc: 'Consultation and technical guidance to companies and organizations on managing plastic waste effectively and achieving sustainable waste management goals.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="glass-card p-8 cursor-default">
                <div className="bg-[rgba(46,125,50,0.1)] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border border-[rgba(46,125,50,0.15)]">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-[#1a3d1f] mb-3">{title}</h3>
                <p className="text-[#5f7a60] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Products ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4 inline-flex"><Package className="w-3.5 h-3.5" />Flagship Products</span>
            <h2 className="text-4xl font-black text-[#1a3d1f] mt-4">Built from Waste. Built to Last.</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Our signature products prove that recycled plastic can match — and exceed — conventional materials.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Z Pallet / Z Board */}
            <div className="glass-panel p-10 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="bg-[rgba(46,125,50,0.1)] w-16 h-16 rounded-2xl flex items-center justify-center border border-[rgba(46,125,50,0.15)] shrink-0">
                  <Building2 className="w-8 h-8 text-[#2e7d32]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-3 py-1.5 rounded-full border border-[rgba(46,125,50,0.2)] h-fit">
                  Industrial Grade
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#1a3d1f]">Z Pallet / Z Board</h3>
              <p className="text-[#5f7a60] leading-relaxed">
                TechzGreen's high-performance Z Pallets are designed for exceptional strength, durability, and load-bearing capacity — ideal for the toughest industrial applications. Z Boards withstand extreme conditions, ensuring unmatched reliability and longevity in material handling.
              </p>
              <ul className="space-y-2">
                {['Exceptional load-bearing capacity', 'Built for extreme industrial conditions', 'Unmatched reliability & longevity', 'Made from recycled MLP plastic'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#2d4a30]">
                    <CheckCircle className="w-4 h-4 text-[#2e7d32] shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Z Momento */}
            <div className="glass-panel-dark p-10 space-y-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="bg-[rgba(255,179,0,0.15)] w-16 h-16 rounded-2xl flex items-center justify-center border border-[rgba(255,179,0,0.3)] shrink-0">
                    <Award className="w-8 h-8 text-[#ffb300]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#ffb300] bg-[rgba(255,179,0,0.15)] px-3 py-1.5 rounded-full border border-[rgba(255,179,0,0.3)] h-fit">
                    Premium Eco Trophy
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">Z Momento</h3>
                <p className="text-[rgba(200,230,201,0.85)] leading-relaxed">
                  A premium, eco-friendly momento and trophy handcrafted from recycled plastic and MLP waste. Thoughtfully designed to look elegant and modern while carrying a powerful message of sustainability — whether given as an award, corporate gift, or recognition trophy.
                </p>
                {/* USP pills */}
                <div className="flex flex-wrap gap-2">
                  {['Premium Finish', '100% Eco-Friendly', 'Corporate Events', 'Awards & Recognition'].map(tag => (
                    <span key={tag} className="text-xs font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Quote */}
                <blockquote className="border-l-2 border-[#ffb300] pl-4 mt-2">
                  <p className="text-[#ffb300] font-bold italic leading-relaxed text-sm">
                    "More than a trophy. It's a statement. It's sustainability made visible."
                  </p>
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Milestone Banner ── */}
      <section className="py-16 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel-dark p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <Award className="w-10 h-10 text-[#ffb300]" />
                <h2 className="text-4xl font-black text-white">Celebrating an Eco-Revolution</h2>
              </div>
              <p className="text-[rgba(200,230,201,0.9)] max-w-2xl mx-auto leading-relaxed text-lg">
                Over 1,200 community members, 4.5 tonnes of plastic diverted from landfills, and 8,000+ green points rewarded. This is only the beginning.
              </p>
              <div className="flex flex-wrap justify-center gap-6 pt-2">
                {[['1,200+', 'Members'], ['4.5T', 'Waste Collected'], ['8,000+', 'Points Awarded']].map(([val, label]) => (
                  <div key={label} className="stat-box-dark px-6 py-4 min-w-[120px]">
                    <p className="stat-num">{val}</p>
                    <p className="stat-label">{label}</p>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-accent inline-flex items-center gap-2 mt-2">
                Be Part of the Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
