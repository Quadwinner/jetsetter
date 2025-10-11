import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import hotelService from '../../services/hotelService';
import styles from './styles/HotelConfirmationScreen.styles';

const HotelConfirmationScreen = ({ route, navigation }) => {
  const { booking, hotel, selectedOffer, searchParams, nights } = route.params;

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSubtitle}>Your hotel reservation is confirmed</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.referenceCard}>
            <Text style={styles.referenceLabel}>Booking Reference</Text>
            <Text style={styles.referenceCode}>{booking.bookingReference}</Text>
            <Text style={styles.referenceNote}>Please save this reference for your records</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotel Details</Text>
          <View style={styles.card}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={18} color="#64748B" />
              <Text style={styles.detailText}>{hotel.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="bed" size={18} color="#64748B" />
              <Text style={styles.detailText}>{selectedOffer.roomType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={18} color="#64748B" />
              <Text style={styles.detailText}>
                {hotelService.formatDate(searchParams.checkInDate)} - {hotelService.formatDate(searchParams.checkOutDate)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="moon" size={18} color="#64748B" />
              <Text style={styles.detailText}>{nights} night{nights > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={18} color="#64748B" />
              <Text style={styles.priceText}>
                Total: {hotelService.formatPrice(booking.totalPrice, booking.currency)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <View style={styles.card}>
            <View style={styles.guestRow}>
              <Ionicons name="person" size={20} color="#0EA5E9" />
              <Text style={styles.guestName}>
                {booking.guestDetails.firstName} {booking.guestDetails.lastName}
              </Text>
            </View>
            <View style={styles.guestRow}>
              <Ionicons name="mail" size={20} color="#0EA5E9" />
              <Text style={styles.guestDetail}>{booking.guestDetails.email}</Text>
            </View>
            <View style={styles.guestRow}>
              <Ionicons name="call" size={20} color="#0EA5E9" />
              <Text style={styles.guestDetail}>{booking.guestDetails.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>A confirmation email has been sent to your email address</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>Check-in time is usually 3:00 PM, check-out at 11:00 AM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={20} color="#0EA5E9" />
              <Text style={styles.infoText}>Please carry a valid ID and credit card for check-in</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotelConfirmationScreen;
