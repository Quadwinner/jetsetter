import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

// TEMPORARY: Set to true to use mock data while backend is being fixed
const USE_MOCK_DATA = true;

// Create axios instance for hotel API
const hotelApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30 seconds for hotel searches
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
hotelApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class HotelService {
  /**
   * Search for hotels
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.cityCode - City IATA code (e.g., "PAR")
   * @param {string} searchParams.checkInDate - Check-in date (YYYY-MM-DD)
   * @param {string} searchParams.checkOutDate - Check-out date (YYYY-MM-DD)
   * @param {number} searchParams.adults - Number of adults
   * @param {number} searchParams.radius - Search radius (default: 20)
   * @param {string} searchParams.radiusUnit - Radius unit (default: "KM")
   * @returns {Promise<Object>} Search results with hotel offers
   */
  async searchHotels(searchParams) {
    try {
      console.log('Searching hotels with params:', searchParams);

      // TEMPORARY: Use mock data if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK hotel data (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        return {
          success: true,
          hotels: this.getMockHotels(searchParams),
          meta: {
            source: 'mock-data-for-testing',
            resultCount: 4,
          },
        };
      }

      const { data } = await hotelApi.get('/hotels/search', {
        params: {
          cityCode: searchParams.cityCode,
          checkInDate: searchParams.checkInDate,
          checkOutDate: searchParams.checkOutDate,
          adults: searchParams.adults,
          radius: searchParams.radius || 20,
          radiusUnit: searchParams.radiusUnit || 'KM',
        },
      });

      console.log('Hotel search response:', data);

      return {
        success: true,
        hotels: data.data || [],
        meta: data.meta || {},
      };
    } catch (error) {
      console.error('Hotel search error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to search hotels',
        details: error.response?.data?.details || null,
      };
    }
  }

  /**
   * Get popular destinations
   * @returns {Promise<Object>} List of destinations
   */
  async getDestinations() {
    try {
      const { data } = await hotelApi.get('/hotels/destinations');
      return {
        success: true,
        destinations: data.data || [],
      };
    } catch (error) {
      console.error('Get destinations error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create a hotel booking
   * @param {Object} bookingData - Booking information
   * @param {string} bookingData.hotelId - Hotel ID
   * @param {string} bookingData.offerId - Offer ID
   * @param {Object} bookingData.guestDetails - Guest information
   * @param {string} bookingData.checkInDate - Check-in date
   * @param {string} bookingData.checkOutDate - Check-out date
   * @param {number} bookingData.totalPrice - Total price
   * @param {string} bookingData.currency - Currency code
   * @returns {Promise<Object>} Booking confirmation
   */
  async createBooking(bookingData) {
    try {
      console.log('Creating hotel booking');

      // TEMPORARY: Use mock booking if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK booking (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

        return {
          success: true,
          booking: {
            bookingReference: this.generateMockBookingReference(),
            status: 'CONFIRMED',
            ...bookingData,
            createdAt: new Date().toISOString(),
            paymentStatus: 'PAID',
          },
          message: 'Mock hotel booking created successfully (backend not available)',
        };
      }

      const { data } = await hotelApi.post('/hotels/booking', bookingData);

      console.log('Booking created:', data);

      return {
        success: true,
        booking: data.booking,
        message: data.message,
      };
    } catch (error) {
      console.error('Create booking error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create booking',
        details: error.response?.data?.details || null,
      };
    }
  }

  /**
   * Process hotel payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment confirmation
   */
  async processPayment(paymentData) {
    try {
      console.log('Processing hotel payment');

      // TEMPORARY: Use mock payment if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK payment (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        return {
          success: true,
          payment: {
            transactionId: 'TXN' + Date.now(),
            status: 'APPROVED',
            amount: paymentData.amount,
            currency: paymentData.currency,
            processedAt: new Date().toISOString(),
          },
          message: 'Mock payment processed successfully',
        };
      }

      const { data } = await hotelApi.post('/hotels/payment', paymentData);

      return {
        success: true,
        payment: data.payment,
        message: data.message,
      };
    } catch (error) {
      console.error('Payment error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Payment failed',
      };
    }
  }

  /**
   * Extract city code from destination string
   * @param {string} destination - Destination string
   * @returns {string} City code
   */
  extractCityCode(destination) {
    // Try to extract code from format like "Paris (PAR)"
    const match = destination.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : destination;
  }

  /**
   * Format price with currency
   * @param {number} amount - Price amount
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} Formatted price
   */
  formatPrice(amount, currency = 'USD') {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }

  /**
   * Calculate number of nights
   * @param {string} checkIn - Check-in date
   * @param {string} checkOut - Check-out date
   * @returns {number} Number of nights
   */
  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Format date for display
   * @param {string} date - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(date) {
    if (!date) return 'N/A';

    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * TEMPORARY: Generate mock hotel data for testing
   */
  getMockHotels(searchParams) {
    return [
      {
        hotelId: 'HTL001',
        name: 'Grand Plaza Hotel',
        rating: 4.5,
        address: '123 Main Street, ' + searchParams.cityCode,
        amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa'],
        offers: [
          {
            offerId: 'OFFER001',
            roomType: 'Deluxe Room',
            price: 199.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 24h before check-in',
          },
          {
            offerId: 'OFFER002',
            roomType: 'Executive Suite',
            price: 299.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 48h before check-in',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        ],
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      },
      {
        hotelId: 'HTL002',
        name: 'Luxury Boutique Inn',
        rating: 4.8,
        address: '456 Park Avenue, ' + searchParams.cityCode,
        amenities: ['wifi', 'breakfast', 'parking', 'bar'],
        offers: [
          {
            offerId: 'OFFER003',
            roomType: 'Standard Room',
            price: 149.99,
            currency: 'USD',
            cancellationPolicy: 'Non-refundable',
          },
          {
            offerId: 'OFFER004',
            roomType: 'Premium Room',
            price: 229.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 24h before check-in',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        ],
        location: {
          latitude: 40.7580,
          longitude: -73.9855,
        },
      },
      {
        hotelId: 'HTL003',
        name: 'Oceanview Resort',
        rating: 4.3,
        address: '789 Beach Boulevard, ' + searchParams.cityCode,
        amenities: ['wifi', 'pool', 'beach_access', 'restaurant'],
        offers: [
          {
            offerId: 'OFFER005',
            roomType: 'Ocean View Room',
            price: 179.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 72h before check-in',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        ],
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
        },
      },
      {
        hotelId: 'HTL004',
        name: 'City Center Suites',
        rating: 4.6,
        address: '321 Downtown Street, ' + searchParams.cityCode,
        amenities: ['wifi', 'gym', 'breakfast', 'concierge'],
        offers: [
          {
            offerId: 'OFFER006',
            roomType: 'Studio Suite',
            price: 129.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 24h before check-in',
          },
          {
            offerId: 'OFFER007',
            roomType: 'One Bedroom Suite',
            price: 189.99,
            currency: 'USD',
            cancellationPolicy: 'Free cancellation until 48h before check-in',
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800',
        ],
        location: {
          latitude: 40.7306,
          longitude: -73.9352,
        },
      },
    ];
  }

  /**
   * TEMPORARY: Generate mock booking reference for testing
   */
  generateMockBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = 'HTL';
    for (let i = 0; i < 13; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ref;
  }
}

export default new HotelService();
