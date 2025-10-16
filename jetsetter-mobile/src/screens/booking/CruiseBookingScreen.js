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
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import arcPayService from '../../services/arcPayService';
import styles from './styles/CruiseBookingScreen.styles';

const CruiseBookingScreen = ({ route, navigation }) => {
  const { cruise } = route.params;
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Passenger Information
  const [passengers, setPassengers] = useState({
    adults: [{ firstName: '', lastName: '', age: '', nationality: '' }],
    children: [],
  });

  // Payment Information
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const validateStep1 = () => {
    if (!contactInfo.firstName || !contactInfo.lastName) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!contactInfo.email) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!contactInfo.phone) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < passengers.adults.length; i++) {
      const adult = passengers.adults[i];
      if (!adult.firstName || !adult.lastName || !adult.age || !adult.nationality) {
        Alert.alert('Error', `Please complete all details for Adult ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    if (!paymentInfo.cardNumber || !paymentInfo.cardHolder || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      Alert.alert('Error', 'Please complete all payment information');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addAdult = () => {
    setPassengers(prev => ({
      ...prev,
      adults: [...prev.adults, { firstName: '', lastName: '', age: '', nationality: '' }]
    }));
  };

  const updateAdult = (index, field, value) => {
    setPassengers(prev => ({
      ...prev,
      adults: prev.adults.map((adult, i) =>
        i === index ? { ...adult, [field]: value } : adult
      )
    }));
  };

  const handleBooking = async () => {
    if (!validateStep3()) return;

    setLoading(true);

    try {
      const totalAmount = calculateTotal();
      const orderReference = `CRUISE-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

      console.log('🚢 Starting cruise booking process...');
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
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone,
        customerName: `${contactInfo.firstName} ${contactInfo.lastName}`,
        cardNumber: paymentInfo.cardNumber,
        cardHolder: paymentInfo.cardHolder,
        expiryMonth,
        expiryYear,
        cvv: paymentInfo.cvv,
        description: `Cruise Booking - ${cruise.name}`,
      });

      console.log('📊 Payment Result:', paymentResult);

      if (paymentResult.success) {
        // Payment successful - create booking data
        const bookingData = {
          cruise,
          contactInfo,
          passengers,
          paymentInfo: {
            ...paymentInfo,
            cardNumber: '****' + paymentInfo.cardNumber.slice(-4), // Mask card number
            cvv: '***', // Mask CVV
          },
          totalAmount,
          orderReference,
          payment: {
            transactionId: paymentResult.transactionId,
            status: paymentResult.status,
            authorizationCode: paymentResult.authorizationCode,
            amount: paymentResult.amount,
            currency: paymentResult.currency,
            processedAt: new Date().toISOString(),
          },
        };

        console.log('✅ Booking successful!');
        setLoading(false);

        // Navigate to confirmation screen
        navigation.navigate('CruiseConfirmation', { bookingData });
      } else {
        // Payment failed
        setLoading(false);
        Alert.alert(
          'Payment Failed',
          paymentResult.error || 'Unable to process payment. Please check your card details and try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ Booking error:', error);
      Alert.alert(
        'Booking Failed',
        'An unexpected error occurred during booking. Please try again.'
      );
    }
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(cruise.price.replace(/[^0-9.]/g, ''));
    const taxesAndFees = 150;
    const portCharges = 200;
    const totalPassengers = passengers.adults.length + passengers.children.length;
    return (basePrice + taxesAndFees + portCharges) * totalPassengers;
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              currentStep >= step && styles.stepTextActive
            ]}>
              {step}
            </Text>
          </View>
          <Text style={[
            styles.stepLabel,
            currentStep >= step && styles.stepLabelActive
          ]}>
            {step === 1 ? 'Contact' : step === 2 ? 'Passengers' : 'Payment'}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepSubtitle}>We'll use this information to send you booking confirmation</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={contactInfo.firstName}
          onChangeText={(text) => setContactInfo(prev => ({ ...prev, firstName: text }))}
          placeholder="Enter first name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          value={contactInfo.lastName}
          onChangeText={(text) => setContactInfo(prev => ({ ...prev, lastName: text }))}
          placeholder="Enter last name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          value={contactInfo.email}
          onChangeText={(text) => setContactInfo(prev => ({ ...prev, email: text }))}
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={contactInfo.phone}
          onChangeText={(text) => setContactInfo(prev => ({ ...prev, phone: text }))}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Passenger Information</Text>
      <Text style={styles.stepSubtitle}>Enter details for all passengers</Text>

      {passengers.adults.map((adult, index) => (
        <View key={index} style={styles.passengerCard}>
          <Text style={styles.passengerTitle}>Adult {index + 1}</Text>

          <View style={styles.nameRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={adult.firstName}
                onChangeText={(text) => updateAdult(index, 'firstName', text)}
                placeholder="First name"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={adult.lastName}
                onChangeText={(text) => updateAdult(index, 'lastName', text)}
                placeholder="Last name"
              />
            </View>
          </View>

          <View style={styles.nameRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                value={adult.age}
                onChangeText={(text) => updateAdult(index, 'age', text)}
                placeholder="Age"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Nationality *</Text>
              <TextInput
                style={styles.input}
                value={adult.nationality}
                onChangeText={(text) => updateAdult(index, 'nationality', text)}
                placeholder="Nationality"
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addAdult}>
        <Ionicons name="add" size={20} color="#0066b2" />
        <Text style={styles.addButtonText}>Add Adult Passenger</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Information</Text>
      <Text style={styles.stepSubtitle}>Secure payment processing with ARC Pay</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Card Number *</Text>
        <TextInput
          style={styles.input}
          value={paymentInfo.cardNumber}
          onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardNumber: text }))}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cardholder Name *</Text>
        <TextInput
          style={styles.input}
          value={paymentInfo.cardHolder}
          onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cardHolder: text }))}
          placeholder="John Doe"
        />
      </View>

      <View style={styles.nameRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Expiry Date *</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.expiryDate}
            onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, expiryDate: text }))}
            placeholder="MM/YY"
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>CVV *</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.cvv}
            onChangeText={(text) => setPaymentInfo(prev => ({ ...prev, cvv: text }))}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
      </View>

      {/* Booking Summary */}
      <View style={styles.bookingSummary}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cruise:</Text>
          <Text style={styles.summaryValue}>{cruise.name}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>{cruise.duration}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Passengers:</Text>
          <Text style={styles.summaryValue}>{passengers.adults.length + passengers.children.length}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Base Price:</Text>
          <Text style={styles.summaryValue}>{cruise.price}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxes & Fees:</Text>
          <Text style={styles.summaryValue}>$150</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Port Charges:</Text>
          <Text style={styles.summaryValue}>$200</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066b2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Cruise</Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backFooterButton} onPress={handleBack}>
            <Text style={styles.backFooterButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={currentStep === 3 ? handleBooking : handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? 'Complete Booking' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CruiseBookingScreen;
