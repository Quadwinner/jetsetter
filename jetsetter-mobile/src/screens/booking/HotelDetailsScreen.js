import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import hotelService from '../../services/hotelService';
import styles from './styles/HotelDetailsScreen.styles';

const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel, searchParams } = route.params;
  const [selectedOffer, setSelectedOffer] = useState(hotel.offers[0]);
  const nights = hotelService.calculateNights(searchParams.checkInDate, searchParams.checkOutDate);

  const handleBookNow = () => {
    navigation.navigate('HotelPayment', { hotel, selectedOffer, searchParams, nights });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: hotel.images[0] }} style={styles.mainImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#FFC107" />
                <Text style={styles.ratingText}>{hotel.rating}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#64748B" />
              <Text style={styles.addressText}>{hotel.address}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.amenityText}>{amenity.replace('_', ' ')}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Room Options</Text>
            {hotel.offers.map((offer, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.roomCard, selectedOffer.offerId === offer.offerId && styles.roomCardActive]}
                onPress={() => setSelectedOffer(offer)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomType}>{offer.roomType}</Text>
                  {selectedOffer.offerId === offer.offerId && (
                    <Ionicons name="checkmark-circle" size={24} color="#0EA5E9" />
                  )}
                </View>
                <Text style={styles.cancellationPolicy}>{offer.cancellationPolicy}</Text>
                <Text style={styles.roomPrice}>
                  {hotelService.formatPrice(offer.price, offer.currency)} / night
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total for {nights} night{nights > 1 ? 's' : ''}</Text>
          <Text style={styles.totalAmount}>
            {hotelService.formatPrice(selectedOffer.price * nights, selectedOffer.currency)}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotelDetailsScreen;
