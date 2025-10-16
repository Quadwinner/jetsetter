import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import flightService from '../../services/flightService';
import arcPayService from '../../services/arcPayService';
import styles from './styles/FlightPaymentScreen.styles';

const FlightPaymentScreen = ({ route, navigation }) => {
  const { selectedFlight, searchParams } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  // Initialize travelers array based on search params
  const initializeTravelers = () => {
    return Array.from({ length: searchParams.travelers }, (_, index) => ({
      id: (index + 1).toString(),
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
    }));
  };

  const [travelers, setTravelers] = useState(initializeTravelers());
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

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

  const updateTraveler = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const validateForm = () => {
    // Validate travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      if (!traveler.firstName || !traveler.lastName || !traveler.dateOfBirth || !traveler.gender) {
        Alert.alert('Missing Information', `Please fill in all required fields for Traveler ${i + 1}`);
        return false;
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(traveler.dateOfBirth)) {
        Alert.alert('Invalid Date', `Please enter date of birth in YYYY-MM-DD format for Traveler ${i + 1}`);
        return false;
      }

      // Validate gender
      if (!['MALE', 'FEMALE'].includes(traveler.gender.toUpperCase())) {
        Alert.alert('Invalid Gender', `Please enter MALE or FEMALE for Traveler ${i + 1}`);
        return false;
      }
    }

    // Validate contact info
    if (!contactEmail || !contactPhone) {
      Alert.alert('Missing Contact', 'Please provide contact email and phone number');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
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

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const price = selectedFlight.price?.total || '0';
      const totalAmount = parseFloat(price);
      const orderReference = `FLIGHT-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      console.log('✈️ Starting flight booking process...');
      console.log('Order Reference:', orderReference);
      console.log('Total Amount:', totalAmount);

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
        amount: totalAmount,
        currency: selectedFlight.price?.currency || 'USD',
        orderReference,
        customerEmail: contactEmail,
        customerPhone: contactPhone,
        customerName: `${travelers[0].firstName} ${travelers[0].lastName}`,
        cardNumber: paymentInfo.cardNumber,
        cardHolder: paymentInfo.cardHolder,
        expiryMonth,
        expiryYear,
        cvv: paymentInfo.cvv,
        description: `Flight Booking - ${selectedFlight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} to ${selectedFlight.itineraries?.[0]?.segments?.[selectedFlight.itineraries[0].segments.length - 1]?.arrival?.iataCode}`,
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

      // Format travelers for Amadeus API
      const formattedTravelers = travelers.map((traveler) => ({
        id: traveler.id,
        dateOfBirth: traveler.dateOfBirth,
        name: {
          firstName: traveler.firstName,
          lastName: traveler.lastName,
        },
        gender: traveler.gender.toUpperCase(),
        contact: {
          emailAddress: traveler.email || contactEmail,
          phones: [
            {
              deviceType: 'MOBILE',
              countryCallingCode: '1',
              number: traveler.phone || contactPhone,
            },
          ],
        },
      }));

      // Create booking
      const result = await flightService.createOrder({
        flightOffers: [selectedFlight],
        travelers: formattedTravelers,
        contactEmail,
        contactPhone,
      });

      setLoading(false);

      if (result.success) {
        // Navigate to confirmation screen with payment info
        navigation.navigate('FlightConfirmation', {
          pnr: result.pnr,
          orderId: result.orderId || orderReference,
          orderData: result.orderData,
          travelers: formattedTravelers,
          flight: selectedFlight,
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
          result.error || 'Unable to complete booking. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Booking error:', error);
    }
  };

  const price = selectedFlight.price?.total || '0';
  const currency = selectedFlight.price?.currency || 'USD';
  const itinerary = selectedFlight.itineraries?.[0];
  const firstSegment = itinerary?.segments?.[0];
  const lastSegment = itinerary?.segments?.[itinerary.segments.length - 1];

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
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Flight Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.routeRow}>
              <Text style={styles.airportCode}>{firstSegment?.departure?.iataCode}</Text>
              <Ionicons name="arrow-forward" size={20} color="#64748B" />
              <Text style={styles.airportCode}>{lastSegment?.arrival?.iataCode}</Text>
            </View>
            <Text style={styles.summaryText}>
              {flightService.formatDateTime(firstSegment?.departure?.at)}
            </Text>
            <Text style={styles.summaryText}>
              Duration: {flightService.formatDuration(itinerary?.duration)}
            </Text>
            <Text style={styles.priceText}>
              Total: {flightService.formatPrice(parseFloat(price), currency)}
            </Text>
          </View>
        </View>

        {/* Traveler Details */}
        {travelers.map((traveler, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>Traveler {index + 1}</Text>
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    value={traveler.firstName}
                    onChangeText={(text) => updateTraveler(index, 'firstName', text)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Last Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    value={traveler.lastName}
                    onChangeText={(text) => updateTraveler(index, 'lastName', text)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Date of Birth *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={traveler.dateOfBirth}
                    onChangeText={(text) => updateTraveler(index, 'dateOfBirth', text)}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Gender *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MALE / FEMALE"
                    value={traveler.gender}
                    onChangeText={(text) => updateTraveler(index, 'gender', text)}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <Text style={styles.label}>Email (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="john.doe@example.com"
                value={traveler.email}
                onChangeText={(text) => updateTraveler(index, 'email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Phone (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="5551234567"
                value={traveler.phone}
                onChangeText={(text) => updateTraveler(index, 'phone', text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        ))}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="5551234567"
              value={contactPhone}
              onChangeText={setContactPhone}
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

        {/* Important Notes */}
        <View style={styles.section}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#0EA5E9" />
            <Text style={styles.infoText}>
              Please ensure all traveler details match their government-issued ID or passport.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Book Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            {flightService.formatPrice(parseFloat(price), currency)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handlePayment}
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

export default FlightPaymentScreen;
