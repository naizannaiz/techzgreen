import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Phone, Calendar, MapPin, Loader } from 'lucide-react';

type Event = {
  id: string;
  title: string;
  event_date: string;
  location: string;
  description: string;
  poster_url: string;
  max_registrations: number;
};

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EventRegistrationModal({ event, onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: user?.email || '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const { error: regError } = await supabase.from('event_registrations').insert({
        event_id: event.id,
        user_id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
      });

      if (regError) {
        if (regError.code === '23505') throw new Error('You are already registered for this event!');
        throw regError;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg glass-panel p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header with poster */}
        {event.poster_url && (
          <div className="relative h-40 overflow-hidden">
            <img src={event.poster_url} alt={event.title} loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-[#1a3d1f]">{event.title}</h2>
              <div className="flex flex-wrap gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-[#5f7a60]">
                  <Calendar className="w-3.5 h-3.5" />{new Date(event.event_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1 text-xs text-[#5f7a60]">
                    <MapPin className="w-3.5 h-3.5" />{event.location}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-[#5f7a60]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input required value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))}
                  placeholder="Your full name" className="input-glass pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  placeholder="you@example.com" className="input-glass pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="+91 98765 43210" className="input-glass pl-10" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[rgba(46,125,50,0.2)] text-[#2d4a30] font-semibold hover:bg-[rgba(46,125,50,0.05)] transition-colors cursor-pointer text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-[2] btn-primary flex items-center justify-center gap-2 !py-2.5 disabled:opacity-50">
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Registering...</> : 'Confirm Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
