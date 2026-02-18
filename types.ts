
// Add missing types for Role and Payment
export type PaymentMethod = 'card' | 'cash' | 'pix';
export type UserRole = 'customer' | 'seller' | null;

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available?: boolean;
}

export interface PaymentConfig {
  pixKey: string;
  whatsappPix: string;
  acceptsCard: boolean;
  acceptsCash: boolean;
  acceptsPix: boolean;
  // Added to support Mercado Pago integration
  mercadoPagoToken?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  category: string;
  distance: string;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  menu: FoodItem[];
  isOpen?: boolean;
  address?: string;
  paymentConfig?: PaymentConfig;
  ownerEmail?: string;
  adminPin?: string;
  // Added to match registration form data
  ownerName?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  pin: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  date: string;
  // Added to track exact order time
  timestamp?: number;
  restaurantName: string;
  total: number;
  items: CartItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'rejected';
  paymentMethod: string;
  // Added to support additional payment info (like change or Pix status)
  paymentDetails?: string;
  customerInfo: CustomerInfo;
}

export type View = 'home' | 'search' | 'orders' | 'profile' | 'restaurant' | 'register' | 'seller-dashboard' | 'admin';
