import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Recycle, Star, Leaf, Users, ArrowRight, CheckCircle, Globe, Award, Heart, Package } from 'lucide-react';

export default function About() {
  return (
    <div className="fade-in pb-20">
      <Helmet>
        <title>About TechzGreen – 32+ Years Pioneering Plastic Recycling</title>
        <meta name="description" content="TechzGreen transforms MLP plastic waste into durable products. Learn about our mission, vision, Z Pallet, Z Board products, and community of 1,200+ eco-warriors." />
        <link rel="canonical" href="https://techzgreen.in/about" />
        <meta property="og:title" content="About TechzGreen – 32+ Years Pioneering Plastic Recycling" />
        <meta property="og:description" content="TechzGreen transforms MLP plastic waste into durable products. Learn about our mission, vision, and community of 1,200+ eco-warriors." />
        <meta property="og:url" content="https://techzgreen.in/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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
                loading="lazy"
                className="rounded-2xl object-cover h-52 w-full mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=600"
                alt="Waste sorting"
                loading="lazy"
                className="rounded-2xl object-cover h-52 w-full -mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600"
                alt="Green future"
                loading="lazy"
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

      {/* ── Founders ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label mb-4 inline-flex"><Users className="w-3.5 h-3.5" />The Team</span>
            <h2 className="text-4xl font-black text-[#1a3d1f] mt-4">Meet the Founders</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">The people behind TechzGreen's mission to turn plastic waste into a resource.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                name: 'Founder Name',
                role: 'CEO & Co-Founder',
                bio: 'Visionary behind TechzGreen\'s circular economy model. 10+ years in sustainable manufacturing and MLP recycling technology.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
              },
              {
                name: 'Founder Name',
                role: 'CTO & Co-Founder',
                bio: 'Leads product innovation and recycling process engineering. Passionate about converting waste streams into high-value materials.',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300',
              },
              {
                name: 'Founder Name',
                role: 'COO & Co-Founder',
                bio: 'Drives community engagement and operational scale. Built TechzGreen\'s network of 1,200+ eco-warriors from the ground up.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
              },
            ].map(({ name, role, bio, avatar }) => (
              <div key={role} className="glass-card p-8 flex flex-col items-center text-center group">
                {/* Avatar */}
                <div className="relative mb-5">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[rgba(46,125,50,0.2)] group-hover:border-[#2e7d32] transition-colors"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#2e7d32] w-7 h-7 rounded-lg flex items-center justify-center border-2 border-white shadow">
                    <Leaf className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                {/* Info */}
                <h3 className="text-lg font-black text-[#1a3d1f]">{name}</h3>
                <span className="text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-3 py-1 rounded-full border border-[rgba(46,125,50,0.2)] mt-2 mb-3">
                  {role}
                </span>
                <p className="text-[#5f7a60] text-sm leading-relaxed flex-grow">{bio}</p>
                {/* Social links */}
                <div className="flex gap-3 mt-5">
                  <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-[rgba(46,125,50,0.08)] hover:bg-[#2e7d32] text-[#5f7a60] hover:text-white transition-all flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                  <a href="#" aria-label="Twitter / X" className="w-8 h-8 rounded-lg bg-[rgba(46,125,50,0.08)] hover:bg-[#2e7d32] text-[#5f7a60] hover:text-white transition-all flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.536-8.626L2.25 2.25h6.832l4.26 5.636zm-1.16 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products Teaser ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel-dark p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
            <div className="relative z-10 space-y-5">
              <span className="section-label mb-4 inline-flex"><Package className="w-3.5 h-3.5" />Flagship Products</span>
              <h2 className="text-4xl font-black text-white mt-4">Built from Waste. Built to Last.</h2>
              <p className="text-[rgba(200,230,201,0.85)] max-w-xl mx-auto leading-relaxed">
                From industrial-grade Z Panel Roofing to premium eco-friendly Z Momentos — our signature products prove recycled plastic can match and exceed conventional materials.
              </p>
              <Link to="/featured-products" className="btn-accent inline-flex items-center gap-2 mt-2">
                Explore Featured Products <ArrowRight className="w-4 h-4" />
              </Link>
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
