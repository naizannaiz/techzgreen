// Mock Database for TechzGreen
import type { User, Product, Submission, Event } from '../types';

export let mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'user@test.com', role: 'user', points: 150 },
  { id: '2', name: 'Techz Admin', email: 'admin@techzgreen.com', role: 'admin', points: 0 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Recycled Plastic Planter Box', description: 'A durable and colorful planter box made entirely from upcycled plastic waste with eco-friendly rope handles. Perfect for indoor or patio plants.', price: 10, image_url: '/planter.jpg', stock: 10, max_redeemable_points: null },
  { id: '2', name: 'Eco-Friendly Reusable Bag', description: 'A durable bag made from 100% recycled plastic.', price: 5, image_url: 'https://images.unsplash.com/photo-1597349666014-41d92790d984?auto=format&fit=crop&q=80&w=400', stock: 10, max_redeemable_points: null },
  { id: '3', name: 'Bamboo Toothbrush Set', description: 'Sustainable bamboo toothbrushes, a perfect alternative to plastic.', price: 2, image_url: 'https://images.unsplash.com/photo-1605600659929-e85df649f87c?auto=format&fit=crop&q=80&w=400', stock: 10, max_redeemable_points: null },
  { id: '4', name: 'Recycled Glass Water Bottle', description: 'Stay hydrated with a premium recycled glass bottle.', price: 15, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400', stock: 10, max_redeemable_points: null }
];

export function getMockProducts(): Product[] {
  const cached = localStorage.getItem('techzProducts');
  if (cached) return JSON.parse(cached);
  localStorage.setItem('techzProducts', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function addMockProduct(product: Product) {
  const products = getMockProducts();
  products.unshift(product);
  localStorage.setItem('techzProducts', JSON.stringify(products));
}

export let mockEvents: Event[] = [
  {
    id: '1',
    title: 'Community Beach Cleanup',
    description: 'Join us this weekend for a massive beach cleanup drive. Let us clear the plastic waste and save marine life.',
    posterUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80f4f9f?auto=format&fit=crop&q=80&w=800',
    timings: 'Saturday, 10:00 AM - 2:00 PM',
    date: '2026-04-10'
  }
];

export let mockSubmissions: Submission[] = [
  { id: '1', userId: '1', imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800', status: 'pending', submittedAt: '2026-04-01T10:00:00Z', notes: 'Recycled 5 plastic bottles today!' },
  { id: '2', userId: '1', imageUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&q=80&w=800', status: 'approved', submittedAt: '2026-03-25T15:30:00Z', notes: 'Cardboard disposal at local facility.' }
];

// Helper to simulate DB delay
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
