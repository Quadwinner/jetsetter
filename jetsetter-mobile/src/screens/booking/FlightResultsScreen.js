import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import flightService from '../../services/flightService';
import styles from './styles/FlightResultsScreen.styles';

const FlightResultsScreen = ({ route, navigation }) => {
  const { flights, searchParams } = route.params;
  const [sortBy, setSortBy] = useState('price'); // price, duration, departure

  // Sort flights based on selected criteria
  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = parseFloat(a.price?.total || 0);
      const priceB = parseFloat(b.price?.total || 0);
      return priceA - priceB;
    } else if (sortBy === 'duration') {
      const durationA = a.itineraries?.[0]?.duration || 'PT0H';
      const durationB = b.itineraries?.[0]?.duration || 'PT0H';
      return durationA.localeCompare(durationB);
    } else if (sortBy === 'departure') {
      const timeA = a.itineraries?.[0]?.segments?.[0]?.departure?.at || '';
      const timeB = b.itineraries?.[0]?.segments?.[0]?.departure?.at || '';
      return timeA.localeCompare(timeB);
    }
    return 0;
  });

  const handleSelectFlight = (flight) => {
    // Navigate to payment screen with selected flight
    navigation.navigate('FlightPayment', {
      selectedFlight: flight,
      searchParams,
    });
  };

  const renderFlightCard = (flight, index) => {
    const itinerary = flight.itineraries?.[0];
    const segments = itinerary?.segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const price = flight.price?.total || '0';
    const currency = flight.price?.currency || 'USD';
    const duration = flightService.formatDuration(itinerary?.duration);
    const stops = segments.length - 1;

    if (!firstSegment || !lastSegment) return null;

    return (
      <View key={index} style={styles.flightCard}>
        {/* Airline and Flight Number */}
        <View style={styles.flightHeader}>
          <Text style={styles.airlineName}>
            {firstSegment.carrierCode} {firstSegment.number}
          </Text>
          {stops === 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Non-stop</Text>
            </View>
          ) : (
            <Text style={styles.stopsText}>{stops} stop{stops > 1 ? 's' : ''}</Text>
          )}
        </View>

        {/* Flight Route */}
        <View style={styles.routeContainer}>
          {/* Departure */}
          <View style={styles.routePoint}>
            <Text style={styles.airportCode}>{firstSegment.departure.iataCode}</Text>
            <Text style={styles.timeText}>
              {flightService.formatDateTime(firstSegment.departure.at)}
            </Text>
          </View>

          {/* Flight Path */}
          <View style={styles.flightPath}>
            <View style={styles.pathLine} />
            <Ionicons name="airplane" size={20} color="#0EA5E9" style={styles.planeIcon} />
            <View style={styles.pathLine} />
          </View>

          {/* Arrival */}
          <View style={styles.routePoint}>
            <Text style={styles.airportCode}>{lastSegment.arrival.iataCode}</Text>
            <Text style={styles.timeText}>
              {flightService.formatDateTime(lastSegment.arrival.at)}
            </Text>
          </View>
        </View>

        {/* Duration */}
        <Text style={styles.durationText}>Duration: {duration}</Text>

        {/* Stops Details */}
        {stops > 0 && (
          <View style={styles.stopsContainer}>
            <Ionicons name="location" size={14} color="#64748B" />
            <Text style={styles.stopsDetails}>
              Stops: {segments.slice(0, -1).map((seg, i) =>
                seg.arrival.iataCode
              ).join(', ')}
            </Text>
          </View>
        )}

        {/* Price and Select Button */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceAmount}>
              {flightService.formatPrice(parseFloat(price), currency)}
            </Text>
            <Text style={styles.perPersonText}>
              for {searchParams.travelers} traveler{searchParams.travelers > 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleSelectFlight(flight)}
          >
            <Text style={styles.selectButtonText}>Select</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {searchParams.from} → {searchParams.to}
          </Text>
          <Text style={styles.headerSubtitle}>
            {searchParams.departDate} • {searchParams.travelers} traveler{searchParams.travelers > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
            Cheapest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'duration' && styles.sortButtonActive]}
          onPress={() => setSortBy('duration')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'duration' && styles.sortButtonTextActive]}>
            Fastest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'departure' && styles.sortButtonActive]}
          onPress={() => setSortBy('departure')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'departure' && styles.sortButtonTextActive]}>
            Earliest
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {sortedFlights.length} flight{sortedFlights.length !== 1 ? 's' : ''} found
      </Text>

      {/* Flight List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sortedFlights.map((flight, index) => renderFlightCard(flight, index))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default FlightResultsScreen;
