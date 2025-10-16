import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import packageService from '../../services/packageService';

const PackageConfirmationScreen = ({ route, navigation }) => {
  const { booking, package: pkg, payment, orderReference } = route.params;

  // Save booking to AsyncStorage when confirmation screen loads
  useEffect(() => {
    const saveBooking = async () => {
      try {
        const bookingToSave = {
          orderId: orderReference || booking.bookingReference || `PACKAGE-${Date.now()}`,
          bookingReference: booking.bookingReference || orderReference || `PACKAGE-${Date.now()}`,
          type: 'package',
          package: pkg,
          travelDate: booking.travelDate,
          travelers: booking.travelers,
          amount: booking.totalPrice,
          totalAmount: booking.totalPrice,
          payment: payment || null,
          status: 'CONFIRMED',
          bookingDate: new Date().toISOString(),
          orderCreatedAt: new Date().toISOString(),
          transactionId: payment?.transactionId || null,
        };

        await AsyncStorage.setItem('completedPackageBooking', JSON.stringify(bookingToSave));
        console.log('✅ Package booking saved to AsyncStorage');
      } catch (error) {
        console.error('❌ Error saving package booking:', error);
      }
    };

    saveBooking();
  }, [orderReference, booking, pkg, payment]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ backgroundColor: '#FFF', paddingTop: 60, paddingBottom: 32, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#1E293B', marginTop: 16, marginBottom: 8 }}>Booking Confirmed!</Text>
        <Text style={{ fontSize: 16, color: '#64748B' }}>Your vacation package is confirmed</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          <View style={{ backgroundColor: '#DCFCE7', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#10B981', marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#047857', marginBottom: 8 }}>Booking Reference</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#065F46', letterSpacing: 1 }}>{booking.bookingReference}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Package Details</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>{pkg.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="location" size={18} color="#64748B" />
              <Text style={{ marginLeft: 8, color: '#475569' }}>{pkg.location}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="calendar" size={18} color="#64748B" />
              <Text style={{ marginLeft: 8, color: '#475569' }}>Travel Date: {packageService.formatDate(booking.travelDate)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="time" size={18} color="#64748B" />
              <Text style={{ marginLeft: 8, color: '#475569' }}>{pkg.duration}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="pricetag" size={18} color="#64748B" />
              <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: '700', color: '#10B981' }}>Total: {packageService.formatPrice(booking.totalPrice)}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Traveler Information</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 8 }}>{booking.travelers[0].firstName} {booking.travelers[0].lastName}</Text>
            <Text style={{ color: '#64748B', marginBottom: 4 }}>{booking.travelers[0].email}</Text>
            <Text style={{ color: '#64748B' }}>{booking.travelers[0].phone}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16 }}>
        <TouchableOpacity style={{ backgroundColor: '#0EA5E9', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}>
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PackageConfirmationScreen;
