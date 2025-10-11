import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

// TEMPORARY: Set to true to use mock data while backend is being fixed
const USE_MOCK_DATA = true;

// Create axios instance for flight API
const flightApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30 seconds for flight searches
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
flightApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class FlightService {
  /**
   * Search for flights
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.from - Origin airport IATA code (e.g., "DEL")
   * @param {string} searchParams.to - Destination airport IATA code (e.g., "HYD")
   * @param {string} searchParams.departDate - Departure date (YYYY-MM-DD)
   * @param {string} searchParams.returnDate - Return date (YYYY-MM-DD) - optional for one-way
   * @param {string} searchParams.tripType - "one-way" or "round-trip"
   * @param {number} searchParams.travelers - Number of travelers
   * @returns {Promise<Object>} Search results with flight offers
   */
  async searchFlights(searchParams) {
    try {
      console.log('Searching flights with params:', searchParams);

      // TEMPORARY: Use mock data if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK flight data (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        return {
          success: true,
          flights: this.getMockFlights(searchParams),
          meta: {
            source: 'mock-data-for-testing',
            resultCount: 3,
          },
        };
      }

      const { data } = await flightApi.post('/flights/search', {
        from: searchParams.from,
        to: searchParams.to,
        departDate: searchParams.departDate,
        returnDate: searchParams.returnDate || '',
        tripType: searchParams.tripType,
        travelers: searchParams.travelers,
      });

      console.log('Flight search response:', data);

      return {
        success: true,
        flights: data.data || [],
        meta: data.meta || {},
      };
    } catch (error) {
      console.error('Flight search error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to search flights',
        details: error.response?.data?.details || null,
      };
    }
  }

  /**
   * Check price for a specific flight offer (optional step before booking)
   * @param {Object} flightOffer - The flight offer to price check
   * @returns {Promise<Object>} Updated pricing information
   */
  async checkPrice(flightOffer) {
    try {
      console.log('Checking price for flight offer');

      const { data } = await flightApi.post('/flights/price', {
        flightOffer,
      });

      return {
        success: true,
        pricedOffer: data.data,
      };
    } catch (error) {
      console.error('Price check error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check price',
      };
    }
  }

  /**
   * Create a flight booking order
   * @param {Object} bookingData - Booking information
   * @param {Array} bookingData.flightOffers - Selected flight offers
   * @param {Array} bookingData.travelers - Traveler information
   * @param {string} bookingData.contactEmail - Contact email
   * @param {string} bookingData.contactPhone - Contact phone
   * @returns {Promise<Object>} Booking confirmation with PNR and order ID
   */
  async createOrder(bookingData) {
    try {
      console.log('Creating flight order');

      // TEMPORARY: Use mock booking if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK booking (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

        return {
          success: true,
          pnr: this.generateMockPNR(),
          orderId: 'MOCK-' + Date.now(),
          orderData: bookingData,
          message: 'Mock booking created successfully (backend not available)',
        };
      }

      const { data } = await flightApi.post('/flights/order', {
        flightOffers: bookingData.flightOffers,
        travelers: bookingData.travelers,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
      });

      console.log('Order created:', data);

      return {
        success: true,
        pnr: data.pnr,
        orderId: data.orderId,
        orderData: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error('Create order error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create booking',
        details: error.response?.data?.details || null,
      };
    }
  }

  /**
   * Save booking to Supabase (for My Trips)
   * @param {Object} bookingInfo - Booking information to store
   * @returns {Promise<Object>} Success/failure result
   */
  async saveBooking(bookingInfo) {
    try {
      console.log('Saving booking to database');

      const { data } = await flightApi.post('/bookings/save', bookingInfo);

      return {
        success: true,
        bookingId: data.bookingId,
      };
    } catch (error) {
      console.error('Save booking error:', error.response?.data || error.message);
      // Non-critical error - booking is created even if save fails
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to save booking',
      };
    }
  }

  /**
   * Extract IATA code from airport string like "New Delhi (DEL)"
   * @param {string} airportString - Airport string with code
   * @returns {string} IATA code
   */
  extractIataCode(airportString) {
    const match = airportString.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : airportString;
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
   * Format duration in minutes to readable format
   * @param {string} duration - ISO 8601 duration (e.g., "PT2H30M")
   * @returns {string} Formatted duration (e.g., "2h 30m")
   */
  formatDuration(duration) {
    if (!duration) return 'N/A';

    // Parse ISO 8601 duration
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return 'N/A';
  }

  /**
   * Format date/time for display
   * @param {string} dateTime - ISO date string
   * @returns {string} Formatted date/time
   */
  formatDateTime(dateTime) {
    if (!dateTime) return 'N/A';

    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * TEMPORARY: Generate mock flight data for testing
   */
  getMockFlights(searchParams) {
    const baseDate = new Date(searchParams.departDate);

    return [
      {
        id: '1',
        price: {
          total: '299.99',
          currency: 'USD',
        },
        itineraries: [
          {
            duration: 'PT2H30M',
            segments: [
              {
                carrierCode: 'AI',
                number: '101',
                departure: {
                  iataCode: searchParams.from,
                  at: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                },
                arrival: {
                  iataCode: searchParams.to,
                  at: new Date(baseDate.getTime() + 10.5 * 60 * 60 * 1000).toISOString(),
                },
              },
            ],
          },
        ],
      },
      {
        id: '2',
        price: {
          total: '249.99',
          currency: 'USD',
        },
        itineraries: [
          {
            duration: 'PT4H15M',
            segments: [
              {
                carrierCode: '6E',
                number: '202',
                departure: {
                  iataCode: searchParams.from,
                  at: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000).toISOString(),
                },
                arrival: {
                  iataCode: 'BOM',
                  at: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(),
                },
              },
              {
                carrierCode: '6E',
                number: '203',
                departure: {
                  iataCode: 'BOM',
                  at: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(),
                },
                arrival: {
                  iataCode: searchParams.to,
                  at: new Date(baseDate.getTime() + 14.25 * 60 * 60 * 1000).toISOString(),
                },
              },
            ],
          },
        ],
      },
      {
        id: '3',
        price: {
          total: '189.99',
          currency: 'USD',
        },
        itineraries: [
          {
            duration: 'PT2H15M',
            segments: [
              {
                carrierCode: 'SG',
                number: '505',
                departure: {
                  iataCode: searchParams.from,
                  at: new Date(baseDate.getTime() + 14 * 60 * 60 * 1000).toISOString(),
                },
                arrival: {
                  iataCode: searchParams.to,
                  at: new Date(baseDate.getTime() + 16.25 * 60 * 60 * 1000).toISOString(),
                },
              },
            ],
          },
        ],
      },
    ];
  }

  /**
   * TEMPORARY: Generate mock PNR for testing
   */
  generateMockPNR() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  }
}

export default new FlightService();
