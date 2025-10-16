import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles/CruiseConfirmationScreen.styles';

const CruiseConfirmationScreen = ({ route, navigation }) => {
  const { bookingData } = route.params;
  const { cruise, contactInfo, passengers, totalAmount, orderReference, payment } = bookingData;

  // Save booking to AsyncStorage when confirmation screen loads
  useEffect(() => {
    const saveBooking = async () => {
      try {
        const bookingToSave = {
          orderId: orderReference || `CRUISE-${Date.now()}`,
          bookingReference: orderReference || `CRUISE-${Date.now()}`,
          type: 'cruise',
          cruise,
          contactInfo,
          passengers,
          amount: totalAmount,
          totalAmount,
          payment,
          status: 'CONFIRMED',
          bookingDate: new Date().toISOString(),
          orderCreatedAt: new Date().toISOString(),
          transactionId: payment?.transactionId || null,
        };

        await AsyncStorage.setItem('completedBooking', JSON.stringify(bookingToSave));
        console.log('✅ Cruise booking saved to AsyncStorage');
      } catch (error) {
        console.error('❌ Error saving cruise booking:', error);
      }
    };

    saveBooking();
  }, [cruise, contactInfo, passengers, totalAmount, orderReference, payment]);

  const handleViewTrips = () => {
    navigation.navigate('MyTrips');
  };

  const handleBookAnother = () => {
    navigation.navigate('CruiseSearch');
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.successHeader}
        >
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your cruise booking has been successfully confirmed
          </Text>
        </LinearGradient>

        {/* Booking Details */}
        <View style={styles.bookingDetails}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Booking Reference</Text>
            <Text style={styles.detailValue}>CRUISE-{Date.now().toString().slice(-8)}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Cruise</Text>
            <Text style={styles.detailValue}>{cruise.name}</Text>
            <Text style={styles.detailSubtext}>{cruise.cruiseLine}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{cruise.duration}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Departure Port</Text>
            <Text style={styles.detailValue}>{cruise.departurePort}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Departure Date</Text>
            <Text style={styles.detailValue}>{cruise.departureDate}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Passengers</Text>
            <Text style={styles.detailValue}>
              {passengers.adults.length} Adult{passengers.adults.length !== 1 ? 's' : ''}
              {passengers.children.length > 0 && `, ${passengers.children.length} Child${passengers.children.length !== 1 ? 'ren' : ''}`}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Passenger Information */}
        <View style={styles.passengerSection}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          
          {passengers.adults.map((adult, index) => (
            <View key={index} style={styles.passengerCard}>
              <Text style={styles.passengerTitle}>Adult {index + 1}</Text>
              <Text style={styles.passengerName}>{adult.firstName} {adult.lastName}</Text>
              <Text style={styles.passengerDetails}>Age: {adult.age} | Nationality: {adult.nationality}</Text>
            </View>
          ))}

          {passengers.children.map((child, index) => (
            <View key={index} style={styles.passengerCard}>
              <Text style={styles.passengerTitle}>Child {index + 1}</Text>
              <Text style={styles.passengerName}>{child.firstName} {child.lastName}</Text>
              <Text style={styles.passengerDetails}>Age: {child.age} | Nationality: {child.nationality}</Text>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{contactInfo.firstName} {contactInfo.lastName}</Text>
            <Text style={styles.contactEmail}>{contactInfo.email}</Text>
            <Text style={styles.contactPhone}>{contactInfo.phone}</Text>
          </View>
        </View>

        {/* Important Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Important Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="mail" size={20} color="#0066b2" />
              <Text style={styles.infoText}>
                A confirmation email has been sent to {contactInfo.email}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color="#0066b2" />
              <Text style={styles.infoText}>
                Check-in opens 2 hours before departure
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="document-text" size={20} color="#0066b2" />
              <Text style={styles.infoText}>
                Please bring valid ID and booking confirmation
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="call" size={20} color="#0066b2" />
              <Text style={styles.infoText}>
                For assistance, call (877) 538-7380
              </Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Check your email for detailed booking information
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Complete online check-in 24 hours before departure
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Arrive at the port 2 hours before departure time
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleViewTrips}>
          <Ionicons name="briefcase" size={20} color="#0066b2" />
          <Text style={styles.secondaryButtonText}>View My Trips</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryButton} onPress={handleBookAnother}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Book Another</Text>
        </TouchableOpacity>
      </View>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={handleHome}>
        <Ionicons name="home" size={20} color="#0066b2" />
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CruiseConfirmationScreen;



