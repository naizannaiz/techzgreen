import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Razorpay
// The keys will be loaded from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret_here',
});

// Create Order Endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment Signature Endpoint
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Create the expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      return res.status(200).json({ message: "Payment verified successfully", verified: true });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!", verified: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message, verified: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Razorpay Backend Server running on port ${PORT}`);
});
