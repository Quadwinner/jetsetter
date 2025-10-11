# 🚀 Jetsetterss Mobile App

A React Native mobile application for the Jetsetterss travel booking platform, built with Expo and TypeScript.

## 📱 Features

- **Authentication**: Firebase Auth with Google OAuth support
- **Flight Booking**: Search and book flights using Amadeus API
- **Hotel Booking**: Find and book hotels worldwide
- **Cruise Booking**: Luxury cruise packages and itineraries
- **Vacation Packages**: All-inclusive travel packages
- **Car Rentals**: Vehicle rental booking
- **My Trips**: Manage all bookings in one place
- **Payment Integration**: ARC Pay gateway integration

## 🛠 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Firebase** for authentication
- **Supabase** for database (shared with web platform)
- **Amadeus API** for flight/hotel data
- **ARC Pay** for payment processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- iOS Simulator (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jetsetter-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual API keys:
   ```env
   SUPABASE_URL=https://qqmagqwumjipdqvxbiqu.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   AMADEUS_API_KEY=your_amadeus_api_key
   AMADEUS_API_SECRET=your_amadeus_api_secret
   ARC_PAY_MERCHANT_ID=your_arc_pay_merchant_id
   ARC_PAY_API_URL=https://api.arcpay.travel/api/rest/version/77/merchant/
   API_BASE_URL=https://your-api-domain.com/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS (macOS only)
   npm run ios
   
   # Web
   npm run web
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── forms/          # Form components
│   └── booking/        # Booking-specific components
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── booking/        # Booking screens
│   ├── home/           # Home screens
│   └── profile/        # Profile screens
├── navigation/         # Navigation configuration
├── services/           # API services and external integrations
│   ├── api/            # API service functions
│   ├── auth/           # Authentication services
│   ├── booking/        # Booking services
│   └── payment/        # Payment services
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── constants/           # App constants and configuration
```

## 🔧 Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Use TypeScript for all new files
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Write unit tests for critical functionality

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `FIREBASE_API_KEY` | Firebase API key | Yes |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `AMADEUS_API_KEY` | Amadeus API key | Yes |
| `AMADEUS_API_SECRET` | Amadeus API secret | Yes |
| `ARC_PAY_MERCHANT_ID` | ARC Pay merchant ID | Yes |
| `ARC_PAY_API_URL` | ARC Pay API URL | Yes |
| `API_BASE_URL` | Backend API base URL | Yes |

## 📱 Platform Support

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Web**: Modern browsers with ES6+ support

## 🚀 Deployment

### Android

1. **Build APK**
   ```bash
   expo build:android
   ```

2. **Upload to Google Play Store**
   - Follow Google Play Console guidelines
   - Ensure all required permissions are declared
   - Test on various Android devices

### iOS

1. **Build for iOS**
   ```bash
   expo build:ios
   ```

2. **Upload to App Store**
   - Follow Apple App Store guidelines
   - Ensure compliance with App Store Review Guidelines
   - Test on various iOS devices

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Analytics

The app integrates with analytics services to track:
- User engagement
- Booking conversions
- App performance
- Error rates

## 🔒 Security

- All API calls use HTTPS
- Sensitive data is encrypted
- Authentication tokens are securely stored
- Payment data follows PCI compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: support@jetsetterss.com
- Phone: (877) 538-7380

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ by the Jetsetterss Development Team**



