import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, ArrowRight, Leaf, CheckCircle2, ShoppingBag } from 'lucide-react';
import EventRegistrationModal from '../components/EventRegistrationModal';
import { useCart } from '../context/CartContext';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  poster_url: string;
  max_registrations: number;
  is_active: boolean;
};

export default function Events() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [successId, setSuccessId] = useState<string | null>(null);
  const [partnerProducts, setPartnerProducts] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user && events.length > 0) fetchUserRegistrations();
  }, [user, events]);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true });
    if (data) {
      setEvents(data as Event[]);
      const eventIds = data.map((e: any) => e.id);
      
      // Fetch registration counts
      const counts: Record<string, number> = {};
      await Promise.all((data as Event[]).map(async ev => {
        const { count } = await supabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', ev.id);
        counts[ev.id] = count || 0;
      }));
      setRegistrationCounts(counts);

      // Fetch partner products
      if (eventIds.length > 0) {
        const { data: prodData } = await supabase.from('partner_products').select('*').in('event_id', eventIds);
        if (prodData) {
          const grouped: Record<string, any[]> = {};
          prodData.forEach(p => {
            if(!grouped[p.event_id]) grouped[p.event_id] = [];
            grouped[p.event_id].push({...p, isPartnerProduct: true}); // Tag it for Cart
          });
          setPartnerProducts(grouped);
        }
      }
    }
    setLoading(false);
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user.id);
    if (data) setRegisteredIds(data.map((r: any) => r.event_id));
  };

  const handleRegistrationSuccess = (eventId: string) => {
    setSelectedEvent(null);
    setSuccessId(eventId);
    setRegisteredIds(prev => [...prev, eventId]);
    setRegistrationCounts(prev => ({ ...prev, [eventId]: (prev[eventId] || 0) + 1 }));
    setTimeout(() => setSuccessId(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
      {/* Header */}
      <div className="glass-panel-dark p-10 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
        <div className="relative z-10">
          <span className="section-label !bg-white/15 !border-white/25 !text-white mb-4 inline-flex"><Leaf className="w-3.5 h-3.5" />Community</span>
          <h1 className="text-4xl font-black text-white mt-3 mb-3">Eco Events</h1>
          <p className="text-[rgba(200,230,201,0.85)] max-w-lg">
            Join community-driven events that make a real difference. From clean-up drives to recycling workshops — we'd love to see you there!
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="glass-panel p-20 text-center">
          <Calendar className="w-16 h-16 text-[rgba(46,125,50,0.2)] mx-auto mb-4" />
          <p className="text-[#5f7a60] font-semibold text-lg">No upcoming events</p>
          <p className="text-xs text-[#5f7a60] mt-1 opacity-70">Check back soon — the admin will post events here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => {
            const isRegistered = registeredIds.includes(event.id);
            const isSuccess = successId === event.id;
            const spotsLeft = event.max_registrations > 0
              ? event.max_registrations - (registrationCounts[event.id] || 0)
              : null;

            return (
              <div key={event.id} className="glass-card overflow-hidden flex flex-col cursor-default">
                {/* Poster */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={event.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {/* Date badge */}
                  <div className="absolute top-3 right-3 glass-panel !rounded-xl px-3 py-1.5 text-center">
                    <p className="text-xs font-black text-[#1a3d1f]" style={{fontFamily:'Outfit,sans-serif'}}>
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow gap-3">
                  <h3 className="text-lg font-bold text-[#1a3d1f]">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-[#5f7a60] line-clamp-2 leading-relaxed">{event.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs text-[#5f7a60]">
                    {event.location && (
                      <span className="flex items-center gap-1 bg-[rgba(46,125,50,0.07)] border border-[rgba(46,125,50,0.12)] px-2 py-1 rounded-lg">
                        <MapPin className="w-3 h-3" />{event.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-[rgba(46,125,50,0.07)] border border-[rgba(46,125,50,0.12)] px-2 py-1 rounded-lg">
                      <Users className="w-3 h-3" />{registrationCounts[event.id] || 0} registered
                    </span>
                    {spotsLeft !== null && (
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg ${spotsLeft <= 5 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[rgba(46,125,50,0.07)] border border-[rgba(46,125,50,0.12)]'}`}>
                        {spotsLeft} spots left
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-t border-[rgba(46,125,50,0.08)]">
                    {isSuccess ? (
                      <div className="flex items-center gap-2 justify-center text-green-700 bg-green-50 border border-green-200 py-2.5 rounded-xl text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Successfully Registered!
                      </div>
                    ) : isRegistered ? (
                      <div className="flex items-center gap-2 justify-center text-[#2e7d32] bg-[rgba(46,125,50,0.08)] border border-[rgba(46,125,50,0.2)] py-2.5 rounded-xl text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> You're Registered
                      </div>
                    ) : !user ? (
                      <a href="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                        Login to Register <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (spotsLeft !== null && spotsLeft <= 0) ? (
                      <div className="text-center text-sm font-bold text-red-600 bg-red-50 border border-red-100 py-2.5 rounded-xl">
                        Event Full
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm !py-2.5 cursor-pointer"
                      >
                        Register Now <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Partner Products Section */}
                  {partnerProducts[event.id] && partnerProducts[event.id].length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[rgba(46,125,50,0.1)]">
                      <h4 className="text-xs font-bold text-[#1a3d1f] uppercase tracking-wider mb-3 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> Event Merch
                      </h4>
                      <div className="space-y-3">
                        {partnerProducts[event.id].map(product => (
                          <div key={product.id} className="flex gap-3 items-center bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                            {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-md" />}
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-bold text-[#1a3d1f] truncate">{product.name}</p>
                              <p className="text-xs text-[#2e7d32] font-black">₹{product.price}</p>
                            </div>
                            <button 
                              onClick={() => {
                                addToCart(product);
                                alert(`${product.name} added to cart!`);
                              }}
                              className="bg-[rgba(46,125,50,0.1)] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white p-2 rounded-lg transition-colors cursor-pointer"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={() => handleRegistrationSuccess(selectedEvent.id)}
        />
      )}
    </div>
  );
}
