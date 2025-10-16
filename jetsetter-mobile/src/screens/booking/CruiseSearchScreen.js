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
import { Picker } from '@react-native-picker/picker';
import cruiseService from '../../services/cruiseService';
import styles from './styles/CruiseSearchScreen.styles';

// Define arrays outside component to prevent re-renders
const POPULAR_DESTINATIONS = [
  'Caribbean', 'Mediterranean', 'Alaska', 'Northern Europe',
  'Asia', 'South America', 'Australia', 'Hawaii'
];

const DEPARTURE_PORTS = [
  'Miami', 'Fort Lauderdale', 'Port Canaveral', 'Tampa',
  'Galveston', 'Los Angeles', 'San Francisco', 'Seattle'
];

const CRUISE_LINES = [
  'Royal Caribbean', 'Carnival', 'Norwegian', 'Princess',
  'Celebrity', 'Holland America', 'MSC', 'Disney'
];

const DURATION_OPTIONS = [
  '3 Nights', '4 Nights', '5 Nights', '6 Nights',
  '7 Nights', '8 Nights', '9 Nights', '10 Nights',
  '11 Nights', '12 Nights', '14 Nights', '15+ Nights'
];

const CruiseSearchScreen = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [departurePort, setDeparturePort] = useState('');
  const [cruiseLine, setCruiseLine] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [duration, setDuration] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  // Handle date changes
  const handleDateChange = (event, date) => {
    console.log('📅 Date picker event:', event.type, 'Date:', date);
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      console.log('✅ Date selected:', date.toISOString().split('T')[0]);
      setSelectedDate(date);
      setDepartureDate(date.toISOString().split('T')[0]);
    } else {
      console.log('❌ Date selection cancelled');
    }
  };

  const handleSearch = async () => {
    console.log('🔍 Starting cruise search...');
    console.log('Current state:', { destination, departurePort, cruiseLine, departureDate, duration, passengers, minPrice, maxPrice });

    // Validation - Allow search with any criteria or no criteria (show all)
    setLoading(true);

    try {
      const searchParams = {
        destination: destination || undefined,
        departurePort: departurePort || undefined,
        cruiseLine: cruiseLine || undefined,
        departureDate: departureDate || undefined,
        duration: duration || undefined,
        passengers,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      };

      console.log('🚢 Searching with params:', searchParams);
      const result = await cruiseService.searchCruises(searchParams);
      console.log('📊 Search result:', result);

      setLoading(false);

      if (result.success && result.cruises.length > 0) {
        console.log('✅ Found cruises, navigating to results...');
        // Navigate to results screen with cruise data
        navigation.navigate('CruiseResults', {
          cruises: result.cruises,
          searchParams,
        });
      } else if (result.success && result.cruises.length === 0) {
        console.log('❌ No cruises found');
        Alert.alert(
          'No Cruises Found',
          'No cruises available for the selected criteria. Please try different search parameters.'
        );
      } else {
        console.log('❌ Search failed:', result.error);
        Alert.alert(
          'Search Failed',
          result.error || 'Unable to search cruises. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('💥 Cruise search error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const selectPopularDestination = (dest) => {
    setDestination(dest);
  };

  const selectDeparturePort = (port) => {
    setDeparturePort(port);
  };

  const selectCruiseLine = (line) => {
    setCruiseLine(line);
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled={true}
      removeClippedSubviews={false}
      keyboardDismissMode="none"
    >
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(0, 102, 178, 0.85)', 'rgba(30, 136, 229, 0.85)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Find Your Perfect</Text>
          <Text style={styles.heroTitleHighlight}>Cruise Adventure</Text>
          <Text style={styles.heroSubtitle}>
            Explore breathtaking destinations with luxury cruise experiences
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Search Form */}
      <View style={styles.searchCard}>
        {/* Destination */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Destination</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Where would you like to go?"
              value={destination}
              onChangeText={setDestination}
            />
          </View>

          {/* Popular Destinations */}
          <View style={styles.popularContainer}>
            <Text style={styles.popularLabel}>Popular Destinations:</Text>
            <View style={styles.popularTags}>
              {POPULAR_DESTINATIONS.slice(0, 4).map((dest, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularTag}
                  onPress={() => selectPopularDestination(dest)}
                >
                  <Text style={styles.popularTagText}>{dest}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Departure Port */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Departure Port</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="boat" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Miami, Fort Lauderdale, etc."
              value={departurePort}
              onChangeText={setDeparturePort}
            />
          </View>

          {/* Popular Ports */}
          <View style={styles.popularContainer}>
            <Text style={styles.popularLabel}>Popular Ports:</Text>
            <View style={styles.popularTags}>
              {DEPARTURE_PORTS.slice(0, 4).map((port, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularTag}
                  onPress={() => selectDeparturePort(port)}
                >
                  <Text style={styles.popularTagText}>{port}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Cruise Line */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Cruise Line</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Royal Caribbean, Carnival, etc."
              value={cruiseLine}
              onChangeText={setCruiseLine}
            />
          </View>

          {/* Popular Cruise Lines */}
          <View style={styles.popularContainer}>
            <Text style={styles.popularLabel}>Popular Lines:</Text>
            <View style={styles.popularTags}>
              {CRUISE_LINES.slice(0, 4).map((line, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popularTag}
                  onPress={() => selectCruiseLine(line)}
                >
                  <Text style={styles.popularTagText}>{line}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Date and Duration Row */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Departure Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                console.log('📅 Opening date picker...');
                setShowDatePicker(true);
              }}
            >
              <Ionicons name="calendar" size={20} color="#0066b2" style={styles.icon} />
              <Text style={[styles.input, !departureDate && styles.placeholderText]}>
                {departureDate || 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time" size={20} color="#0066b2" style={styles.icon} />
              <Picker
                selectedValue={duration}
                onValueChange={setDuration}
                style={styles.picker}
              >
                <Picker.Item label="Any Duration" value="" />
                {DURATION_OPTIONS.map((dur, index) => (
                  <Picker.Item key={index} label={dur} value={dur} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Passengers and Price Range */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Passengers</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="people" size={20} color="#0066b2" style={styles.icon} />
              <Picker
                selectedValue={passengers}
                onValueChange={setPassengers}
                style={styles.picker}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <Picker.Item key={num} label={`${num} Passenger${num > 1 ? 's' : ''}`} value={num} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Price Range</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="Min"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="Max"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Date Picker */}
        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        
        {/* Web Date Picker Fallback */}
        {showDatePicker && Platform.OS === 'web' && (
          <View style={styles.webDatePicker}>
            <Text style={styles.webDatePickerTitle}>Select Departure Date</Text>
            <input
              type="date"
              value={departureDate || ''}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                console.log('📅 Web date selected:', e.target.value);
                setDepartureDate(e.target.value);
                setSelectedDate(new Date(e.target.value));
                setShowDatePicker(false);
              }}
              onBlur={(e) => {
                // Prevent focus loss
                setTimeout(() => {
                  if (showDatePicker) {
                    e.target?.focus();
                  }
                }, 0);
              }}
              className="web-date-input"
              style={{
                width: '100%',
                padding: 12,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                fontSize: 16,
                marginBottom: 15,
              }}
            />
            <TouchableOpacity
              style={styles.webDatePickerButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.webDatePickerButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Button */}
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={() => {
            console.log('🔘 Search button pressed!');
            handleSearch();
          }}
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
              <Text style={styles.searchButtonText}>Search Cruises</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Cruise Booking</Text>
        <View style={styles.featuresGrid}>
          {[
            { icon: 'shield-checkmark', title: 'Best Price Guarantee', desc: 'Find cheaper? We refund the difference' },
            { icon: 'card', title: 'Easy Payments', desc: 'Multiple payment options available' },
            { icon: 'time', title: '24/7 Support', desc: 'Round the clock customer service' },
            { icon: 'checkmark-circle', title: 'Instant Confirmation', desc: 'Get booking confirmation immediately' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Ionicons name={feature.icon} size={32} color="#0066b2" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cruise Lines Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Cruise Lines</Text>
        <View style={styles.cruiseLinesGrid}>
          {CRUISE_LINES.map((line, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.cruiseLineCard}
              onPress={() => selectCruiseLine(line)}
            >
              <Text style={styles.cruiseLineName}>{line}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default CruiseSearchScreen;
