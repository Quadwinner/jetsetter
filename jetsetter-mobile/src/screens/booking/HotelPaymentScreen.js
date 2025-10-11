import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import hotelService from '../../services/hotelService';
import styles from './styles/HotelPaymentScreen.styles';

const HotelPaymentScreen = ({ route, navigation }) => {
  const { hotel, selectedOffer, searchParams, nights } = route.params;
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const totalPrice = selectedOffer.price * nights;

  const validateForm = () => {
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      Alert.alert('Missing Information', 'Please fill in all guest details');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestDetails.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleCompleteBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const bookingResult = await hotelService.createBooking({
        hotelId: hotel.hotelId,
        offerId: selectedOffer.offerId,
        guestDetails,
        checkInDate: searchParams.checkInDate,
        checkOutDate: searchParams.checkOutDate,
        totalPrice,
        currency: selectedOffer.currency,
      });

      setLoading(false);

      if (bookingResult.success) {
        navigation.navigate('HotelConfirmation', {
          booking: bookingResult.booking,
          hotel,
          selectedOffer,
          searchParams,
          nights,
        });
      } else {
        Alert.alert('Booking Failed', bookingResult.error || 'Unable to complete booking. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Booking error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guest Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.roomType}>{selectedOffer.roomType}</Text>
            <Text style={styles.datesText}>
              {hotelService.formatDate(searchParams.checkInDate)} - {hotelService.formatDate(searchParams.checkOutDate)}
            </Text>
            <Text style={styles.nightsText}>{nights} night{nights > 1 ? 's' : ''} • {searchParams.adults} guest{searchParams.adults > 1 ? 's' : ''}</Text>
            <Text style={styles.priceText}>
              Total: {hotelService.formatPrice(totalPrice, selectedOffer.currency)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  value={guestDetails.firstName}
                  onChangeText={(text) => setGuestDetails({ ...guestDetails, firstName: text })}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  value={guestDetails.lastName}
                  onChangeText={(text) => setGuestDetails({ ...guestDetails, lastName: text })}
                />
              </View>
            </View>

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="john.doe@example.com"
              value={guestDetails.email}
              onChangeText={(text) => setGuestDetails({ ...guestDetails, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="+1234567890"
              value={guestDetails.phone}
              onChangeText={(text) => setGuestDetails({ ...guestDetails, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#0EA5E9" />
            <Text style={styles.infoText}>{selectedOffer.cancellationPolicy}</Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            {hotelService.formatPrice(totalPrice, selectedOffer.currency)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleCompleteBooking}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.bookButtonText}>Processing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.bookButtonText}>Complete Booking</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotelPaymentScreen;
