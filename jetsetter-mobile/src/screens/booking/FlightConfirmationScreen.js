import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import flightService from '../../services/flightService';
import styles from './styles/FlightConfirmationScreen.styles';

const FlightConfirmationScreen = ({ route, navigation }) => {
  const { pnr, orderId, orderData, travelers, flight, payment, orderReference } = route.params;

  const price = flight.price?.total || '0';
  const currency = flight.price?.currency || 'USD';
  const itinerary = flight.itineraries?.[0];
  const firstSegment = itinerary?.segments?.[0];
  const lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];

  // Save booking to AsyncStorage when confirmation screen loads
  useEffect(() => {
    const saveBooking = async () => {
      try {
        const bookingToSave = {
          orderId: orderId || orderReference || `FLIGHT-${Date.now()}`,
          bookingReference: pnr || orderReference || `FLIGHT-${Date.now()}`,
          type: 'flight',
          flight,
          travelers,
          amount: parseFloat(price),
          totalAmount: parseFloat(price),
          payment: payment || null,
          status: 'CONFIRMED',
          bookingDate: new Date().toISOString(),
          orderCreatedAt: new Date().toISOString(),
          transactionId: payment?.transactionId || null,
          pnr,
        };

        await AsyncStorage.setItem('completedFlightBooking', JSON.stringify(bookingToSave));
        console.log('✅ Flight booking saved to AsyncStorage');
      } catch (error) {
        console.error('❌ Error saving flight booking:', error);
      }
    };

    saveBooking();
  }, [orderId, orderReference, pnr, flight, travelers, price, payment]);

  const handleDone = () => {
    // Navigate to home or trips screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleViewTrips = () => {
    // Navigate to trips screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
    // You can add logic here to navigate to the trips tab
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>
          Your flight has been booked successfully
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Booking Reference */}
        <View style={styles.section}>
          <View style={styles.referenceCard}>
            <Text style={styles.referenceLabel}>Booking Reference (PNR)</Text>
            <Text style={styles.referenceCode}>{pnr}</Text>
            <Text style={styles.referenceNote}>
              Please save this reference number for your records
            </Text>
          </View>
        </View>

        {/* Flight Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Details</Text>
          <View style={styles.card}>
            <View style={styles.routeHeader}>
              <View style={styles.routePoint}>
                <Text style={styles.airportCode}>{firstSegment?.departure?.iataCode}</Text>
                <Text style={styles.cityName}>
                  {firstSegment?.departure?.iataCode}
                </Text>
              </View>
              <View style={styles.flightPathContainer}>
                <View style={styles.pathLine} />
                <Ionicons name="airplane" size={24} color="#0EA5E9" style={styles.planeIcon} />
                <View style={styles.pathLine} />
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.airportCode}>{lastSegment?.arrival?.iataCode}</Text>
                <Text style={styles.cityName}>
                  {lastSegment?.arrival?.iataCode}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Departure</Text>
                  <Text style={styles.detailValue}>
                    {flightService.formatDateTime(firstSegment?.departure?.at)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color="#64748B" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {flightService.formatDuration(itinerary?.duration)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={20} color="#64748B" />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Total Paid</Text>
                  <Text style={styles.priceValue}>
                    {flightService.formatPrice(parseFloat(price), currency)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Travelers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travelers</Text>
          <View style={styles.card}>
            {travelers.map((traveler, index) => (
              <View key={index} style={[styles.travelerRow, index > 0 && styles.travelerBorder]}>
                <View style={styles.travelerIcon}>
                  <Ionicons name="person" size={24} color="#0EA5E9" />
                </View>
                <View style={styles.travelerInfo}>
                  <Text style={styles.travelerName}>
                    {traveler.name.firstName} {traveler.name.lastName}
                  </Text>
                  <Text style={styles.travelerDetails}>
                    {traveler.gender} • Born: {traveler.dateOfBirth}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Important Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>
                A confirmation email has been sent to your registered email address
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="document-text-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>
                Please check in online 24-48 hours before departure
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>
                Carry a valid government-issued ID or passport for travel
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewTrips}
        >
          <Ionicons name="briefcase-outline" size={20} color="#0EA5E9" />
          <Text style={styles.secondaryButtonText}>View My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleDone}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlightConfirmationScreen;
