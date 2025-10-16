import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import hotelService from '../../services/hotelService';
import arcPayService from '../../services/arcPayService';
import styles from './styles/HotelPaymentScreen.styles';

const HotelPaymentScreen = ({ route, navigation }) => {
  const { hotel, selectedOffer, searchParams, nights } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // Fill test card details
  const fillTestCard = () => {
    setPaymentInfo({
      cardNumber: '4012 0000 9876 5439',
      cardHolder: 'Test User',
      expiryDate: '12/25',
      cvv: '999',
    });
    Alert.alert('Test Card Filled', 'Visa test card details have been filled for testing.');
  };

  const totalPrice = selectedOffer.price * nights;

  const validateForm = () => {
    // Validate guest details
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      Alert.alert('Missing Information', 'Please fill in all guest details');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestDetails.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    // Validate payment information
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Missing Payment', 'Please complete all payment information');
      return false;
    }

    return true;
  };

  const handleCompleteBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderReference = `HOTEL-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      console.log('🏨 Starting hotel booking process...');
      console.log('Order Reference:', orderReference);
      console.log('Total Amount:', totalPrice);

      // Parse card expiry date
      let expiryMonth, expiryYear;
      try {
        const expiry = arcPayService.parseExpiryDate(paymentInfo.expiryDate);
        expiryMonth = expiry.month;
        expiryYear = expiry.year;
      } catch (error) {
        setLoading(false);
        Alert.alert('Invalid Expiry Date', 'Please enter expiry date in MM/YY format');
        return;
      }

      // Validate card number
      if (!arcPayService.validateCardNumber(paymentInfo.cardNumber)) {
        setLoading(false);
        Alert.alert('Invalid Card', 'Please enter a valid card number');
        return;
      }

      // Process payment through ARC Pay
      console.log('💳 Processing payment through ARC Pay...');
      const paymentResult = await arcPayService.processPayment({
        amount: totalPrice,
        currency: selectedOffer.currency || 'USD',
        orderReference,
        customerEmail: guestDetails.email,
        customerPhone: guestDetails.phone,
        customerName: `${guestDetails.firstName} ${guestDetails.lastName}`,
        cardNumber: paymentInfo.cardNumber,
        cardHolder: paymentInfo.cardHolder,
        expiryMonth,
        expiryYear,
        cvv: paymentInfo.cvv,
        description: `Hotel Booking - ${hotel.name}`,
      });

      console.log('📊 Payment Result:', paymentResult);

      if (!paymentResult.success) {
        setLoading(false);
        Alert.alert(
          'Payment Failed',
          paymentResult.error || 'Unable to process payment. Please check your card details and try again.'
        );
        return;
      }

      // Create booking only after successful payment
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
        // Navigate to confirmation screen with payment info
        navigation.navigate('HotelConfirmation', {
          booking: bookingResult.booking,
          hotel,
          selectedOffer,
          searchParams,
          nights,
          payment: {
            transactionId: paymentResult.transactionId,
            status: paymentResult.status,
            authorizationCode: paymentResult.authorizationCode,
            amount: paymentResult.amount,
            currency: paymentResult.currency,
            processedAt: new Date().toISOString(),
          },
          orderReference,
        });
      } else {
        Alert.alert(
          'Booking Failed',
          bookingResult.error || 'Unable to complete booking. Please try again.'
        );
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
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

        {/* Payment Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            <TouchableOpacity style={styles.testButton} onPress={fillTestCard}>
              <Text style={styles.testButtonText}>🧪 Fill Test Card</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <Text style={styles.label}>Card Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardNumber: text }))}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Cardholder Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={paymentInfo.cardHolder}
              onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardHolder: text }))}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Expiry Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, expiryDate: text }))}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>CVV *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cvv: text }))}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
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
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
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
