import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import packageService from '../../services/packageService';

const PackageDetailsScreen = ({ route, navigation }) => {
  const { packageId } = route.params;
  const insets = useSafeAreaInsets();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    const result = await packageService.getPackageDetails(packageId);
    if (result.success) setPkg(result.package);
  };

  if (!pkg) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: pkg.image }} style={{ width: '100%', height: 300 }} />
          <TouchableOpacity style={{ position: 'absolute', top: 48, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 }}>{pkg.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="location" size={18} color="#64748B" />
            <Text style={{ color: '#64748B', marginLeft: 6, fontSize: 16 }}>{pkg.location}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 }}>Highlights</Text>
          {pkg.highlights.map((h, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={{ marginLeft: 8, color: '#475569' }}>{h}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16, marginBottom: 12 }}>Itinerary</Text>
          {pkg.itinerary.map((day) => (
            <View key={day.day} style={{ backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>Day {day.day}: {day.title}</Text>
              {day.activities.map((a, i) => (
                <Text key={i} style={{ color: '#64748B', marginBottom: 4 }}>• {a}</Text>
              ))}
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                {day.meals.map((m, i) => (
                  <View key={i} style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontSize: 12, color: '#16A34A' }}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        padding: 16,
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 12, color: '#64748B' }}>Total Price</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#0EA5E9' }}>{packageService.formatPrice(pkg.price)}</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: '#0EA5E9', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 }} onPress={() => navigation.navigate('PackageBooking', { package: pkg })}>
            <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PackageDetailsScreen;
