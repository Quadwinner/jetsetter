// Test script for cruise booking flow
// This script tests the cruise service functionality

const cruiseService = require('./src/services/cruiseService.js').default;

console.log('🚢 Testing Cruise Booking Flow...\n');

// Test 1: Search Cruises
console.log('1. Testing Cruise Search...');
const searchParams = {
  destination: 'Caribbean',
  passengers: 2,
  departureDate: '2024-07-15'
};

cruiseService.searchCruises(searchParams)
  .then(result => {
    console.log('✅ Search Results:', result.success ? 'SUCCESS' : 'FAILED');
    if (result.success) {
      console.log(`   Found ${result.cruises.length} cruises`);
      console.log(`   First cruise: ${result.cruises[0].name}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  })
  .catch(error => {
    console.log('❌ Search Error:', error.message);
  });

// Test 2: Get Cruise Details
console.log('\n2. Testing Cruise Details...');
cruiseService.getCruiseDetails('1')
  .then(result => {
    console.log('✅ Details Results:', result.success ? 'SUCCESS' : 'FAILED');
    if (result.success) {
      console.log(`   Cruise: ${result.cruise.name}`);
      console.log(`   Duration: ${result.cruise.duration}`);
      console.log(`   Price: ${result.cruise.price}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  })
  .catch(error => {
    console.log('❌ Details Error:', error.message);
  });

// Test 3: Create Booking
console.log('\n3. Testing Cruise Booking...');
const bookingData = {
  cruise: {
    id: 1,
    name: 'Caribbean Paradise',
    price: 'From $699'
  },
  passengers: {
    adults: [{ firstName: 'John', lastName: 'Doe', age: '35', nationality: 'US' }],
    children: []
  },
  contactInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890'
  },
  paymentInfo: {
    cardNumber: '1234567890123456',
    cardHolder: 'John Doe',
    expiryDate: '12/25',
    cvv: '123'
  }
};

cruiseService.createBooking(bookingData)
  .then(result => {
    console.log('✅ Booking Results:', result.success ? 'SUCCESS' : 'FAILED');
    if (result.success) {
      console.log(`   Booking ID: ${result.bookingId}`);
      console.log(`   Reference: ${result.bookingReference}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  })
  .catch(error => {
    console.log('❌ Booking Error:', error.message);
  });

console.log('\n🎯 Test completed! Check the results above.');



