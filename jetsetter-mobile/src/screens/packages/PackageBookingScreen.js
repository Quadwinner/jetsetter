import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import packageService from '../../services/packageService';

const PackageBookingScreen = ({ route, navigation }) => {
  const { package: pkg } = route.params;
  const [loading, setLoading] = useState(false);
  const [traveler, setTraveler] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' });
  const [travelDate, setTravelDate] = useState('');

  const handleBooking = async () => {
    if (!traveler.firstName || !traveler.lastName || !traveler.email || !traveler.phone || !travelDate) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await packageService.createBooking({
      packageId: pkg.id,
      travelDate,
      travelers: [traveler],
      totalPrice: pkg.price,
      currency: 'USD',
    });
    setLoading(false);
    if (result.success) {
      navigation.navigate('PackageConfirmation', { booking: result.booking, package: pkg });
    } else {
      Alert.alert('Booking Failed', result.error);
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
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>{pkg.title}</Text>
            <Text style={{ color: '#64748B' }}>{pkg.location}</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#0EA5E9', marginTop: 12 }}>{packageService.formatPrice(pkg.price)}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Traveler Details</Text>
          <View style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Travel Date *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="YYYY-MM-DD" value={travelDate} onChangeText={setTravelDate} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>First Name *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="John" value={traveler.firstName} onChangeText={(text) => setTraveler({ ...traveler, firstName: text })} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Last Name *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="Doe" value={traveler.lastName} onChangeText={(text) => setTraveler({ ...traveler, lastName: text })} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Email *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="john@example.com" value={traveler.email} onChangeText={(text) => setTraveler({ ...traveler, email: text })} keyboardType="email-address" autoCapitalize="none" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>Phone *</Text>
            <TextInput style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12 }} placeholder="+1234567890" value={traveler.phone} onChangeText={(text) => setTraveler({ ...traveler, phone: text })} keyboardType="phone-pad" />
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16 }}>
        <TouchableOpacity style={{ backgroundColor: loading ? '#94A3B8' : '#0EA5E9', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }} onPress={handleBooking} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Complete Booking</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PackageBookingScreen;
