export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;  // matches Supabase column name
  stock: number;
  max_redeemable_points: number | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  timings: string;
  date: string;
}

export interface Submission {
  id: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}
