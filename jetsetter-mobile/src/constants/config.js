// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://prod-six-phi.vercel.app/api',
  TIMEOUT: 10000,
};

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: 'https://qqmagqwumjipdqvxbiqu.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbWFncXd1bWppcGRxdnhiaXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMDEwMTIsImV4cCI6MjA2MDU3NzAxMn0.Ho8DYLWpX_vQ6syrI2zkU3G5pnNTdnYpgtpyjjGYlDA',
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  API_KEY: 'AIzaSyDQRZgBAkv6rfSqtJUQk6jLY56ftz0eEMg',
  AUTH_DOMAIN: 'jets-1b5fa.firebaseapp.com',
  PROJECT_ID: 'jets-1b5fa',
};

// Amadeus API Configuration
export const AMADEUS_CONFIG = {
  API_KEY: 'HSdhpX2AHnyj7LnL1TjDFL8MHj8lGz5G',
  API_SECRET: 'bXf2ed12C4ruJ1Nt',
  BASE_URL: 'https://api.amadeus.com',
};

// ARC Pay Configuration
export const ARC_PAY_CONFIG = {
  MERCHANT_ID: 'TESTARC05511704',
  API_URL: 'https://api.arcpay.travel/api/rest/version/100/merchant/TESTARC05511704',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Jetsetters',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.APP_ENV || 'development',
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#1e40af',
  PRIMARY_LIGHT: '#3b82f6',
  SECONDARY: '#f59e0b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  LIGHT: '#f8fafc',
  DARK: '#1e293b',
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: '#6b7280',
  LIGHT_GRAY: '#e5e7eb',
};

// Screen Dimensions
export const SCREEN_CONFIG = {
  PADDING: 16,
  MARGIN: 8,
  BORDER_RADIUS: 8,
  SHADOW: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
