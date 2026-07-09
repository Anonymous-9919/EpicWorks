export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryAr: string;
  categorySlug: string;
  images: string[];
  specs?: string[];
  tags?: string[];
  featured?: boolean;
  onSale?: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: "pending" | "paid" | "processing" | "completed" | "cancelled";
  customer: CustomerInfo;
  paymentMethod: string;
  trackId?: string;
  createdAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  scheduledDate: string;
  scheduledTime: string;
}

export type PaymentMethod = "knet" | "credit-card" | "apple-pay" | "google-pay";
