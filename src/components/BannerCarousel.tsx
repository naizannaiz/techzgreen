import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
};

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setBanners(data as Banner[]); });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative overflow-hidden mx-4 mb-2 rounded-2xl shadow-lg" style={{maxWidth:'calc(100% - 2rem)', margin:'0 1rem 1.5rem'}}>
      {/* Slide */}
      <div className="relative h-48 md:h-64">
        <img
          src={banner.image_url}
          alt={banner.title}
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <span className="section-label mb-2 inline-flex w-fit !bg-white/20 !border-white/30 !text-white text-xs">Announcement</span>
          <h3 className="text-2xl md:text-3xl font-black text-white mb-1 drop-shadow">{banner.title}</h3>
          {banner.subtitle && <p className="text-white/80 text-sm md:text-base">{banner.subtitle}</p>}
          {banner.link_url && (
            <a href={banner.link_url} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 btn-accent text-xs w-fit">
              Learn More <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent(c => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors cursor-pointer backdrop-blur-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrent(c => (c + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors cursor-pointer backdrop-blur-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === current ? 'bg-white w-5' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
