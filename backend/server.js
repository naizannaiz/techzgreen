import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret_here',
});

// Service-role Supabase client (bypasses RLS — only used here on backend).
// If SUPABASE_SERVICE_ROLE_KEY missing, server-side validation is skipped (legacy mode).
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.get('/healthz', (_req, res) => res.json({ ok: true, supabase: !!supabase }));

// ─── Create Razorpay order ───
// Body: { amount, currency?, receipt, items?: [{product_id, quantity, isPartner?}], order_id?: <db uuid> }
// If `items` + Supabase configured: re-validate cart total server-side. Frontend amount becomes a hint only.
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, items, order_id } = req.body;

    let trustedAmount = Number(amount);

    if (supabase && Array.isArray(items) && items.length > 0) {
      const t = await calculateTrustedTotal(items, order_id);
      if (t == null) return res.status(400).json({ error: 'Invalid cart — product not found or out of stock' });
      trustedAmount = t;
    }

    if (!Number.isFinite(trustedAmount) || trustedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(trustedAmount * 100),
      currency,
      receipt,
      notes: order_id ? { order_id } : undefined,
    });

    if (!order) return res.status(500).json({ error: 'Failed to create order' });

    if (supabase && order_id) {
      const attempts = await getAttempts(order_id);
      await supabase.from('orders').update({
        razorpay_order_id: order.id,
        payment_attempts: attempts + 1,
      }).eq('id', order_id);
    }

    res.json({ ...order, trusted_amount: trustedAmount });
  } catch (error) {
    console.error('create-order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ─── Verify Razorpay signature on success ───
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature !== expected) {
      console.warn('verify-payment: signature mismatch', { razorpay_order_id });
      return res.status(400).json({ message: 'Invalid signature', verified: false });
    }

    // Atomic finalize — idempotent (safe if webhook also fires).
    if (supabase && order_id) {
      const { error } = await supabase.rpc('finalize_order_payment', {
        p_order_id: order_id,
        p_payment_id: razorpay_payment_id,
        p_signature: razorpay_signature,
      });
      if (error) console.error('finalize_order_payment:', error);
    }

    res.json({ message: 'Payment verified', verified: true });
  } catch (error) {
    console.error('verify-payment:', error);
    res.status(500).json({ error: error.message, verified: false });
  }
});

// ─── Helpers ───
async function calculateTrustedTotal(items, orderId) {
  let total = 0;
  for (const it of items) {
    const table = it.isPartner ? 'partner_products' : 'products';
    const { data, error } = await supabase.from(table)
      .select('price, stock').eq('id', it.product_id).single();
    if (error || !data) return null;
    if (data.stock != null && data.stock < it.quantity) return null;
    total += Number(data.price) * Number(it.quantity);
  }
  // Subtract any G-coin discount already saved on the DB order row (set by frontend).
  if (orderId) {
    const { data: row } = await supabase.from('orders')
      .select('points_discount_amount').eq('id', orderId).single();
    if (row?.points_discount_amount) total -= Number(row.points_discount_amount);
  }
  return Math.max(0, total);
}

async function getAttempts(orderId) {
  const { data } = await supabase.from('orders')
    .select('payment_attempts').eq('id', orderId).single();
  return data?.payment_attempts || 0;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Razorpay backend on :${PORT} (supabase=${!!supabase})`);
});
