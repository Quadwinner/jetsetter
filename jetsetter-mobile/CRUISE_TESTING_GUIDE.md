# 🚢 Cruise Booking Flow Testing Guide

## 📱 How to Test the Complete Cruise Booking Flow

### Prerequisites
- Expo Go app installed on your phone
- Development server running (`npm start`)
- QR code displayed in terminal

### Step-by-Step Testing Process

#### 1. **Launch the App**
- Scan the QR code with Expo Go app
- Wait for the app to load
- You should see the login screen

#### 2. **Authentication Test**
- **Test Login**: Use email/password or Google sign-in
- **Test Signup**: Create a new account
- **Expected**: Should navigate to Home screen after successful login

#### 3. **Home Screen Test**
- **Verify**: Home screen loads with cruise-focused content
- **Test**: Tap any "BOOK NOW" button on destination cards
- **Test**: Tap "BOOK NOW" on cruise line cards
- **Test**: Tap "View Special Offers" button
- **Expected**: All should navigate to CruiseSearchScreen

#### 4. **Cruise Search Test**
- **Navigate**: Go to "Cruises" tab (boat icon)
- **Test Search Form**:
  - Enter destination: "Caribbean"
  - Select departure port: "Miami"
  - Choose cruise line: "Royal Caribbean"
  - Select departure date
  - Set passengers: 2
  - Set price range: $500-$1000
- **Test**: Tap "Search Cruises" button
- **Expected**: Should show loading, then navigate to CruiseResultsScreen

#### 5. **Cruise Results Test**
- **Verify**: Results show 6 mock cruises
- **Test Sorting**:
  - Tap "Price" - should sort by price
  - Tap "Duration" - should sort by duration
  - Tap "Rating" - should sort by rating
- **Test**: Tap on any cruise card
- **Expected**: Should navigate to CruiseDetailsScreen

#### 6. **Cruise Details Test**
- **Test Tabs**:
  - Tap "Overview" - shows cruise details, amenities
  - Tap "Itinerary" - shows day-by-day schedule
  - Tap "Reviews" - shows customer reviews
- **Test**: Tap "Book Now" button
- **Expected**: Should navigate to CruiseBookingScreen

#### 7. **Cruise Booking Test**
- **Step 1 - Contact Information**:
  - Enter: First Name: "John"
  - Enter: Last Name: "Doe"
  - Enter: Email: "john@example.com"
  - Enter: Phone: "+1234567890"
  - Tap "Next"
- **Step 2 - Passenger Information**:
  - Enter: First Name: "John"
  - Enter: Last Name: "Doe"
  - Enter: Age: "35"
  - Enter: Nationality: "US"
  - Tap "Next"
- **Step 3 - Payment Information**:
  - Enter: Card Number: "1234567890123456"
  - Enter: Cardholder: "John Doe"
  - Enter: Expiry: "12/25"
  - Enter: CVV: "123"
  - Verify booking summary
  - Tap "Complete Booking"
- **Expected**: Should show loading, then navigate to CruiseConfirmationScreen

#### 8. **Booking Confirmation Test**
- **Verify**: Success message with checkmark
- **Verify**: Booking reference number displayed
- **Verify**: All booking details shown correctly
- **Test Actions**:
  - Tap "View My Trips" - should navigate to MyTripsScreen
  - Tap "Book Another" - should navigate to CruiseSearchScreen
  - Tap "Back to Home" - should navigate to HomeScreen

### 🧪 Test Scenarios

#### Scenario 1: Basic Search
1. Go to Cruises tab
2. Enter "Caribbean" as destination
3. Tap Search
4. **Expected**: 6 cruises found

#### Scenario 2: Filtered Search
1. Go to Cruises tab
2. Enter "Mediterranean" as destination
3. Select "Celebrity" as cruise line
4. Set duration to "10 Nights"
5. Tap Search
6. **Expected**: 1 cruise found (Mediterranean Explorer)

#### Scenario 3: Price Range Search
1. Go to Cruises tab
2. Set min price: $1000
3. Set max price: $1500
4. Tap Search
5. **Expected**: 2 cruises found (Mediterranean Explorer, Northern Europe Discovery)

#### Scenario 4: Complete Booking Flow
1. Search for "Caribbean" cruises
2. Select "Caribbean Paradise" cruise
3. Complete all booking steps
4. **Expected**: Successful booking confirmation

### 🐛 Common Issues & Solutions

#### Issue: App crashes on navigation
- **Solution**: Check console for errors, restart Metro bundler

#### Issue: Search returns no results
- **Solution**: Verify mock data is loaded, check cruiseService.js

#### Issue: Booking form validation fails
- **Solution**: Ensure all required fields are filled

#### Issue: Payment form not accepting input
- **Solution**: Check keyboard type settings in TextInput

### 📊 Expected Results

#### Mock Data Available:
1. **Caribbean Paradise** (Royal Caribbean) - $699, 7 nights
2. **Mediterranean Explorer** (Celebrity) - $1,299, 10 nights
3. **Alaska Adventure** (Princess) - $899, 7 nights
4. **Northern Europe Discovery** (Holland America) - $1,599, 14 nights
5. **Asia Explorer** (MSC) - $1,199, 12 nights
6. **Transatlantic Crossing** (Cunard) - $1,499, 7 nights

#### Navigation Flow:
```
Home → CruiseSearch → CruiseResults → CruiseDetails → CruiseBooking → CruiseConfirmation
```

### ✅ Success Criteria

The cruise booking flow is working correctly if:
- [ ] All screens load without errors
- [ ] Search functionality works with filters
- [ ] Results display correctly with sorting
- [ ] Details screen shows comprehensive information
- [ ] Booking form validates input properly
- [ ] Payment processing completes successfully
- [ ] Confirmation screen shows booking details
- [ ] Navigation works smoothly between screens
- [ ] Mock data displays correctly
- [ ] All buttons and interactions respond properly

### 🚀 Next Steps After Testing

1. **Replace Mock Data**: Switch `USE_MOCK_DATA = false` in cruiseService.js
2. **API Integration**: Connect to real backend endpoints
3. **Payment Integration**: Implement ARC Pay processing
4. **Database Integration**: Save bookings to Supabase
5. **My Trips Integration**: Display cruise bookings in MyTripsScreen

### 📱 Testing on Different Devices

- **Android**: Use Expo Go app
- **iOS**: Use Expo Go app
- **Web**: Run `npm run web` and test in browser
- **Physical Device**: Scan QR code with Expo Go
- **Emulator**: Use Android Studio emulator or iOS Simulator

---

**Note**: This testing guide assumes the app is running with `npm start` and accessible via Expo Go. All functionality uses mock data for testing purposes.



