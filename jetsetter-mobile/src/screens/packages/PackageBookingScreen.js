import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import packageService from '../../services/packageService';
import arcPayService from '../../services/arcPayService';

const PackageBookingScreen = ({ route, navigation }) => {
  const { package: pkg } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [traveler, setTraveler] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
  const [travelDate, setTravelDate] = useState('');

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

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [travelDateObj, setTravelDateObj] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTravelDateObj(selectedDate);
      setTravelDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleBooking = async () => {
    // Validate traveler details
    if (!traveler.firstName || !traveler.lastName || !traveler.email || !traveler.phone || !travelDate) {
      Alert.alert('Missing Information', 'Please fill in all traveler fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(traveler.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate payment information
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Missing Payment', 'Please complete all payment information');
      return;
    }

    setLoading(true);

    try {
      const totalAmount = pkg.price;
      const orderReference = `PACKAGE-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      console.log('📦 Starting package booking process...');
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
        currency: 'USD',
        orderReference,
        customerEmail: traveler.email,
        customerPhone: traveler.phone,
        customerName: `${traveler.firstName} ${traveler.lastName}`,
        cardNumber: paymentInfo.cardNumber,
        cardHolder: paymentInfo.cardHolder,
        expiryMonth,
        expiryYear,
        cvv: paymentInfo.cvv,
        description: `Package Booking - ${pkg.title}`,
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
      const result = await packageService.createBooking({
        packageId: pkg.id,
        travelDate,
        travelers: [traveler],
        totalPrice: pkg.price,
        currency: 'USD',
      });

      setLoading(false);

      if (result.success) {
        // Navigate to confirmation screen with payment info
        navigation.navigate('PackageConfirmation', {
          booking: result.booking,
          package: pkg,
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
        Alert.alert('Booking Failed', result.error || 'Unable to complete booking. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Booking error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF', paddingTop: 48 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E293B' }}>Booking Details</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
        <View style={{ padding: 16 }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>{pkg.title}</Text>
            <Text style={{ color: '#64748B' }}>{pkg.location}</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#0EA5E9', marginTop: 12 }}>{packageService.formatPrice(pkg.price)}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Traveler Details</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Travel Date *</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: travelDate ? '#1E293B' : '#94A3B8', fontSize: 16 }}>
                {travelDate || 'YYYY-MM-DD'}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>First Name *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="John" value={traveler.firstName} onChangeText={(text) => setTraveler({ ...traveler, firstName: text })} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Last Name *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="Doe" value={traveler.lastName} onChangeText={(text) => setTraveler({ ...traveler, lastName: text })} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Email *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="john@example.com" value={traveler.email} onChangeText={(text) => setTraveler({ ...traveler, email: text })} keyboardType="email-address" autoCapitalize="none" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Phone *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12 }} placeholder="+1234567890" value={traveler.phone} onChangeText={(text) => setTraveler({ ...traveler, phone: text })} keyboardType="phone-pad" />
          </View>

          {/* Payment Information */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B' }}>Payment Information</Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
              onPress={fillTestCard}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>🧪 Fill Test Card</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Card Number *</Text>
            <TextInput
              style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }}
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardNumber: text }))}
              keyboardType="numeric"
            />

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Cardholder Name *</Text>
            <TextInput
              style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }}
              placeholder="John Doe"
              value={paymentInfo.cardHolder}
              onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardHolder: text }))}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Expiry Date *</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12 }}
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, expiryDate: text }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>CVV *</Text>
                <TextInput
                  style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12 }}
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cvv: text }))}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={travelDateObj}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        padding: 16,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
        <TouchableOpacity style={{ backgroundColor: loading ? '#94A3B8' : '#0EA5E9', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleBooking} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Complete Booking</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PackageBookingScreen;
