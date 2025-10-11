// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  FlightSearch: undefined;
  HotelSearch: undefined;
  MyTrips: undefined;
  Profile: undefined;
};

// User Types
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Booking Types
export interface Booking {
  id: string;
  user_id: string;
  booking_reference: string;
  travel_type: 'flight' | 'hotel' | 'cruise' | 'package' | 'car';
  status: 'pending' | 'confirmed' | 'cancelled';
  total_amount: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  booking_details: any;
  passenger_details: any;
  created_at: string;
  updated_at: string;
}

// Flight Types
export interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  price_per_night: number;
  currency: string;
  amenities: string[];
  images: string[];
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Search Types
export interface SearchParams {
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  passengers?: number;
  class?: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet' | 'bank_transfer';
  last_four?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
}
