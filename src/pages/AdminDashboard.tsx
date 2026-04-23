import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  XCircle, Award, Leaf, CheckCircle2, Package, Plus, Trash2, UploadCloud,
  Tag, Image, Calendar, MapPin, Users, Settings, ChevronRight, X, Phone, Mail,
  Megaphone, ToggleLeft, ToggleRight, ShoppingBag, Truck, Clock, CheckCheck,
  ChevronDown, ChevronUp, ExternalLink, Gift, Star
} from 'lucide-react';

// ── Order Card sub-component (needs own state hooks) ──
function OrderCard({
  order, expandedOrderId, setExpandedOrderId, orderUpdating, updateOrderTracking, ADMIN_EMAIL
}: {
  order: any;
  expandedOrderId: string | null;
  setExpandedOrderId: (id: string | null) => void;
  orderUpdating: string | null;
  updateOrderTracking: (id: string, shipped: boolean, date: string, notes: string) => void;
  ADMIN_EMAIL: string;
}) {
  const isExpanded = expandedOrderId === order.id;
  const addr = order.user_addresses;
  const [trackShipped, setTrackShipped] = useState(order.shipped || false);
  const [trackDate, setTrackDate] = useState<string>(order.expected_delivery || '');
  const [trackNotes, setTrackNotes] = useState<string>(order.admin_notes || '');

  return (
    <div className={`glass-card overflow-hidden transition-all ${orderUpdating === order.id ? 'opacity-60' : ''}`}>
      {/* Order Header Row */}
      <button
        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${order.shipped ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
          {order.shipped ? <Truck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black text-[#1a3d1f] text-sm">#{order.id.substring(0,8).toUpperCase()}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.shipped ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {order.shipped ? '✓ Shipped' : 'Pending'}
            </span>
          </div>
          <p className="text-xs text-[#5f7a60] mt-0.5">
            {new Date(order.created_at).toLocaleString('en-IN')}
            {order.expected_delivery && ` · Expected: ${new Date(order.expected_delivery).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-black text-[#2e7d32] text-sm" style={{fontFamily:'Outfit,sans-serif'}}>₹{Number(order.total_amount).toFixed(2)}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#5f7a60]" /> : <ChevronDown className="w-4 h-4 text-[#5f7a60]" />}
        </div>
      </button>

      {/* Expanded Detail Panel */}
      {isExpanded && (
        <div className="border-t border-[rgba(46,125,50,0.1)] p-4 sm:p-6 space-y-6 bg-[rgba(46,125,50,0.02)]">
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-[#1a3d1f] mb-3 flex items-center gap-1.5 text-sm"><Package className="w-4 h-4" /> Items Ordered</h3>
              <div className="space-y-2">
                {(order.order_items || []).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                    <img
                      src={item.products?.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=80&q=60'}
                      alt={item.products?.name}
                      loading="lazy"
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-[#1a3d1f] text-sm truncate">{item.products?.name || 'Product'}</p>
                      <p className="text-xs text-[#5f7a60]">Qty: {item.quantity} × ₹{Number(item.price_at_time).toFixed(2)}</p>
                    </div>
                    <p className="font-black text-[#2e7d32] text-sm flex-shrink-0">₹{(item.quantity * item.price_at_time).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-[rgba(46,125,50,0.12)] px-1">
                  <span className="font-bold text-[#2d4a30] text-sm">Order Total</span>
                  <span className="font-black text-[#2e7d32]">₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="font-bold text-[#1a3d1f] mb-3 flex items-center gap-1.5 text-sm"><MapPin className="w-4 h-4" /> Delivery Address</h3>
              {addr ? (
                <div className="bg-white/60 rounded-xl p-4 text-sm text-[#2d4a30] space-y-0.5">
                  <p className="font-bold">{addr.fullname}</p>
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} — {addr.zip_code}</p>
                </div>
              ) : (
                <p className="text-xs text-[#5f7a60] italic">No address on file</p>
              )}
              <div className="mt-4 flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5f7a60] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-[#5f7a60]">Customer support email:</p>
                  <a
                    href={`mailto:${ADMIN_EMAIL}?subject=Order #${order.id.substring(0,8).toUpperCase()} Query`}
                    className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
                  >
                    {ADMIN_EMAIL} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Controls */}
          <div className="bg-white/70 rounded-2xl p-5 border border-[rgba(46,125,50,0.12)]">
            <h3 className="font-bold text-[#1a3d1f] mb-4 flex items-center gap-1.5 text-sm"><Truck className="w-4 h-4 text-[#2e7d32]" /> Shipping Controls</h3>
            <div className="space-y-4">
              {/* Shipped checkbox */}
              <div
                onClick={() => setTrackShipped(!trackShipped)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${trackShipped ? 'bg-[#2e7d32] border-[#2e7d32]' : 'border-[rgba(46,125,50,0.4)] group-hover:border-[#2e7d32]'}`}>
                  {trackShipped && <CheckCheck className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="font-bold text-[#1a3d1f] text-sm">Mark as Shipped</p>
                  <p className="text-xs text-[#5f7a60]">{trackShipped ? '✓ Order marked as shipped' : 'Tick when order leaves warehouse'}</p>
                </div>
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Expected Delivery Date</label>
                <input
                  type="date"
                  value={trackDate}
                  onChange={e => setTrackDate(e.target.value)}
                  className="input-glass max-w-[220px]"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Internal Notes</label>
                <textarea
                  rows={2}
                  value={trackNotes}
                  onChange={e => setTrackNotes(e.target.value)}
                  placeholder="e.g. Courier: BlueDart, AWB 123456..."
                  className="input-glass resize-none"
                />
              </div>

              <button
                onClick={() => updateOrderTracking(order.id, trackShipped, trackDate, trackNotes)}
                disabled={orderUpdating === order.id}
                className="btn-primary flex items-center gap-2 !py-2.5 !px-6 disabled:opacity-50"
              >
                {orderUpdating === order.id
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                  : <><CheckCheck className="w-4 h-4" /> Save &amp; Update</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


type Tab = 'submissions' | 'products' | 'banners' | 'events' | 'orders' | 'vouchers' | 'partner_merch' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profileRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('submissions');

  // ── Submissions ──
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // ── Products ──
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const productFileRef = useRef<HTMLInputElement>(null);

  // ── Banners ──
  const [banners, setBanners] = useState<any[]>([]);
  const [addingBanner, setAddingBanner] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', link_url: '' });
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // ── Events ──
  const [events, setEvents] = useState<any[]>([]);
  const [addingEvent, setAddingEvent] = useState(false);
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', location: '', max_registrations: '' });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const eventFileRef = useRef<HTMLInputElement>(null);

  // ── Settings ──
  const [pointToRs, setPointToRs] = useState('1');
  const [savingSettings, setSavingSettings] = useState(false);

  // ── Orders ──
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderUpdating, setOrderUpdating] = useState<string | null>(null);
  const ADMIN_EMAIL = 'admin@teczgreen.com'; // ← change to real admin email

  // ── Vouchers ──
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [addingVoucher, setAddingVoucher] = useState(false);
  const [voucherForm, setVoucherForm] = useState({ title: '', description: '', brand_name: '', points_cost: '', promo_code: '' });

  // ── Partner Merch ──
  const [partnerProducts, setPartnerProducts] = useState<any[]>([]);
  const [addingPartnerProduct, setAddingPartnerProduct] = useState(false);
  const [partnerProductForm, setPartnerProductForm] = useState({ event_id: '', partner_name: '', name: '', description: '', price: '', stock: '' });
  const [partnerProductImageFile, setPartnerProductImageFile] = useState<File | null>(null);
  const [partnerProductImagePreview, setPartnerProductImagePreview] = useState<string | null>(null);
  const partnerProductFileRef = useRef<HTMLInputElement>(null);

  const fetchedTabs = useRef<Set<Tab>>(new Set());

  // Mount: guard + load default tab only
  useEffect(() => {
    if (profileRole && profileRole !== 'admin') { navigate('/dashboard'); return; }
    if (profileRole === 'admin') {
      fetchSubmissions();
      fetchedTabs.current.add('submissions');
    }
  }, [profileRole, navigate]);

  // Tab change: lazy-load data once per tab
  useEffect(() => {
    if (profileRole !== 'admin') return;
    if (fetchedTabs.current.has(activeTab)) return;
    fetchedTabs.current.add(activeTab);
    switch (activeTab) {
      case 'products': fetchProducts(); break;
      case 'banners': fetchBanners(); break;
      case 'events': fetchEvents(); break;
      case 'orders': fetchOrders(); break;
      case 'vouchers': fetchVouchers(); break;
      case 'partner_merch': fetchPartnerProducts(); fetchEvents(); break;
      case 'settings': fetchSettings(); break;
    }
  }, [activeTab, profileRole]);

  // ─── Submissions ───
  const fetchSubmissions = async () => {
    const { data } = await supabase.from('waste_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    if (data) setSubmissions(data);
    setSubmissionsLoading(false);
  };
  const handleApprove = async (subId: string, userId: string, points: number) => {
    if (!user) return;
    setProcessing(subId);
    try {
      await supabase.from('waste_submissions').update({ status: 'approved', points_awarded: points, reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('id', subId);
      await supabase.from('points_ledger').insert({ user_id: userId, points_change: points, description: 'Waste verification approved by Admin' });
      fetchSubmissions();
    } catch (e: any) { alert(e.message); } finally { setProcessing(null); }
  };
  const handleReject = async (subId: string) => {
    if (!user) return;
    setProcessing(subId);
    try {
      await supabase.from('waste_submissions').update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq('id', subId);
      fetchSubmissions();
    } catch (e: any) { alert(e.message); } finally { setProcessing(null); }
  };

  // ─── Products ───
  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setProductsLoading(false);
  };
  const uploadImage = async (file: File, bucket: string, prefix = '') => {
    const ext = file.name.split('.').pop();
    const path = `${prefix}${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '31536000' });
    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      let imageUrl = '';
      if (productImageFile) imageUrl = await uploadImage(productImageFile, 'waste-images', 'products/');
      await supabase.from('products').insert({ name: productForm.name, description: productForm.description, price: parseFloat(productForm.price), stock: parseInt(productForm.stock || '0', 10), image_url: imageUrl });
      setProductForm({ name: '', description: '', price: '', stock: '' });
      setProductImageFile(null); setProductImagePreview(null);
      if (productFileRef.current) productFileRef.current.value = '';
      fetchProducts();
    } catch (e: any) { alert(e.message); } finally { setAddingProduct(false); }
  };
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeletingProductId(id);
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
    setDeletingProductId(null);
  };

  // ─── Banners ───
  const fetchBanners = async () => {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (data) setBanners(data);
  };
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImageFile) { alert('Please upload a banner image.'); return; }
    setAddingBanner(true);
    try {
      const imageUrl = await uploadImage(bannerImageFile, 'banners');
      await supabase.from('banners').insert({ title: bannerForm.title, subtitle: bannerForm.subtitle, link_url: bannerForm.link_url, image_url: imageUrl });
      setBannerForm({ title: '', subtitle: '', link_url: '' });
      setBannerImageFile(null); setBannerImagePreview(null);
      if (bannerFileRef.current) bannerFileRef.current.value = '';
      fetchBanners();
    } catch (e: any) { alert(e.message); } finally { setAddingBanner(false); }
  };
  const toggleBanner = async (id: string, current: boolean) => {
    await supabase.from('banners').update({ is_active: !current }).eq('id', id);
    fetchBanners();
  };
  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    fetchBanners();
  };

  // ─── Events ───
  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (data) setEvents(data);
  };
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingEvent(true);
    try {
      let posterUrl = '';
      if (eventImageFile) posterUrl = await uploadImage(eventImageFile, 'events');
      await supabase.from('events').insert({ title: eventForm.title, description: eventForm.description, event_date: eventForm.event_date, location: eventForm.location, max_registrations: parseInt(eventForm.max_registrations || '0', 10), poster_url: posterUrl });
      setEventForm({ title: '', description: '', event_date: '', location: '', max_registrations: '' });
      setEventImageFile(null); setEventImagePreview(null);
      if (eventFileRef.current) eventFileRef.current.value = '';
      fetchEvents();
    } catch (e: any) { alert(e.message); } finally { setAddingEvent(false); }
  };
  const toggleEvent = async (id: string, current: boolean) => {
    await supabase.from('events').update({ is_active: !current }).eq('id', id);
    fetchEvents();
  };
  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event and all registrations?')) return;
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };
  const viewRegistrations = async (eventId: string) => {
    setSelectedEventId(eventId);
    const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).order('created_at', { ascending: false });
    if (data) setEventRegistrations(data);
  };

  // ─── Settings ───
  const fetchSettings = async () => {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'point_to_rs').single();
    if (data) setPointToRs(data.value);
  };
  const saveSettings = async () => {
    setSavingSettings(true);
    await supabase.from('app_settings').upsert({ key: 'point_to_rs', value: pointToRs, updated_at: new Date().toISOString() });
    setSavingSettings(false);
    alert('Settings saved!');
  };

  // ─── Orders ───
  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        user_addresses(*),
        order_items(*, products(name, image_url, price))
      `)
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const updateOrderTracking = async (
    orderId: string,
    shipped: boolean,
    expectedDelivery: string,
    adminNotes: string
  ) => {
    setOrderUpdating(orderId);
    const currentOrder = orders.find((o: any) => o.id === orderId);
    const currentStatus = currentOrder?.status ?? 'paid';
    let newStatus = currentStatus;
    if (shipped && currentStatus !== 'delivered') newStatus = 'shipped';
    if (!shipped && currentStatus === 'shipped') newStatus = 'paid';

    await supabase.from('orders').update({
      shipped,
      expected_delivery: expectedDelivery || null,
      admin_notes: adminNotes || null,
      status: newStatus,
    }).eq('id', orderId);
    await fetchOrders();
    setOrderUpdating(null);
  };

  // ─── Vouchers ───
  const fetchVouchers = async () => {
    const { data } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
    if (data) setVouchers(data);
  };
  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingVoucher(true);
    try {
      await supabase.from('vouchers').insert({
        title: voucherForm.title,
        description: voucherForm.description,
        brand_name: voucherForm.brand_name,
        points_cost: parseInt(voucherForm.points_cost, 10),
        promo_code: voucherForm.promo_code || null,
        is_active: true
      });
      setVoucherForm({ title: '', description: '', brand_name: '', points_cost: '', promo_code: '' });
      fetchVouchers();
    } catch (e: any) { alert(e.message); } finally { setAddingVoucher(false); }
  };
  const toggleVoucher = async (id: string, current: boolean) => {
    await supabase.from('vouchers').update({ is_active: !current }).eq('id', id);
    fetchVouchers();
  };
  const deleteVoucher = async (id: string) => {
    if (!confirm('Delete this voucher?')) return;
    await supabase.from('vouchers').delete().eq('id', id);
    fetchVouchers();
  };

  // ─── Partner Merch ───
  const fetchPartnerProducts = async () => {
    const { data } = await supabase.from('partner_products').select('*, events(title)').order('created_at', { ascending: false });
    if (data) setPartnerProducts(data);
  };
  const handleAddPartnerProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingPartnerProduct(true);
    try {
      let imageUrl = '';
      if (partnerProductImageFile) imageUrl = await uploadImage(partnerProductImageFile, 'waste-images', 'partner-products/');
      await supabase.from('partner_products').insert({
        event_id: partnerProductForm.event_id,
        partner_name: partnerProductForm.partner_name,
        name: partnerProductForm.name,
        description: partnerProductForm.description,
        price: parseFloat(partnerProductForm.price),
        stock: parseInt(partnerProductForm.stock || '0', 10),
        image_url: imageUrl
      });
      setPartnerProductForm({ event_id: '', partner_name: '', name: '', description: '', price: '', stock: '' });
      setPartnerProductImageFile(null); setPartnerProductImagePreview(null);
      if (partnerProductFileRef.current) partnerProductFileRef.current.value = '';
      fetchPartnerProducts();
    } catch (e: any) { alert(e.message); } finally { setAddingPartnerProduct(false); }
  };
  const deletePartnerProduct = async (id: string) => {
    if (!confirm('Delete this partner product?')) return;
    await supabase.from('partner_products').delete().eq('id', id);
    fetchPartnerProducts();
  };

  if (!profileRole || submissionsLoading) {
    return <div className="flex justify-center items-center py-32"><div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const pointOptions = [1, 4, 5, 6, 8, 10];
  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'submissions', label: 'Verifications', icon: <Award className="w-4 h-4" />, badge: submissions.length },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'banners', label: 'Banners', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, badge: orders.filter((o:any) => !o.shipped).length || undefined },
    { id: 'vouchers', label: 'Vouchers', icon: <Tag className="w-4 h-4" /> },
    { id: 'partner_merch', label: 'Partner Merch', icon: <Gift className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const ImageUploadBox = ({ preview, onFile, inputRef, label }: { preview: string | null; onFile: (f: File) => void; inputRef: React.RefObject<HTMLInputElement | null>; label?: string }) => (
    <div>
      {label && <p className="text-sm font-bold text-[#2d4a30] mb-1.5">{label}</p>}
      <label className="cursor-pointer block">
        <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${preview ? 'border-[#2e7d32] bg-[rgba(46,125,50,0.04)]' : 'border-[rgba(46,125,50,0.25)] hover:border-[#2e7d32]'}`}>
          {preview ? <img src={preview} alt="Preview" className="h-28 mx-auto rounded-lg object-cover" /> : <><UploadCloud className="w-8 h-8 text-[rgba(46,125,50,0.4)] mx-auto mb-2" /><p className="text-sm text-[#5f7a60] font-medium">Click to upload</p></>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { onFile(f); } }} />
      </label>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      {/* Header */}
      <div className="glass-panel-dark p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="bg-white/15 p-3 rounded-2xl flex-shrink-0"><Leaf className="w-7 h-7 text-[#ffb300]" /></div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Admin Dashboard</h1>
              <p className="text-[rgba(200,230,201,0.8)] text-sm mt-0.5">Manage everything from one place.</p>
            </div>
          </div>
          <div className="sm:ml-auto flex gap-3 flex-wrap admin-stats-row">
            {[{ n: submissions.length, l: 'Pending' }, { n: products.length, l: 'Products' }, { n: events.length, l: 'Events' }].map(({ n, l }) => (
              <div key={l} className="stat-box-dark px-5 py-3 text-center min-w-[80px]">
                <p className="stat-num">{n}</p>
                <p className="stat-label">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar – horizontal scroll on mobile */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0
              ${activeTab === tab.id ? 'bg-[#2e7d32] text-white shadow-md' : 'glass-panel !rounded-xl text-[#2d4a30] hover:bg-[rgba(46,125,50,0.08)]'}`}>
            {tab.icon} {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="bg-[#ffb300] text-black text-xs font-black px-1.5 py-0.5 rounded-full">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ SUBMISSIONS TAB ═══ */}
      {activeTab === 'submissions' && (
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-bold text-[#1a3d1f] mb-8 flex items-center gap-2"><Award className="text-[#ffb300] w-6 h-6" /> Waste Verification Queue</h2>
          {submissions.length === 0 ? (
            <div className="text-center py-16"><CheckCircle2 className="w-16 h-16 text-[rgba(46,125,50,0.2)] mx-auto mb-4" /><p className="text-[#5f7a60] font-semibold text-lg">All caught up!</p><p className="text-[#5f7a60] text-sm opacity-70">No pending submissions.</p></div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {submissions.map((sub: any) => (
                <div key={sub.id} className={`glass-card overflow-hidden flex flex-col ${processing === sub.id ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div className="relative">
                    <img src={sub.image_url} className="w-full h-52 object-cover" alt="Waste" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute bottom-3 left-3"><span className="text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">{new Date(sub.created_at).toLocaleDateString()}</span></div>
                  </div>
                  <div className="p-5 flex flex-col gap-4 flex-grow">
                    <p className="text-xs text-[#5f7a60] font-mono break-all bg-[rgba(46,125,50,0.05)] px-2 py-1.5 rounded-lg">User: {sub.user_id.substring(0, 20)}...</p>
                    <div>
                      <p className="text-sm font-bold text-[#2d4a30] mb-2 flex items-center gap-1.5"><Award className="w-4 h-4 text-[#ffb300]" /> Award Points:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {pointOptions.map(pts => (
                          <button key={pts} onClick={() => handleApprove(sub.id, sub.user_id, pts)} className="bg-[rgba(46,125,50,0.08)] border border-[rgba(46,125,50,0.2)] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white font-black py-2 rounded-xl transition-all text-sm cursor-pointer">+{pts}</button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleReject(sub.id)} className="mt-auto flex items-center justify-center gap-2 w-full text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm cursor-pointer"><XCircle className="w-4 h-4" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ PRODUCTS TAB ═══ */}
      {activeTab === 'products' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-[#2e7d32]" /> Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <ImageUploadBox preview={productImagePreview} inputRef={productFileRef} label="Product Image" onFile={f => { setProductImageFile(f); setProductImagePreview(URL.createObjectURL(f)); }} />
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Name *</label>
                  <input required value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bamboo Toothbrush" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Description</label>
                  <textarea rows={2} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} className="input-glass resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Price ($) *</label>
                    <div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" /><input required type="number" min="0" step="0.01" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="9.99" className="input-glass pl-10" /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Stock</label>
                    <input type="number" min="0" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" className="input-glass" />
                  </div>
                </div>
                <button type="submit" disabled={addingProduct} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">{addingProduct ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Adding...</> : <><Plus className="w-4 h-4" /> Add to Catalog</>}</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Package className="w-5 h-5" /> Products ({products.length})</h2>
            {productsLoading ? <div className="text-center py-12"><div className="w-8 h-8 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin mx-auto"></div></div> : products.length === 0 ? <div className="glass-panel p-16 text-center"><Package className="w-12 h-12 text-[rgba(46,125,50,0.2)] mx-auto mb-3" /><p className="text-[#5f7a60]">No products yet.</p></div> : (
              <div className="space-y-4">
                {products.map((p: any) => (
                  <div key={p.id} className={`glass-card p-4 flex gap-4 items-center ${deletingProductId === p.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <img src={p.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&q=80'} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#1a3d1f] truncate">{p.name}</h3>
                      <p className="text-xs text-[#5f7a60] line-clamp-1">{p.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-black text-[#2e7d32]" style={{ fontFamily: 'Outfit,sans-serif' }}>${Number(p.price).toFixed(2)}</span>
                        <span className="text-xs text-[#5f7a60] bg-[rgba(46,125,50,0.08)] border border-[rgba(46,125,50,0.15)] px-2 py-0.5 rounded-lg">Stock: {p.stock}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="flex-shrink-0 p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ BANNERS TAB ═══ */}
      {activeTab === 'banners' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#2e7d32]" /> Create Banner</h2>
              <form onSubmit={handleAddBanner} className="space-y-4">
                <ImageUploadBox preview={bannerImagePreview} inputRef={bannerFileRef} label="Banner Image *" onFile={f => { setBannerImageFile(f); setBannerImagePreview(URL.createObjectURL(f)); }} />
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Title *</label>
                  <input required value={bannerForm.title} onChange={e => setBannerForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Summer Sale!" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Subtitle</label>
                  <input value={bannerForm.subtitle} onChange={e => setBannerForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Optional tagline" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Link URL</label>
                  <input type="url" value={bannerForm.link_url} onChange={e => setBannerForm(f => ({ ...f, link_url: e.target.value }))} placeholder="https://..." className="input-glass" />
                </div>
                <button type="submit" disabled={addingBanner} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">{addingBanner ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Publishing...</> : <><Megaphone className="w-4 h-4" /> Publish Banner</>}</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-[#1a3d1f] mb-6">Active Banners ({banners.length})</h2>
            {banners.length === 0 ? <div className="glass-panel p-16 text-center"><Image className="w-12 h-12 text-[rgba(46,125,50,0.2)] mx-auto mb-3" /><p className="text-[#5f7a60]">No banners yet.</p></div> : (
              <div className="space-y-4">
                {banners.map((b: any) => (
                  <div key={b.id} className="glass-card p-4 flex gap-4 items-center">
                    <img src={b.image_url} alt={b.title} className="w-24 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#1a3d1f] truncate text-sm">{b.title}</h3>
                      {b.subtitle && <p className="text-xs text-[#5f7a60] truncate">{b.subtitle}</p>}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${b.is_active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-100'}`}>{b.is_active ? 'Live' : 'Hidden'}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => toggleBanner(b.id, b.is_active)} className="p-2 rounded-xl hover:bg-[rgba(46,125,50,0.1)] text-[#2e7d32] transition-colors cursor-pointer" title={b.is_active ? 'Deactivate' : 'Activate'}>{b.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}</button>
                      <button onClick={() => deleteBanner(b.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ EVENTS TAB ═══ */}
      {activeTab === 'events' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#2e7d32]" /> Create Event</h2>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <ImageUploadBox preview={eventImagePreview} inputRef={eventFileRef} label="Event Poster" onFile={f => { setEventImageFile(f); setEventImagePreview(URL.createObjectURL(f)); }} />
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Event Title *</label>
                  <input required value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} placeholder="Community Clean-Up Drive" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Description</label>
                  <textarea rows={2} value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} className="input-glass resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Date & Time *</label>
                  <input required type="datetime-local" value={eventForm.event_date} onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))} className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Location</label>
                  <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" /><input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} placeholder="Chennai, Tamil Nadu" className="input-glass pl-10" /></div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Max Registrations (0 = unlimited)</label>
                  <input type="number" min="0" value={eventForm.max_registrations} onChange={e => setEventForm(f => ({ ...f, max_registrations: e.target.value }))} placeholder="0" className="input-glass" />
                </div>
                <button type="submit" disabled={addingEvent} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">{addingEvent ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating...</> : <><Calendar className="w-4 h-4" /> Create Event</>}</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={`transition-all ${selectedEventId ? 'hidden' : 'block'}`}>
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6">All Events ({events.length})</h2>
              {events.length === 0 ? <div className="glass-panel p-16 text-center"><Calendar className="w-12 h-12 text-[rgba(46,125,50,0.2)] mx-auto mb-3" /><p className="text-[#5f7a60]">No events yet.</p></div> : (
                <div className="space-y-4">
                  {events.map((ev: any) => (
                    <div key={ev.id} className="glass-card p-4 flex gap-4 items-center">
                      <img src={ev.poster_url || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200'} alt={ev.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-[#1a3d1f] text-sm truncate">{ev.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="flex items-center gap-1 text-xs text-[#5f7a60]"><Calendar className="w-3 h-3" />{new Date(ev.event_date).toLocaleDateString()}</span>
                          {ev.location && <span className="flex items-center gap-1 text-xs text-[#5f7a60]"><MapPin className="w-3 h-3" />{ev.location}</span>}
                        </div>
                        <button onClick={() => viewRegistrations(ev.id)} className="flex items-center gap-1 text-xs font-bold text-[#2e7d32] hover:underline mt-1 cursor-pointer">
                          <Users className="w-3 h-3" /> View Registrations <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => toggleEvent(ev.id, ev.is_active)} className="p-2 rounded-xl hover:bg-[rgba(46,125,50,0.1)] text-[#2e7d32] cursor-pointer">{ev.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}</button>
                        <button onClick={() => deleteEvent(ev.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registrations Panel */}
            {selectedEventId && (
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#1a3d1f] flex items-center gap-2"><Users className="w-5 h-5" /> Registrations ({eventRegistrations.length})</h2>
                  <button onClick={() => setSelectedEventId(null)} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer text-[#5f7a60]"><X className="w-5 h-5" /></button>
                </div>
                {eventRegistrations.length === 0 ? (
                  <div className="text-center py-10"><Users className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" /><p className="text-[#5f7a60]">No registrations yet.</p></div>
                ) : (
                  <div className="space-y-3">
                    {eventRegistrations.map((reg: any) => (
                      <div key={reg.id} className="bg-[rgba(46,125,50,0.04)] border border-[rgba(46,125,50,0.1)] rounded-xl p-4 flex items-center gap-4">
                        <div className="bg-[rgba(46,125,50,0.1)] w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[#2e7d32] font-black text-sm">{reg.full_name[0]}</div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-[#1a3d1f] text-sm">{reg.full_name}</p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#5f7a60]">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{reg.email}</span>
                            {reg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{reg.phone}</span>}
                          </div>
                        </div>
                        <span className="text-xs text-[#5f7a60] flex-shrink-0">{new Date(reg.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ ORDERS TAB ═══ */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#1a3d1f] flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#2e7d32]" /> All Orders ({orders.length})
            </h2>
            <span className="text-xs text-[#5f7a60] bg-[rgba(46,125,50,0.06)] border border-[rgba(46,125,50,0.12)] px-3 py-1.5 rounded-xl font-semibold">
              {orders.filter((o: any) => !o.shipped).length} pending shipment
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="glass-panel p-16 text-center">
              <ShoppingBag className="w-14 h-14 text-[rgba(46,125,50,0.2)] mx-auto mb-3" />
              <p className="text-[#5f7a60] font-semibold">No orders yet.</p>
            </div>
          ) : (
            orders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                expandedOrderId={expandedOrderId}
                setExpandedOrderId={setExpandedOrderId}
                orderUpdating={orderUpdating}
                updateOrderTracking={updateOrderTracking}
                ADMIN_EMAIL={ADMIN_EMAIL}
              />
            ))
          )}
        </div>
      )}

      {/* ═══ VOUCHERS TAB ═══ */}
      {activeTab === 'vouchers' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Tag className="w-5 h-5 text-[#2e7d32]" /> Create Voucher</h2>
              <form onSubmit={handleAddVoucher} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Brand Name *</label>
                  <input required value={voucherForm.brand_name} onChange={e => setVoucherForm(f => ({ ...f, brand_name: e.target.value }))} placeholder="e.g. Amazon" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Voucher Title *</label>
                  <input required value={voucherForm.title} onChange={e => setVoucherForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. ₹500 Gift Card" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Description</label>
                  <textarea rows={2} value={voucherForm.description} onChange={e => setVoucherForm(f => ({ ...f, description: e.target.value }))} className="input-glass resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Points Cost *</label>
                    <input required type="number" min="1" value={voucherForm.points_cost} onChange={e => setVoucherForm(f => ({ ...f, points_cost: e.target.value }))} placeholder="50" className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Base Promo Code</label>
                    <input value={voucherForm.promo_code} onChange={e => setVoucherForm(f => ({ ...f, promo_code: e.target.value }))} placeholder="e.g. AMZ500" className="input-glass" />
                  </div>
                </div>
                <button type="submit" disabled={addingVoucher} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {addingVoucher ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Adding...</> : <><Tag className="w-4 h-4" /> Add Voucher</>}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Gift className="w-5 h-5" /> Active Vouchers ({vouchers.length})</h2>
            {vouchers.length === 0 ? <div className="glass-panel p-16 text-center"><Tag className="w-12 h-12 text-[rgba(46,125,50,0.2)] mx-auto mb-3" /><p className="text-[#5f7a60]">No vouchers created yet.</p></div> : (
              <div className="space-y-4">
                {vouchers.map((v: any) => (
                  <div key={v.id} className="glass-card p-4 flex gap-4 items-center">
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#1a3d1f]">{v.title} <span className="text-sm font-normal text-[#5f7a60]">({v.brand_name})</span></h3>
                      <p className="text-xs text-[#5f7a60] line-clamp-1 mt-1">{v.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-black text-[#ffb300] text-sm flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#ffb300]" /> {v.points_cost} pts</span>
                        {v.promo_code && <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">{v.promo_code}</span>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${v.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{v.is_active ? 'Active' : 'Hidden'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => toggleVoucher(v.id, v.is_active)} className="p-2 rounded-xl hover:bg-[rgba(46,125,50,0.1)] text-[#2e7d32] cursor-pointer">
                        {v.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                      </button>
                      <button onClick={() => deleteVoucher(v.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ PARTNER MERCH TAB ═══ */}
      {activeTab === 'partner_merch' && (
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel p-8 sticky top-24">
              <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-[#2e7d32]" /> Add Partner Merch</h2>
              <form onSubmit={handleAddPartnerProduct} className="space-y-4">
                <ImageUploadBox preview={partnerProductImagePreview} inputRef={partnerProductFileRef} label="Product Image" onFile={f => { setPartnerProductImageFile(f); setPartnerProductImagePreview(URL.createObjectURL(f)); }} />
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Link to Event *</label>
                  <select required value={partnerProductForm.event_id} onChange={e => setPartnerProductForm(f => ({ ...f, event_id: e.target.value }))} className="input-glass w-full">
                    <option value="">-- Select Event --</option>
                    {events.map((ev: any) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Partner Name *</label>
                  <input required value={partnerProductForm.partner_name} onChange={e => setPartnerProductForm(f => ({ ...f, partner_name: e.target.value }))} placeholder="e.g. EcoBrand" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Product Name *</label>
                  <input required value={partnerProductForm.name} onChange={e => setPartnerProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Recycled Notebook" className="input-glass" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Description</label>
                  <textarea rows={2} value={partnerProductForm.description} onChange={e => setPartnerProductForm(f => ({ ...f, description: e.target.value }))} className="input-glass resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Price (₹) *</label>
                    <input required type="number" min="0" step="0.01" value={partnerProductForm.price} onChange={e => setPartnerProductForm(f => ({ ...f, price: e.target.value }))} placeholder="9.99" className="input-glass" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Stock</label>
                    <input type="number" min="0" value={partnerProductForm.stock} onChange={e => setPartnerProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" className="input-glass" />
                  </div>
                </div>
                <button type="submit" disabled={addingPartnerProduct} className="btn-primary w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50">
                  {addingPartnerProduct ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Adding...</> : <><Gift className="w-4 h-4" /> Add Partner Product</>}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Gift className="w-5 h-5" /> Partner Products ({partnerProducts.length})</h2>
            {partnerProducts.length === 0 ? <div className="glass-panel p-16 text-center"><Gift className="w-12 h-12 text-[rgba(46,125,50,0.2)] mx-auto mb-3" /><p className="text-[#5f7a60]">No partner products yet.</p></div> : (
              <div className="space-y-4">
                {partnerProducts.map((p: any) => (
                  <div key={p.id} className="glass-card p-4 flex gap-4 items-center">
                    <img src={p.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&q=80'} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <div className="flex gap-2 items-center mb-1">
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">{p.partner_name}</span>
                        <span className="text-xs text-[#5f7a60] truncate">Event: {p.events?.title}</span>
                      </div>
                      <h3 className="font-bold text-[#1a3d1f] truncate">{p.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="font-black text-[#2e7d32]" style={{ fontFamily: 'Outfit,sans-serif' }}>₹{Number(p.price).toFixed(2)}</span>
                        <span className="text-xs text-[#5f7a60] bg-[rgba(46,125,50,0.08)] border border-[rgba(46,125,50,0.15)] px-2 py-0.5 rounded-lg">Stock: {p.stock}</span>
                      </div>
                    </div>
                    <button onClick={() => deletePartnerProduct(p.id)} className="flex-shrink-0 p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SETTINGS TAB ═══ */}
      {activeTab === 'settings' && (
        <div className="max-w-lg">
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold text-[#1a3d1f] mb-2 flex items-center gap-2"><Settings className="w-6 h-6 text-[#2e7d32]" /> Platform Settings</h2>
            <p className="text-[#5f7a60] text-sm mb-8">Configure platform-wide settings that affect all users.</p>
            <div className="space-y-6">
              <div className="glass-card p-6 !rounded-2xl">
                <h3 className="font-bold text-[#1a3d1f] mb-1">Points Redemption Rate</h3>
                <p className="text-xs text-[#5f7a60] mb-4">Set how much 1 reward point is worth in rupees (₹) when used at checkout.</p>
                <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">1 Point = ₹</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={pointToRs}
                    onChange={e => setPointToRs(e.target.value)}
                    className="input-glass max-w-[140px]"
                  />
                  <span className="text-[#5f7a60] text-sm">rupees per point</span>
                </div>
                <p className="text-xs text-[#5f7a60] mt-2 bg-[rgba(46,125,50,0.06)] border border-[rgba(46,125,50,0.12)] px-3 py-2 rounded-lg">
                  Example: If rate = ₹2, then 10 points = ₹20 discount at checkout.
                </p>
              </div>
              <button onClick={saveSettings} disabled={savingSettings} className="btn-primary flex items-center gap-2 !py-3 !px-8 disabled:opacity-50">
                {savingSettings ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : <><CheckCircle2 className="w-4 h-4" /> Save Settings</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
