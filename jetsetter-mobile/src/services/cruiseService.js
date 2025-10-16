import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';

// TEMPORARY: Set to true to use mock data while backend is being fixed
const USE_MOCK_DATA = true;

// Create axios instance for cruise API
const cruiseApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000, // 30 seconds for cruise searches
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
cruiseApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class CruiseService {
  /**
   * Search for cruises
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.destination - Destination (optional)
   * @param {string} searchParams.departurePort - Departure port (optional)
   * @param {string} searchParams.cruiseLine - Cruise line (optional)
   * @param {string} searchParams.departureDate - Departure date (optional)
   * @param {string} searchParams.duration - Duration (optional)
   * @param {number} searchParams.passengers - Number of passengers
   * @param {number} searchParams.minPrice - Minimum price (optional)
   * @param {number} searchParams.maxPrice - Maximum price (optional)
   * @returns {Promise<Object>} Search results with cruise offers
   */
  async searchCruises(searchParams) {
    try {
      console.log('Searching cruises with params:', searchParams);

      // TEMPORARY: Use mock data if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK cruise data (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

        return {
          success: true,
          cruises: this.getMockCruises(searchParams),
          meta: {
            source: 'mock-data-for-testing',
            resultCount: 6,
          },
        };
      }

      const { data } = await cruiseApi.get('/cruises/search', {
        params: searchParams,
      });

      console.log('Cruise search response:', data);

      return {
        success: true,
        cruises: data.data || [],
        meta: data.meta || {},
      };
    } catch (error) {
      console.error('Cruise search error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to search cruises',
        details: error.response?.data?.details || null,
      };
    }
  }

  /**
   * Get cruise details by ID
   * @param {string} cruiseId - Cruise ID
   * @returns {Promise<Object>} Cruise details
   */
  async getCruiseDetails(cruiseId) {
    try {
      console.log('Getting cruise details for ID:', cruiseId);

      // TEMPORARY: Use mock data if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK cruise details (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        return {
          success: true,
          cruise: this.getMockCruiseDetails(cruiseId),
        };
      }

      const { data } = await cruiseApi.get(`/cruises/details/${cruiseId}`);

      return {
        success: true,
        cruise: data.data,
      };
    } catch (error) {
      console.error('Get cruise details error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get cruise details',
      };
    }
  }

  /**
   * Create a cruise booking
   * @param {Object} bookingData - Booking information
   * @param {Object} bookingData.cruise - Selected cruise
   * @param {Array} bookingData.passengers - Passenger information
   * @param {Object} bookingData.contactInfo - Contact information
   * @param {Object} bookingData.paymentInfo - Payment information
   * @returns {Promise<Object>} Booking confirmation
   */
  async createBooking(bookingData) {
    try {
      console.log('Creating cruise booking');

      // TEMPORARY: Use mock booking if backend is not ready
      if (USE_MOCK_DATA) {
        console.log('Using MOCK booking (backend has issues)');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

        return {
          success: true,
          bookingId: 'CRUISE-' + Date.now(),
          bookingReference: this.generateMockBookingReference(),
          bookingData,
          message: 'Mock booking created successfully (backend not available)',
        };
      }

      const { data } = await cruiseApi.post('/cruises/booking', bookingData);

      console.log('Booking created:', data);

      return {
        success: true,
        bookingId: data.bookingId,
        bookingReference: data.bookingReference,
        bookingData: data.data,
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
   * Save booking to Supabase (for My Trips)
   * @param {Object} bookingInfo - Booking information to store
   * @returns {Promise<Object>} Success/failure result
   */
  async saveBooking(bookingInfo) {
    try {
      console.log('Saving cruise booking to database');

      const { data } = await cruiseApi.post('/bookings/save', bookingInfo);

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
   * Format duration for display
   * @param {string} duration - Duration string
   * @returns {string} Formatted duration
   */
  formatDuration(duration) {
    if (!duration) return 'N/A';
    return duration; // Already formatted as "7 Nights"
  }

  /**
   * TEMPORARY: Generate mock cruise data for testing
   */
  getMockCruises(searchParams) {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 30); // 30 days from now

    const mockCruises = [
      {
        id: 1,
        name: 'Caribbean Paradise',
        cruiseLine: 'Royal Caribbean',
        ship: 'Symphony of the Seas',
        duration: '7 Nights',
        price: 'From $699',
        priceValue: 699,
        departurePort: 'Miami',
        departureDate: baseDate.toISOString().split('T')[0],
        destinations: ['Caribbean', 'Bahamas', 'Mexico'],
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        rating: 4.7,
        reviews: 3245,
        amenities: ['Waterslides', 'Rock Climbing', 'Broadway Shows', 'Casino'],
        itinerary: [
          {
            day: 1,
            port: 'Miami',
            arrival: 'Departure',
            departure: '4:00 PM',
            activities: ['Board the ship', 'Welcome dinner', 'Sail away party']
          },
          {
            day: 2,
            port: 'Nassau, Bahamas',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Beach day', 'Shopping', 'Local cuisine']
          },
          {
            day: 3,
            port: 'Cozumel, Mexico',
            arrival: '9:00 AM',
            departure: '6:00 PM',
            activities: ['Snorkeling', 'Mayan ruins', 'Shopping']
          },
          {
            day: 4,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Pool activities', 'Spa treatments', 'Entertainment']
          },
          {
            day: 5,
            port: 'Grand Cayman',
            arrival: '8:00 AM',
            departure: '4:00 PM',
            activities: ['Stingray City', 'Seven Mile Beach', 'Shopping']
          },
          {
            day: 6,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Final shows', 'Packing']
          },
          {
            day: 7,
            port: 'Miami',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Customs', 'Transfer to airport']
          }
        ]
      },
      {
        id: 2,
        name: 'Mediterranean Explorer',
        cruiseLine: 'Celebrity',
        ship: 'Celebrity Edge',
        duration: '10 Nights',
        price: 'From $1,299',
        priceValue: 1299,
        departurePort: 'Barcelona',
        departureDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destinations: ['Spain', 'France', 'Italy', 'Greece'],
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73b8e?w=800',
        rating: 4.8,
        reviews: 2156,
        amenities: ['Fine Dining', 'Spa', 'Art Gallery', 'Theater'],
        itinerary: [
          {
            day: 1,
            port: 'Barcelona, Spain',
            arrival: 'Departure',
            departure: '6:00 PM',
            activities: ['Board ship', 'Welcome reception', 'Dinner']
          },
          {
            day: 2,
            port: 'Palma, Spain',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Cathedral visit', 'Beach time', 'Local markets']
          },
          {
            day: 3,
            port: 'Marseille, France',
            arrival: '9:00 AM',
            departure: '6:00 PM',
            activities: ['Old Port', 'Notre-Dame', 'Bouillabaisse tasting']
          },
          {
            day: 4,
            port: 'Livorno, Italy',
            arrival: '8:00 AM',
            departure: '7:00 PM',
            activities: ['Pisa Tower', 'Florence tour', 'Gelato tasting']
          },
          {
            day: 5,
            port: 'Rome, Italy',
            arrival: '7:00 AM',
            departure: '8:00 PM',
            activities: ['Colosseum', 'Vatican', 'Roman Forum']
          },
          {
            day: 6,
            port: 'Naples, Italy',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Pompeii', 'Amalfi Coast', 'Pizza tasting']
          },
          {
            day: 7,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Spa day', 'Entertainment']
          },
          {
            day: 8,
            port: 'Santorini, Greece',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Oia village', 'Wine tasting', 'Sunset views']
          },
          {
            day: 9,
            port: 'Mykonos, Greece',
            arrival: '9:00 AM',
            departure: '5:00 PM',
            activities: ['Windmills', 'Beach clubs', 'Nightlife']
          },
          {
            day: 10,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Final relaxation', 'Packing', 'Farewell dinner']
          },
          {
            day: 11,
            port: 'Barcelona, Spain',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Airport transfer']
          }
        ]
      },
      {
        id: 3,
        name: 'Alaska Adventure',
        cruiseLine: 'Princess',
        ship: 'Royal Princess',
        duration: '7 Nights',
        price: 'From $899',
        priceValue: 899,
        departurePort: 'Seattle',
        departureDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destinations: ['Alaska', 'Glacier Bay', 'Juneau', 'Ketchikan'],
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        rating: 4.6,
        reviews: 1890,
        amenities: ['Naturalist Programs', 'Hot Tubs', 'Fine Dining', 'Entertainment'],
        itinerary: [
          {
            day: 1,
            port: 'Seattle, WA',
            arrival: 'Departure',
            departure: '4:00 PM',
            activities: ['Board ship', 'Welcome dinner', 'Sail away']
          },
          {
            day: 2,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Naturalist talks', 'Wildlife viewing', 'Relaxation']
          },
          {
            day: 3,
            port: 'Juneau, Alaska',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Mendenhall Glacier', 'Whale watching', 'Local shops']
          },
          {
            day: 4,
            port: 'Skagway, Alaska',
            arrival: '7:00 AM',
            departure: '5:00 PM',
            activities: ['White Pass Railway', 'Gold rush history', 'Hiking']
          },
          {
            day: 5,
            port: 'Glacier Bay',
            arrival: '6:00 AM',
            departure: '2:00 PM',
            activities: ['Glacier viewing', 'Wildlife spotting', 'Photography']
          },
          {
            day: 6,
            port: 'Ketchikan, Alaska',
            arrival: '8:00 AM',
            departure: '4:00 PM',
            activities: ['Totem poles', 'Salmon fishing', 'Native culture']
          },
          {
            day: 7,
            port: 'Victoria, BC',
            arrival: '6:00 PM',
            departure: '11:59 PM',
            activities: ['Butchart Gardens', 'Downtown', 'Tea time']
          },
          {
            day: 8,
            port: 'Seattle, WA',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Airport transfer']
          }
        ]
      },
      {
        id: 4,
        name: 'Northern Europe Discovery',
        cruiseLine: 'Holland America',
        ship: 'Nieuw Statendam',
        duration: '14 Nights',
        price: 'From $1,599',
        priceValue: 1599,
        departurePort: 'Amsterdam',
        departureDate: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destinations: ['Netherlands', 'Norway', 'Iceland', 'Scotland'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        rating: 4.9,
        reviews: 1567,
        amenities: ['Classical Music', 'Art Collection', 'Culinary Arts', 'Spa'],
        itinerary: [
          {
            day: 1,
            port: 'Amsterdam, Netherlands',
            arrival: 'Departure',
            departure: '5:00 PM',
            activities: ['Board ship', 'Welcome reception', 'Canal views']
          },
          {
            day: 2,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Entertainment', 'Dining']
          },
          {
            day: 3,
            port: 'Bergen, Norway',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Bryggen', 'Funicular ride', 'Fish market']
          },
          {
            day: 4,
            port: 'Flam, Norway',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Flam Railway', 'Waterfalls', 'Scenic views']
          },
          {
            day: 5,
            port: 'Geiranger, Norway',
            arrival: '7:00 AM',
            departure: '4:00 PM',
            activities: ['Seven Sisters Falls', 'Eagle Road', 'Fjord cruise']
          },
          {
            day: 6,
            port: 'Alesund, Norway',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Art Nouveau', 'Mount Aksla', 'Local culture']
          },
          {
            day: 7,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Spa treatments', 'Entertainment']
          },
          {
            day: 8,
            port: 'Reykjavik, Iceland',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Blue Lagoon', 'Golden Circle', 'Geysers']
          },
          {
            day: 9,
            port: 'Akureyri, Iceland',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Godafoss Falls', 'Local museums', 'Northern lights']
          },
          {
            day: 10,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Wildlife viewing', 'Entertainment']
          },
          {
            day: 11,
            port: 'Kirkwall, Scotland',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['St. Magnus Cathedral', 'Highland Park', 'Local crafts']
          },
          {
            day: 12,
            port: 'Edinburgh, Scotland',
            arrival: '7:00 AM',
            departure: '8:00 PM',
            activities: ['Edinburgh Castle', 'Royal Mile', 'Whisky tasting']
          },
          {
            day: 13,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Final relaxation', 'Packing', 'Farewell events']
          },
          {
            day: 14,
            port: 'Amsterdam, Netherlands',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Airport transfer']
          }
        ]
      },
      {
        id: 5,
        name: 'Asia Explorer',
        cruiseLine: 'MSC',
        ship: 'MSC Bellissima',
        duration: '12 Nights',
        price: 'From $1,199',
        priceValue: 1199,
        departurePort: 'Singapore',
        departureDate: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destinations: ['Singapore', 'Thailand', 'Vietnam', 'Malaysia'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        rating: 4.5,
        reviews: 2341,
        amenities: ['Water Park', 'Broadway Shows', 'Gourmet Dining', 'Spa'],
        itinerary: [
          {
            day: 1,
            port: 'Singapore',
            arrival: 'Departure',
            departure: '6:00 PM',
            activities: ['Board ship', 'Marina Bay views', 'Welcome dinner']
          },
          {
            day: 2,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Ship activities', 'Entertainment', 'Dining']
          },
          {
            day: 3,
            port: 'Kuala Lumpur, Malaysia',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Petronas Towers', 'Batu Caves', 'Local cuisine']
          },
          {
            day: 4,
            port: 'Penang, Malaysia',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['George Town', 'Street art', 'Food tour']
          },
          {
            day: 5,
            port: 'Phuket, Thailand',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['Beach time', 'Temple visits', 'Thai massage']
          },
          {
            day: 6,
            port: 'Bangkok, Thailand',
            arrival: '7:00 AM',
            departure: '8:00 PM',
            activities: ['Grand Palace', 'Wat Pho', 'Floating markets']
          },
          {
            day: 7,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Spa day', 'Entertainment']
          },
          {
            day: 8,
            port: 'Ho Chi Minh City, Vietnam',
            arrival: '8:00 AM',
            departure: '6:00 PM',
            activities: ['War Museum', 'Ben Thanh Market', 'Pho tasting']
          },
          {
            day: 9,
            port: 'Nha Trang, Vietnam',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Beach day', 'Mud baths', 'Local culture']
          },
          {
            day: 10,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Wildlife viewing', 'Entertainment']
          },
          {
            day: 11,
            port: 'Kota Kinabalu, Malaysia',
            arrival: '8:00 AM',
            departure: '5:00 PM',
            activities: ['Mount Kinabalu', 'Wildlife park', 'Local crafts']
          },
          {
            day: 12,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Final relaxation', 'Packing', 'Farewell events']
          },
          {
            day: 13,
            port: 'Singapore',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Airport transfer']
          }
        ]
      },
      {
        id: 6,
        name: 'Transatlantic Crossing',
        cruiseLine: 'Cunard',
        ship: 'Queen Mary 2',
        duration: '7 Nights',
        price: 'From $1,499',
        priceValue: 1499,
        departurePort: 'Southampton',
        departureDate: new Date(baseDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        destinations: ['England', 'Atlantic Ocean', 'New York'],
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        rating: 4.8,
        reviews: 1876,
        amenities: ['Ballroom Dancing', 'Library', 'Planetarium', 'Fine Dining'],
        itinerary: [
          {
            day: 1,
            port: 'Southampton, England',
            arrival: 'Departure',
            departure: '5:00 PM',
            activities: ['Board ship', 'Welcome reception', 'Sail away']
          },
          {
            day: 2,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Ballroom dancing', 'Lectures', 'Entertainment']
          },
          {
            day: 3,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Library time', 'Spa treatments', 'Fine dining']
          },
          {
            day: 4,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Planetarium shows', 'Art classes', 'Tea time']
          },
          {
            day: 5,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Bridge games', 'Wine tasting', 'Entertainment']
          },
          {
            day: 6,
            port: 'At Sea',
            arrival: 'All Day',
            departure: 'All Day',
            activities: ['Relaxation', 'Final shows', 'Packing']
          },
          {
            day: 7,
            port: 'New York, USA',
            arrival: '7:00 AM',
            departure: 'Disembark',
            activities: ['Disembarkation', 'Customs', 'City exploration']
          }
        ]
      }
    ];

    // Filter cruises based on search parameters
    let filteredCruises = mockCruises;

    if (searchParams.destination) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.destinations.some(dest =>
          dest.toLowerCase().includes(searchParams.destination.toLowerCase())
        )
      );
    }

    if (searchParams.departurePort) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.departurePort.toLowerCase().includes(searchParams.departurePort.toLowerCase())
      );
    }

    if (searchParams.cruiseLine) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.cruiseLine.toLowerCase().includes(searchParams.cruiseLine.toLowerCase())
      );
    }

    if (searchParams.duration) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.duration === searchParams.duration
      );
    }

    if (searchParams.minPrice) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.priceValue >= searchParams.minPrice
      );
    }

    if (searchParams.maxPrice) {
      filteredCruises = filteredCruises.filter(cruise =>
        cruise.priceValue <= searchParams.maxPrice
      );
    }

    return filteredCruises.slice(0, 6); // Return max 6 results
  }

  /**
   * TEMPORARY: Generate mock cruise details for testing
   */
  getMockCruiseDetails(cruiseId) {
    const mockCruises = this.getMockCruises({});
    return mockCruises.find(cruise => cruise.id.toString() === cruiseId.toString()) || mockCruises[0];
  }

  /**
   * TEMPORARY: Generate mock booking reference for testing
   */
  generateMockBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 8; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
  }
}

export default new CruiseService();



