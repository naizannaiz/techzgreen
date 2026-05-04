import { Helmet } from 'react-helmet-async';
import { Award, Building2, CheckCircle, Package, Leaf } from 'lucide-react';

export default function FeaturedProducts() {
  return (
    <div className="fade-in pb-28 sm:pb-20">
      <Helmet>
        <title>Featured Products – TechzGreen</title>
        <meta name="description" content="TechzGreen's flagship products — Z Panel Roofing and Z Momento — crafted from recycled plastic for a sustainable future." />
        <link rel="canonical" href="https://techzgreen.in/featured-products" />
        <meta property="og:title" content="Featured Products – TechzGreen" />
        <meta property="og:description" content="Explore TechzGreen's signature eco-products built from recycled plastic." />
        <meta property="og:url" content="https://techzgreen.in/featured-products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Product Cards ── */}
      <section className="py-16 px-4 bg-[rgba(46,125,50,0.03)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label inline-flex mb-4"><Package className="w-3.5 h-3.5" />Our Products</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#1a3d1f] mt-4">Signature Eco-Products</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Two flagship products. One mission — turn plastic waste into lasting value.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Z Panel Roofing / Z Board */}
            <div className="glass-panel p-8 lg:p-10 flex flex-col space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="bg-[rgba(46,125,50,0.1)] w-16 h-16 rounded-2xl flex items-center justify-center border border-[rgba(46,125,50,0.15)] shrink-0">
                  <Building2 className="w-8 h-8 text-[#2e7d32]" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[#2e7d32] bg-[rgba(46,125,50,0.1)] px-3 py-1.5 rounded-full border border-[rgba(46,125,50,0.2)] h-fit">
                  Industrial Grade
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#1a3d1f]">Z Panel Roofing / Z Board</h3>
              <p className="text-[#5f7a60] leading-relaxed flex-grow">
                TechzGreen's high-performance Z Panel Roofing and Z Boards are designed for exceptional strength, durability, and load-bearing capacity — ideal for the toughest industrial applications. These panels withstand extreme conditions, ensuring unmatched reliability and longevity in material handling, roofing, flooring, and partition use.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Exceptional load-bearing capacity',
                  'Built for extreme industrial conditions',
                  'Unmatched reliability & longevity',
                  'Made from 100% recycled MLP plastic',
                  'Waterproof, pest-proof & fungus-resistant',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#2d4a30]">
                    <CheckCircle className="w-4 h-4 text-[#2e7d32] shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Z Momento */}
            <div className="glass-panel-dark flex flex-col relative overflow-hidden" style={{ padding: '2rem 2.5rem' }}>
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
              <div className="relative z-10 flex flex-col h-full space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="bg-[rgba(255,179,0,0.15)] w-16 h-16 rounded-2xl flex items-center justify-center border border-[rgba(255,179,0,0.3)] shrink-0">
                    <Award className="w-8 h-8 text-[#ffb300]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#ffb300] bg-[rgba(255,179,0,0.15)] px-3 py-1.5 rounded-full border border-[rgba(255,179,0,0.3)] h-fit">
                    Premium Eco Trophy
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">Z Momento</h3>
                <p className="text-[rgba(200,230,201,0.85)] leading-relaxed flex-grow">
                  A premium, eco-friendly momento and trophy handcrafted from recycled plastic and MLP waste. Thoughtfully designed to look elegant and modern while carrying a powerful message of sustainability — whether given as an award, corporate gift, or recognition trophy.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Premium Finish', '100% Eco-Friendly', 'Corporate Events', 'Awards & Recognition'].map(tag => (
                    <span key={tag} className="text-xs font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <blockquote className="border-l-2 border-[#ffb300] pl-4">
                  <p className="text-[#ffb300] font-bold italic leading-relaxed text-sm">
                    "More than a trophy. It's a statement. It's sustainability made visible."
                  </p>
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Why Recycled Plastic ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label inline-flex mb-4"><Leaf className="w-3.5 h-3.5" />Why It Matters</span>
            <h2 className="text-3xl font-black text-[#1a3d1f] mt-4">Every Product = Plastic Diverted from Landfills</h2>
            <p className="text-[#5f7a60] mt-3 max-w-xl mx-auto">Numbers that show our commitment to a cleaner planet.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { val: '100%', label: 'Recycled MLP plastic', sub: 'No virgin plastic used in manufacturing' },
              { val: '32+', label: 'Years of expertise', sub: 'Pioneering plastic recycling since day one' },
              { val: '4.5T', label: 'Waste collected', sub: 'And growing with every community member' },
            ].map(({ val, label, sub }) => (
              <div key={label} className="glass-card p-8 text-center">
                <p className="text-4xl font-black text-[#2e7d32] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{val}</p>
                <p className="font-bold text-[#1a3d1f] text-sm mb-1">{label}</p>
                <p className="text-[#5f7a60] text-xs leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
