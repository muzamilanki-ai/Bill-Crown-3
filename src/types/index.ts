export type Plan = 'free' | 'pro' | 'premium';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Bill {
  id: string;
  shopName: string;
  customerName: string;
  products: Product[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  date: string;
}

export interface CustomWatermark {
  name: string;
  address: string;
  phone: string;
}

export interface AppState {
  plan: Plan;
  activationKey: string;
  bills: Bill[];
  themeColor: string;
  language: 'en' | 'ur';
  customWatermark: CustomWatermark;
}
