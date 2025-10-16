import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import airportsData from '../../data/airports.json';
import flightService from '../../services/flightService';
import styles from './styles/FlightSearchScreen.styles';

const FlightSearchScreen = ({ navigation }) => {
  const [tripType, setTripType] = useState('one-way');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [classType, setClassType] = useState('economy');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDateObj, setReturnDateObj] = useState(new Date(Date.now() + 86400000));

  const handleFromChange = (text) => {
    setFromCity(text);
    if (text.length > 1) {
      const filtered = airportsData.airports.filter(
        (airport) =>
          airport.city.toLowerCase().includes(text.toLowerCase()) ||
          airport.code.toLowerCase().includes(text.toLowerCase()) ||
          airport.country.toLowerCase().includes(text.toLowerCase())
      );
      setFromSuggestions(filtered.slice(0, 5));
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = (text) => {
    setToCity(text);
    if (text.length > 1) {
      const filtered = airportsData.airports.filter(
        (airport) =>
          airport.city.toLowerCase().includes(text.toLowerCase()) ||
          airport.code.toLowerCase().includes(text.toLowerCase()) ||
          airport.country.toLowerCase().includes(text.toLowerCase())
      );
      setToSuggestions(filtered.slice(0, 5));
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  const selectFromAirport = (airport) => {
    setFromCity(`${airport.city} (${airport.code})`);
    setShowFromSuggestions(false);
  };

  const selectToAirport = (airport) => {
    setToCity(`${airport.city} (${airport.code})`);
    setShowToSuggestions(false);
  };

  // Handle date changes
  const handleDepartDateChange = (event, selectedDate) => {
    setShowDepartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDepartureDate(selectedDate);
      setDepartDate(selectedDate.toISOString().split('T')[0]);
      // Ensure return date is after departure
      if (selectedDate >= returnDateObj) {
        const newReturn = new Date(selectedDate.getTime() + 86400000);
        setReturnDateObj(newReturn);
        setReturnDate(newReturn.toISOString().split('T')[0]);
      }
    }
  };

  const handleReturnDateChange = (event, selectedDate) => {
    setShowReturnPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReturnDateObj(selectedDate);
      setReturnDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSearch = async () => {
    // Validation
    if (!fromCity || !toCity || !departDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (fromCity === toCity) {
      Alert.alert('Invalid Route', 'Departure and destination cannot be the same');
      return;
    }

    if (tripType === 'round-trip' && !returnDate) {
      Alert.alert('Missing Return Date', 'Please select a return date for round-trip');
      return;
    }

    // Extract IATA codes
    const fromCode = flightService.extractIataCode(fromCity);
    const toCode = flightService.extractIataCode(toCity);

    setLoading(true);

    try {
      const result = await flightService.searchFlights({
        from: fromCode,
        to: toCode,
        departDate,
        returnDate: tripType === 'round-trip' ? returnDate : '',
        tripType,
        travelers,
      });

      setLoading(false);

      if (result.success && result.flights.length > 0) {
        // Navigate to results screen with flight data
        navigation.navigate('FlightResults', {
          flights: result.flights,
          searchParams: {
            from: fromCity,
            to: toCity,
            departDate,
            returnDate,
            tripType,
            travelers,
          },
        });
      } else if (result.success && result.flights.length === 0) {
        Alert.alert(
          'No Flights Found',
          'No flights available for the selected route and dates. Please try different search criteria.'
        );
      } else {
        Alert.alert(
          'Search Failed',
          result.error || 'Unable to search flights. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Flight search error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(0, 102, 178, 0.85)', 'rgba(30, 136, 229, 0.85)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Find Your Perfect Flight</Text>
          <Text style={styles.heroSubtitle}>
            Search across 500+ airlines worldwide for the best deals
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Search Form */}
      <View style={styles.searchCard}>
        {/* Trip Type Tabs */}
        <View style={styles.tripTypeTabs}>
          <TouchableOpacity
            style={[styles.tab, tripType === 'one-way' && styles.activeTab]}
            onPress={() => setTripType('one-way')}
          >
            <Text style={[styles.tabText, tripType === 'one-way' && styles.activeTabText]}>
              One Way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tripType === 'round-trip' && styles.activeTab]}
            onPress={() => setTripType('round-trip')}
          >
            <Text style={[styles.tabText, tripType === 'round-trip' && styles.activeTabText]}>
              Round Trip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tripType === 'multi-city' && styles.activeTab]}
            onPress={() => setTripType('multi-city')}
          >
            <Text style={[styles.tabText, tripType === 'multi-city' && styles.activeTabText]}>
              Multi City
            </Text>
          </TouchableOpacity>
        </View>

        {/* From Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>From</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Departure city"
              value={fromCity}
              onChangeText={handleFromChange}
              onFocus={() => fromCity.length > 1 && setShowFromSuggestions(true)}
            />
          </View>
          {showFromSuggestions && fromSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              {fromSuggestions.map((airport, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectFromAirport(airport)}
                >
                  <Text style={styles.suggestionCity}>{airport.city}</Text>
                  <Text style={styles.suggestionCode}>
                    {airport.code} - {airport.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* To Field */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>To</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Destination city"
              value={toCity}
              onChangeText={handleToChange}
              onFocus={() => toCity.length > 1 && setShowToSuggestions(true)}
            />
          </View>
          {showToSuggestions && toSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              {toSuggestions.map((airport, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectToAirport(airport)}
                >
                  <Text style={styles.suggestionCity}>{airport.city}</Text>
                  <Text style={styles.suggestionCode}>
                    {airport.code} - {airport.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date Fields */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Departure</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDepartPicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#0066b2" style={styles.icon} />
              <Text style={[styles.input, !departDate && styles.placeholderText]}>
                {departDate || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          {tripType === 'round-trip' && (
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Return</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowReturnPicker(true)}
              >
                <Ionicons name="calendar" size={20} color="#0066b2" style={styles.icon} />
                <Text style={[styles.input, !returnDate && styles.placeholderText]}>
                  {returnDate || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date Pickers */}
        {showDepartPicker && (
          <DateTimePicker
            value={departureDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDepartDateChange}
            minimumDate={new Date()}
          />
        )}
        {showReturnPicker && tripType === 'round-trip' && (
          <DateTimePicker
            value={returnDateObj}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleReturnDateChange}
            minimumDate={departureDate}
          />
        )}

        {/* Travelers and Class */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Travelers</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="people" size={20} color="#0066b2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="1"
                value={String(travelers)}
                onChangeText={(text) => setTravelers(parseInt(text) || 1)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Class</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="briefcase" size={20} color="#0066b2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Economy"
                value={classType}
                onChangeText={setClassType}
              />
            </View>
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.searchButtonText}>Searching...</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>Search Flights</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Popular Routes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        <View style={styles.routesGrid}>
          {[
            { from: 'New Delhi', to: 'Mumbai', price: 89 },
            { from: 'London', to: 'New York', price: 399 },
            { from: 'Dubai', to: 'Singapore', price: 299 },
            { from: 'Paris', to: 'Tokyo', price: 599 },
          ].map((route, index) => (
            <TouchableOpacity key={index} style={styles.routeCard}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeFrom}>{route.from}</Text>
                <Ionicons name="arrow-forward" size={16} color="#666" />
                <Text style={styles.routeTo}>{route.to}</Text>
              </View>
              <Text style={styles.routePrice}>From ${route.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Fares */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Fares</Text>
        <View style={styles.faresTags}>
          {['Student Discount', 'Senior Citizen', 'Armed Forces', 'Medical Staff'].map((fare, index) => (
            <View key={index} style={styles.fareTag}>
              <Text style={styles.fareTagText}>{fare}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Why Book With Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Book With Us</Text>
        <View style={styles.featuresGrid}>
          {[
            { icon: 'shield-checkmark', title: 'Best Price Guarantee', desc: 'Find cheaper? We refund the difference' },
            { icon: 'card', title: 'Easy Payments', desc: 'Multiple payment options available' },
            { icon: 'time', title: '24/7 Support', desc: 'Round the clock customer service' },
            { icon: 'checkmark-circle', title: 'Instant Confirmation', desc: 'Get tickets immediately after booking' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Ionicons name={feature.icon} size={32} color="#0066b2" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FlightSearchScreen;
