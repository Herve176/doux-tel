// User Interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for security reasons
  role: 'user' | 'admin'; // Role-based access
  address?: Address; // Optional, linked to the Address interface
}

// Address Interface
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Product Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number; // Quantity available
  rating?: number; // Optional, average rating
  reviews?: Review[]; // Optional, linked to the Review interface
}

// Category Interface
export interface Category {
  id: string;
  name: string;
  description?: string; // Optional
}

// CartItem Interface
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number; // Calculated as price * quantity
}

// Order Interface
export interface Order {
  id: string;
  userId: string;
  items: CartItem[]; // Array of cart items
  totalAmount: number;
  shippingAddress: Address;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date; // Optional, for tracking updates
}

// Payment Interface
export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'success' | 'failed' | 'pending';
  createdAt: Date;
}

// Review Interface
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // Rating out of 5
  comment: string;
  createdAt: Date;
}

// WishlistItem Interface
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  isRead: boolean;
  createdAt: Date;
}

// ShippingOption Interface
export interface ShippingOption {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string; // e.g., "3-5 business days"
}

// AdminReport Interface
export interface AdminReport {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  topSellingProducts: Product[];
  createdAt: Date;
}

// SupportTicket Interface
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt?: Date;
}
