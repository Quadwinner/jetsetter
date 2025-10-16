import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/CruiseDetailsScreen.styles';

const { width } = Dimensions.get('window');

const CruiseDetailsScreen = ({ route, navigation }) => {
  const { cruise } = route.params;
  const [selectedTab, setSelectedTab] = useState('overview');
  const insets = useSafeAreaInsets();

  const handleBookNow = () => {
    navigation.navigate('CruiseBooking', { cruise });
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cruise Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="boat" size={20} color="#0066b2" />
            <Text style={styles.detailLabel}>Ship</Text>
            <Text style={styles.detailValue}>{cruise.ship}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color="#0066b2" />
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{cruise.duration}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={20} color="#0066b2" />
            <Text style={styles.detailLabel}>Departure Port</Text>
            <Text style={styles.detailValue}>{cruise.departurePort}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={20} color="#0066b2" />
            <Text style={styles.detailLabel}>Departure Date</Text>
            <Text style={styles.detailValue}>{cruise.departureDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destinations</Text>
        <View style={styles.destinationsGrid}>
          {cruise.destinations.map((dest, index) => (
            <View key={index} style={styles.destinationCard}>
              <Ionicons name="location" size={16} color="#0066b2" />
              <Text style={styles.destinationText}>{dest}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities & Features</Text>
        <View style={styles.amenitiesGrid}>
          {cruise.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Included</Text>
        <View style={styles.includedList}>
          {[
            'Accommodation in selected cabin category',
            'All meals in main dining rooms',
            'Entertainment and activities',
            'Fitness center access',
            'Pool and hot tub access',
            '24-hour room service',
            'Port taxes and government fees',
          ].map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Ionicons name="checkmark" size={16} color="#10b981" />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderItinerary = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Day-by-Day Itinerary</Text>
      {cruise.itinerary.map((day, index) => (
        <View key={index} style={styles.itineraryDay}>
          <View style={styles.dayHeader}>
            <View style={styles.dayNumber}>
              <Text style={styles.dayNumberText}>Day {day.day}</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayPort}>{day.port}</Text>
              <Text style={styles.dayTimes}>
                Arrival: {day.arrival} | Departure: {day.departure}
              </Text>
            </View>
          </View>
          <View style={styles.dayActivities}>
            {day.activities.map((activity, actIndex) => (
              <View key={actIndex} style={styles.activityItem}>
                <Ionicons name="ellipse" size={6} color="#0066b2" />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewSummary}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingNumber}>{cruise.rating}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= cruise.rating ? 'star' : 'star-outline'}
                size={16}
                color="#ffc107"
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>({cruise.reviews} reviews)</Text>
        </View>
      </View>

      <View style={styles.reviewsList}>
        {[
          {
            name: 'Sarah Johnson',
            rating: 5,
            date: '2 weeks ago',
            comment: 'Amazing cruise experience! The ship was beautiful and the staff was incredibly friendly.',
          },
          {
            name: 'Michael Chen',
            rating: 4,
            date: '1 month ago',
            comment: 'Great value for money. Food was excellent and entertainment was top-notch.',
          },
          {
            name: 'Emily Rodriguez',
            rating: 5,
            date: '2 months ago',
            comment: 'Perfect family vacation. Kids loved the activities and we enjoyed the relaxation.',
          },
        ].map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.name}</Text>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= review.rating ? 'star' : 'star-outline'}
                    size={12}
                    color="#ffc107"
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewDate}>{review.date}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverview();
      case 'itinerary':
        return renderItinerary();
      case 'reviews':
        return renderReviews();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <Image
        source={{ uri: cruise.image }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Rating Badge */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={16} color="#ffc107" />
        <Text style={styles.ratingText}>{cruise.rating}</Text>
        <Text style={styles.ratingCount}>({cruise.reviews})</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cruise Info */}
        <View style={styles.cruiseInfo}>
          <Text style={styles.cruiseName}>{cruise.name}</Text>
          <Text style={styles.cruiseLine}>{cruise.cruiseLine}</Text>
          <Text style={styles.cruisePrice}>{cruise.price}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'itinerary' && styles.activeTab]}
            onPress={() => setSelectedTab('itinerary')}
          >
            <Text style={[styles.tabText, selectedTab === 'itinerary' && styles.activeTabText]}>
              Itinerary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Booking Summary */}
        <View style={styles.bookingSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Starting from:</Text>
            <Text style={styles.summaryPrice}>{cruise.price}</Text>
          </View>
          <Text style={styles.summaryNote}>Per person, based on double occupancy</Text>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={[styles.bookButtonContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CruiseDetailsScreen;



