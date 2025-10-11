import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import FlightSearchScreen from '../screens/booking/FlightSearchScreen';
import FlightResultsScreen from '../screens/booking/FlightResultsScreen';
import FlightPaymentScreen from '../screens/booking/FlightPaymentScreen';
import FlightConfirmationScreen from '../screens/booking/FlightConfirmationScreen';
import HotelSearchScreen from '../screens/booking/HotelSearchScreen';
import HotelResultsScreen from '../screens/booking/HotelResultsScreen';
import HotelDetailsScreen from '../screens/booking/HotelDetailsScreen';
import HotelPaymentScreen from '../screens/booking/HotelPaymentScreen';
import HotelConfirmationScreen from '../screens/booking/HotelConfirmationScreen';
import PackageListScreen from '../screens/packages/PackageListScreen';
import PackageDetailsScreen from '../screens/packages/PackageDetailsScreen';
import PackageBookingScreen from '../screens/packages/PackageBookingScreen';
import PackageConfirmationScreen from '../screens/packages/PackageConfirmationScreen';
import MyTripsScreen from '../screens/trips/MyTripsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator (Profile removed - now accessible via top-right icon)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#1e40af',
        borderTopColor: '#3b82f6',
      },
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#93c5fd',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="Flights"
      component={FlightSearchScreen}
      options={{
        tabBarLabel: 'Flights',
        tabBarIcon: ({ color }) => <Ionicons name="airplane" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="Hotels"
      component={HotelSearchScreen}
      options={{
        tabBarLabel: 'Hotels',
        tabBarIcon: ({ color }) => <Ionicons name="bed" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="Packages"
      component={PackageListScreen}
      options={{
        tabBarLabel: 'Packages',
        tabBarIcon: ({ color }) => <Ionicons name="gift" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="MyTrips"
      component={MyTripsScreen}
      options={{
        tabBarLabel: 'My Trips',
        tabBarIcon: ({ color }) => <Ionicons name="briefcase" size={24} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Main Stack Navigator (wraps tabs + additional screens)
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
    <Stack.Screen name="FlightPayment" component={FlightPaymentScreen} />
    <Stack.Screen name="FlightConfirmation" component={FlightConfirmationScreen} />
    <Stack.Screen name="HotelResults" component={HotelResultsScreen} />
    <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
    <Stack.Screen name="HotelPayment" component={HotelPaymentScreen} />
    <Stack.Screen name="HotelConfirmation" component={HotelConfirmationScreen} />
    <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
    <Stack.Screen name="PackageBooking" component={PackageBookingScreen} />
    <Stack.Screen name="PackageConfirmation" component={PackageConfirmationScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
