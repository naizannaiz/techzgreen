-- 1. Create custom types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END$$;

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Points Ledger
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  points_change INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View to easily get total points per user
CREATE OR REPLACE VIEW user_total_points AS
SELECT user_id, COALESCE(SUM(points_change), 0) as total_points
FROM public.points_ledger
GROUP BY user_id;

-- 4. User Addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  fullname TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  max_redeemable_points INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders & Order Items
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_id UUID REFERENCES public.user_addresses(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending'::order_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL
);

-- 7. Waste Submissions
CREATE TABLE IF NOT EXISTS public.waste_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  status submission_status DEFAULT 'pending'::submission_status,
  points_awarded INTEGER DEFAULT 0,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Storage Buckets (Execute this if UI bucket creation isn't used)
INSERT INTO storage.buckets (id, name, public) VALUES ('waste-images', 'waste-images', true) ON CONFLICT DO NOTHING;

-- Storage Policy allowing anon/authenticated to upload images (In production, restrict to authenticated)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Upload to waste-images') THEN
    CREATE POLICY "Public Upload to waste-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'waste-images');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Select on waste-images') THEN
    CREATE POLICY "Public Select on waste-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'waste-images');
  END IF;
END $$;

-- 9. Row Level Security policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Enable all on profiles') THEN
    CREATE POLICY "Enable all on profiles" ON public.profiles FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='points_ledger' AND policyname='Enable all on points_ledger') THEN
    CREATE POLICY "Enable all on points_ledger" ON public.points_ledger FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_addresses' AND policyname='Enable all on user_addresses') THEN
    CREATE POLICY "Enable all on user_addresses" ON public.user_addresses FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='Enable read for products') THEN
    CREATE POLICY "Enable read for products" ON public.products FOR SELECT USING (true);
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='products' AND policyname='Enable all for products') THEN
    CREATE POLICY "Enable all for products" ON public.products FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='Enable all on orders') THEN
    CREATE POLICY "Enable all on orders" ON public.orders FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='order_items' AND policyname='Enable all on order_items') THEN
    CREATE POLICY "Enable all on order_items" ON public.order_items FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.waste_submissions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='waste_submissions' AND policyname='Enable all on waste_submissions') THEN
    CREATE POLICY "Enable all on waste_submissions" ON public.waste_submissions FOR ALL USING (true);
  END IF;
END $$;

-- =====================================================
-- NEW TABLES: Banners, Events, Registrations, Settings
-- =====================================================

-- Banners (admin-posted promotional banners)
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  poster_url TEXT,
  max_registrations INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  profession TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- App Settings (key-value store for admin-configurable values)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: default 1 point = 1 rupee
INSERT INTO public.app_settings (key, value) VALUES ('point_to_rs', '1') ON CONFLICT DO NOTHING;

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT DO NOTHING;

-- Storage Policies (banners bucket)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Insert banners') THEN
    CREATE POLICY "Public Insert banners" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'banners');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Select banners') THEN
    CREATE POLICY "Public Select banners" ON storage.objects FOR SELECT TO public USING (bucket_id = 'banners');
  END IF;
END $$;

-- Storage Policies (events bucket)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Insert events') THEN
    CREATE POLICY "Public Insert events" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'events');
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public Select events') THEN
    CREATE POLICY "Public Select events" ON storage.objects FOR SELECT TO public USING (bucket_id = 'events');
  END IF;
END $$;

-- RLS for new tables
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='banners' AND policyname='All banners') THEN
    CREATE POLICY "All banners" ON public.banners FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events' AND policyname='All events') THEN
    CREATE POLICY "All events" ON public.events FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='event_registrations' AND policyname='All event_registrations') THEN
    CREATE POLICY "All event_registrations" ON public.event_registrations FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='app_settings' AND policyname='All app_settings') THEN
    CREATE POLICY "All app_settings" ON public.app_settings FOR ALL USING (true);
  END IF;
END $$;

-- =====================================================
-- RAZORPAY & REWARDS SYSTEM UPDATE
-- =====================================================

-- Add Razorpay and Points tracking to Orders
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN razorpay_payment_id TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN razorpay_signature TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN points_used INTEGER DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
DO $$ BEGIN
    ALTER TABLE public.orders ADD COLUMN points_discount_amount DECIMAL(10,2) DEFAULT 0;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  brand_name TEXT NOT NULL,
  promo_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Vouchers (Redeemed vouchers)
CREATE TABLE IF NOT EXISTS public.user_vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  voucher_id UUID REFERENCES public.vouchers(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  is_used BOOLEAN DEFAULT false
);

-- Partner Products (Event Collabs)
CREATE TABLE IF NOT EXISTS public.partner_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow order_items to link to partner_products instead of regular products
DO $$ BEGIN
    ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.order_items ADD COLUMN partner_product_id UUID REFERENCES public.partner_products(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- RLS for new tables
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='vouchers' AND policyname='All vouchers') THEN
    CREATE POLICY "All vouchers" ON public.vouchers FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_vouchers' AND policyname='All user_vouchers') THEN
    CREATE POLICY "All user_vouchers" ON public.user_vouchers FOR ALL USING (true);
  END IF;
END $$;

ALTER TABLE public.partner_products ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partner_products' AND policyname='All partner_products') THEN
    CREATE POLICY "All partner_products" ON public.partner_products FOR ALL USING (true);
  END IF;
END $$;

-- =====================================================
-- PAYMENT HARDENING (additive — does not break current frontend)
-- =====================================================

-- Extend order_status enum (failed)
DO $$ BEGIN
  ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'failed';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Order tracking columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_payment_error TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_rzp_order
  ON public.orders(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;

-- Atomic finalize RPC — called by /verify-payment.
-- Idempotent: only first call flips status + writes ledger row.
CREATE OR REPLACE FUNCTION public.finalize_order_payment(
  p_order_id UUID,
  p_payment_id TEXT,
  p_signature TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID;
  v_pts INT;
  v_status order_status;
BEGIN
  SELECT user_id, points_used, status
    INTO v_user, v_pts, v_status
    FROM orders WHERE id = p_order_id FOR UPDATE;

  IF v_status = 'paid' THEN RETURN; END IF;

  UPDATE orders SET
    status = 'paid',
    razorpay_payment_id = COALESCE(p_payment_id, razorpay_payment_id),
    razorpay_signature  = COALESCE(p_signature,  razorpay_signature)
   WHERE id = p_order_id;

  IF v_pts > 0 THEN
    INSERT INTO points_ledger(user_id, points_change, description)
      VALUES (v_user, -v_pts, 'Order #' || substring(p_order_id::text, 1, 8));
  END IF;
END $$;

