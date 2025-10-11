import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

const USE_MOCK_DATA = true;

const packageApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

packageApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class PackageService {
  async searchPackages(searchParams = {}) {
    try {
      console.log('Searching packages:', searchParams);
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, packages: this.getMockPackages(searchParams), meta: { total: 8 } };
      }
      const { data } = await packageApi.get('/packages/search', { params: searchParams });
      return { success: true, packages: data.data || [], meta: data.meta || {} };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPackageDetails(packageId) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 500));
        const pkg = this.getMockPackages().find(p => p.id === packageId);
        return { success: true, package: { ...pkg, itinerary: this.getMockItinerary() } };
      }
      const { data } = await packageApi.get(`/packages/${packageId}`);
      return { success: true, package: data.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createBooking(bookingData) {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 2000));
        return {
          success: true,
          booking: { bookingReference: this.generateRef(), status: 'CONFIRMED', ...bookingData, createdAt: new Date().toISOString(), paymentStatus: 'PAID' },
        };
      }
      const { data } = await packageApi.post('/packages/booking', bookingData);
      return { success: true, booking: data.booking };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  formatPrice(amount, currency = 'USD') {
    const s = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
    return `${s[currency] || currency}${amount.toFixed(2)}`;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getMockPackages(params = {}) {
    let all = [
      { id: 1, title: "Burj Khalifa Experience", location: "Dubai, UAE", destination: "dubai", image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800", rating: 4.9, reviews: 128, price: 1299, duration: "5 Days", discount: 15, packageType: "All Inclusive", features: ["5-Star Hotel", "Guided Tours"], highlights: ["Burj Khalifa", "Dubai Mall"], included: ["Hotel", "Breakfast", "Transfers"] },
      { id: 2, title: "Desert Safari Adventure", location: "Dubai, UAE", destination: "dubai", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800", rating: 4.7, reviews: 95, price: 899, duration: "4 Days", discount: 10, packageType: "Adventure", features: ["Desert Camp", "Activities"], highlights: ["Safari", "BBQ"], included: ["Camp", "Meals"] },
      { id: 3, title: "European Grand Tour", location: "Paris, Rome, London", destination: "europe", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", rating: 4.8, reviews: 156, price: 2499, duration: "10 Days", discount: 20, packageType: "Cultural", features: ["3-City Tour"], highlights: ["Eiffel Tower", "Colosseum"], included: ["Hotels", "Tours"] },
      { id: 4, title: "Kashmir Paradise", location: "Srinagar, Gulmarg", destination: "kashmir", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800", rating: 4.6, reviews: 82, price: 799, duration: "6 Days", discount: 12, packageType: "Nature", features: ["Houseboat", "Activities"], highlights: ["Dal Lake", "Gondola"], included: ["Houseboat", "Transfers"] },
    ];
    let f = all;
    if (params.destination) f = f.filter(p => p.destination === params.destination);
    return f;
  }

  getMockItinerary() {
    return [
      { day: 1, title: "Arrival", activities: ["Airport pickup", "Check-in", "Welcome dinner"], meals: ["Dinner"], accommodation: "5-Star Hotel" },
      { day: 2, title: "City Tour", activities: ["Sightseeing", "Shopping"], meals: ["Breakfast", "Lunch"], accommodation: "5-Star Hotel" },
      { day: 3, title: "Adventure", activities: ["Main attraction", "Activities"], meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "5-Star Hotel" },
      { day: 4, title: "Leisure", activities: ["Free time", "Spa"], meals: ["Breakfast"], accommodation: "5-Star Hotel" },
      { day: 5, title: "Departure", activities: ["Checkout", "Transfer"], meals: ["Breakfast"], accommodation: null },
    ];
  }

  generateRef() {
    return 'PKG' + Math.random().toString(36).substring(2, 15).toUpperCase();
  }
}

export default new PackageService();
