import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import hotelsData from '../../data/hotels.json';
import hotelService from '../../services/hotelService';
import styles from './styles/HotelSearchScreen.styles';

const HotelSearchScreen = ({ navigation }) => {
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [loading, setLoading] = useState(false);
  const destinationRef = useRef(null);

  // Handle destination input change
  const handleDestinationChange = (text) => {
    setSearchDestination(text);
    setSelectedCityCode('');

    if (text.trim()) {
      setShowDestinationSuggestions(true);
      const filtered = hotelsData.destinations.filter(dest =>
        dest.name.toLowerCase().includes(text.toLowerCase()) ||
        dest.country.toLowerCase().includes(text.toLowerCase()) ||
        dest.code.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  // Handle destination suggestion click
  const handleSuggestionClick = (destination) => {
    setSearchDestination(destination.name);
    setSelectedCityCode(destination.code);
    setShowDestinationSuggestions(false);
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!searchDestination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    if (!searchCheckIn || !searchCheckOut) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return;
    }

    if (!selectedCityCode) {
      Alert.alert('Error', 'Please select a destination from the suggestions');
      return;
    }

    setLoading(true);

    try {
      const result = await hotelService.searchHotels({
        cityCode: selectedCityCode,
        checkInDate: searchCheckIn,
        checkOutDate: searchCheckOut,
        adults: searchGuests,
      });

      setLoading(false);

      if (result.success && result.hotels.length > 0) {
        navigation.navigate('HotelResults', {
          hotels: result.hotels,
          searchParams: {
            destination: searchDestination,
            cityCode: selectedCityCode,
            checkInDate: searchCheckIn,
            checkOutDate: searchCheckOut,
            adults: searchGuests,
          },
        });
      } else if (result.success && result.hotels.length === 0) {
        Alert.alert(
          'No Hotels Found',
          'No hotels available for the selected destination and dates. Please try different criteria.'
        );
      } else {
        Alert.alert(
          'Search Failed',
          result.error || 'Unable to search hotels. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Hotel search error:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200' }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(0, 102, 178, 0.85)', 'rgba(30, 136, 229, 0.85)']}
          style={styles.heroOverlay}
        >
          <Text style={styles.heroTitle}>Find Your Perfect Hotel Stay</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing hotels worldwide with the best prices
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Search Card */}
      <View style={styles.searchCard}>
        {/* Destination Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Destination</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              ref={destinationRef}
              style={styles.input}
              placeholder="Where are you going?"
              value={searchDestination}
              onChangeText={handleDestinationChange}
            />
          </View>
          {showDestinationSuggestions && filteredSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              {filteredSuggestions.map((dest, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionClick(dest)}
                >
                  <Text style={styles.suggestionCity}>{dest.name}</Text>
                  <Text style={styles.suggestionCode}>{dest.code} - {dest.country}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date Fields */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Check-in</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar" size={20} color="#0066b2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Select date"
                value={searchCheckIn}
                onChangeText={setSearchCheckIn}
              />
            </View>
          </View>

          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Check-out</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar" size={20} color="#0066b2" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Select date"
                value={searchCheckOut}
                onChangeText={setSearchCheckOut}
              />
            </View>
          </View>
        </View>

        {/* Guests */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Guests</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="people" size={20} color="#0066b2" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Number of guests"
              value={String(searchGuests)}
              onChangeText={(text) => setSearchGuests(parseInt(text) || 1)}
              keyboardType="numeric"
            />
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
              <Text style={styles.searchButtonText}>Search Hotels</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        <View style={styles.destinationsGrid}>
          {hotelsData.destinations.slice(0, 8).map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationCard}
              onPress={() => {
                setSearchDestination(destination.name);
                setSelectedCityCode(destination.code);
              }}
            >
              <Image
                source={{ uri: destination.image }}
                style={styles.destinationImage}
              />
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#ffc107" />
                <Text style={styles.ratingText}>{destination.rating}</Text>
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationCountry}>{destination.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Hotels</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Ionicons name="trophy" size={32} color="#0066b2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Best Price Guarantee</Text>
            <Text style={styles.featureDesc}>Find the best deals with our price match guarantee</Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="shield-checkmark" size={32} color="#0066b2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Verified Reviews</Text>
            <Text style={styles.featureDesc}>Read authentic reviews from real guests</Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="time" size={32} color="#0066b2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>Free Cancellation</Text>
            <Text style={styles.featureDesc}>Flexible booking policies for peace of mind</Text>
          </View>
          <View style={styles.featureCard}>
            <Ionicons name="headset" size={32} color="#0066b2" style={styles.featureIcon} />
            <Text style={styles.featureTitle}>24/7 Support</Text>
            <Text style={styles.featureDesc}>Round the clock customer service</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HotelSearchScreen;
