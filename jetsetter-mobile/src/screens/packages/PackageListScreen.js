import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import packageService from '../../services/packageService';

const PackageListScreen = ({ navigation }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const result = await packageService.searchPackages();
    if (result.success) setPackages(result.packages);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', paddingTop: 48 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#1E293B' }}>Vacation Packages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={32} color="#0EA5E9" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 16 }}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={{ backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
                onPress={() => navigation.navigate('PackageDetails', { packageId: pkg.id })}
              >
                <Image source={{ uri: pkg.image }} style={{ width: '100%', height: 200 }} />
                {pkg.discount > 0 && (
                  <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12 }}>{pkg.discount}% OFF</Text>
                  </View>
                )}
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>{pkg.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="location" size={16} color="#64748B" />
                    <Text style={{ color: '#64748B', marginLeft: 6, flex: 1 }}>{pkg.location}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="star" size={14} color="#FFC107" />
                      <Text style={{ marginLeft: 4, color: '#1E293B', fontWeight: '600' }}>{pkg.rating}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="time" size={16} color="#64748B" />
                    <Text style={{ color: '#64748B', marginLeft: 6 }}>{pkg.duration}</Text>
                    <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 12 }}>
                      <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '600' }}>{pkg.packageType}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 24, fontWeight: '700', color: '#0EA5E9' }}>{packageService.formatPrice(pkg.price)}</Text>
                      <Text style={{ fontSize: 12, color: '#94A3B8' }}>per person</Text>
                    </View>
                    <View style={{ backgroundColor: '#0EA5E9', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}>
                      <Text style={{ color: '#FFF', fontWeight: '600' }}>View Details</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PackageListScreen;
