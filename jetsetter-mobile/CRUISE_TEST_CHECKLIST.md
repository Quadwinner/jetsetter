# 🚢 Cruise Booking Flow - Test Checklist

## 📱 Quick Test Instructions

### 1. **Launch App**
- [ ] Scan QR code with Expo Go
- [ ] App loads successfully
- [ ] Login screen appears

### 2. **Authentication**
- [ ] Login with email/password works
- [ ] OR Login with Google works
- [ ] Home screen loads after login

### 3. **Navigate to Cruise Search**
- [ ] Tap "Cruises" tab (boat icon) in bottom navigation
- [ ] CruiseSearchScreen loads
- [ ] Search form displays correctly

### 4. **Test Cruise Search**
- [ ] Enter destination: "Caribbean"
- [ ] Select departure port: "Miami"
- [ ] Choose cruise line: "Royal Caribbean"
- [ ] Set passengers: 2
- [ ] Tap "Search Cruises"
- [ ] Loading indicator appears
- [ ] CruiseResultsScreen loads

### 5. **Test Cruise Results**
- [ ] 6 cruises display (mock data)
- [ ] Cruise cards show images, prices, ratings
- [ ] Sort by Price works
- [ ] Sort by Duration works
- [ ] Sort by Rating works
- [ ] Tap on "Caribbean Paradise" cruise
- [ ] CruiseDetailsScreen loads

### 6. **Test Cruise Details**
- [ ] Overview tab shows cruise info
- [ ] Itinerary tab shows day-by-day schedule
- [ ] Reviews tab shows customer reviews
- [ ] "Book Now" button works
- [ ] CruiseBookingScreen loads

### 7. **Test Cruise Booking - Step 1**
- [ ] Contact Information form displays
- [ ] Enter First Name: "John"
- [ ] Enter Last Name: "Doe"
- [ ] Enter Email: "john@example.com"
- [ ] Enter Phone: "+1234567890"
- [ ] Tap "Next"
- [ ] Step 2 loads

### 8. **Test Cruise Booking - Step 2**
- [ ] Passenger Information form displays
- [ ] Enter First Name: "John"
- [ ] Enter Last Name: "Doe"
- [ ] Enter Age: "35"
- [ ] Enter Nationality: "US"
- [ ] Tap "Next"
- [ ] Step 3 loads

### 9. **Test Cruise Booking - Step 3**
- [ ] Payment Information form displays
- [ ] Enter Card Number: "1234567890123456"
- [ ] Enter Cardholder: "John Doe"
- [ ] Enter Expiry: "12/25"
- [ ] Enter CVV: "123"
- [ ] Booking summary shows correct total
- [ ] Tap "Complete Booking"
- [ ] Loading indicator appears
- [ ] CruiseConfirmationScreen loads

### 10. **Test Booking Confirmation**
- [ ] Success message with checkmark displays
- [ ] Booking reference number shows
- [ ] All booking details correct
- [ ] "View My Trips" button works
- [ ] "Book Another" button works
- [ ] "Back to Home" button works

## 🧪 Additional Test Scenarios

### Scenario A: Different Search Filters
- [ ] Search for "Mediterranean" cruises
- [ ] Filter by "Celebrity" cruise line
- [ ] Set duration to "10 Nights"
- [ ] Should find 1 cruise (Mediterranean Explorer)

### Scenario B: Price Range Search
- [ ] Set min price: $1000
- [ ] Set max price: $1500
- [ ] Should find 2 cruises

### Scenario C: Home Screen Integration
- [ ] Go to Home screen
- [ ] Tap "BOOK NOW" on destination cards
- [ ] Tap "BOOK NOW" on cruise line cards
- [ ] Tap "View Special Offers"
- [ ] All should navigate to CruiseSearchScreen

## 🐛 Common Issues to Check

### Navigation Issues
- [ ] No crashes when navigating between screens
- [ ] Back buttons work correctly
- [ ] Tab navigation works smoothly

### Form Validation
- [ ] Required field validation works
- [ ] Email format validation works
- [ ] Phone number validation works
- [ ] Card number validation works

### Data Display
- [ ] Mock cruise data displays correctly
- [ ] Images load properly
- [ ] Prices format correctly
- [ ] Ratings display properly

### Performance
- [ ] Screens load quickly
- [ ] No lag when scrolling
- [ ] Smooth animations

## ✅ Success Criteria

The cruise booking flow is working correctly if:
- [ ] All 10 main test steps pass
- [ ] All 3 additional scenarios pass
- [ ] No crashes or errors occur
- [ ] Navigation is smooth
- [ ] Forms validate correctly
- [ ] Mock data displays properly
- [ ] Booking confirmation works

## 📊 Expected Mock Data

1. **Caribbean Paradise** (Royal Caribbean) - $699, 7 nights
2. **Mediterranean Explorer** (Celebrity) - $1,299, 10 nights  
3. **Alaska Adventure** (Princess) - $899, 7 nights
4. **Northern Europe Discovery** (Holland America) - $1,599, 14 nights
5. **Asia Explorer** (MSC) - $1,199, 12 nights
6. **Transatlantic Crossing** (Cunard) - $1,499, 7 nights

## 🚀 Next Steps

After successful testing:
1. Switch to real API data
2. Implement ARC Pay integration
3. Add to My Trips functionality
4. Implement car rental booking

---

**Note**: This checklist assumes the Expo development server is running and the app is accessible via Expo Go.



