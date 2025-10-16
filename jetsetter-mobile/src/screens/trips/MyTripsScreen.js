import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles/MyTripsScreen.styles';

const MyTripsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load bookings from AsyncStorage
  const loadBookings = useCallback(async () => {
    try {
      const allBookings = [];

      console.log('🔍 Loading bookings from AsyncStorage...');

      // Load flight bookings
      const flightBooking = await AsyncStorage.getItem('completedFlightBooking');
      if (flightBooking) {
        try {
          const booking = JSON.parse(flightBooking);
          console.log('Parsed flight booking:', booking);
          allBookings.push({
            ...booking,
            type: 'flight',
            bookingDate: booking.orderCreatedAt || new Date().toISOString()
          });
        } catch (error) {
          console.error('Error parsing flight booking:', error);
        }
      }

      // Load cruise bookings
      const cruiseBooking = await AsyncStorage.getItem('completedBooking');
      if (cruiseBooking) {
        try {
          const booking = JSON.parse(cruiseBooking);
          console.log('Parsed cruise booking:', booking);
          allBookings.push({
            ...booking,
            type: 'cruise',
            bookingDate: booking.orderCreatedAt || new Date().toISOString()
          });
        } catch (error) {
          console.error('Error parsing cruise booking:', error);
        }
      }

      // Load hotel bookings
      const hotelBooking = await AsyncStorage.getItem('completedHotelBooking');
      if (hotelBooking) {
        try {
          const booking = JSON.parse(hotelBooking);
          console.log('Parsed hotel booking:', booking);
          allBookings.push({
            ...booking,
            type: 'hotel',
            bookingDate: booking.orderCreatedAt || new Date().toISOString()
          });
        } catch (error) {
          console.error('Error parsing hotel booking:', error);
        }
      }

      // Load package bookings
      const packageBooking = await AsyncStorage.getItem('completedPackageBooking');
      if (packageBooking) {
        try {
          const booking = JSON.parse(packageBooking);
          console.log('Parsed package booking:', booking);
          allBookings.push({
            ...booking,
            type: 'package',
            bookingDate: booking.orderCreatedAt || new Date().toISOString()
          });
        } catch (error) {
          console.error('Error parsing package booking:', error);
        }
      }

      console.log('📋 Total bookings loaded:', allBookings.length);
      setBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if (authStatus !== 'true') {
          setIsGuest(true);
          setTimeout(() => {
            setShowLoginPopup(true);
          }, 500);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsGuest(true);
      }
    };

    checkAuth();
  }, []);

  // Load bookings when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  // Refresh bookings
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, [loadBookings]);

  // Filter bookings
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by type
    if (activeFilter !== 'All') {
      const typeMap = {
        'Flights': 'flight',
        'Cruise': 'cruise',
        'Hotels': 'hotel',
        'Packages': 'package',
      };
      const targetType = typeMap[activeFilter];
      filtered = filtered.filter(booking => booking.type === targetType);
    }

    // Filter by status (tab)
    if (activeTab === 'Upcoming') {
      filtered = filtered.filter(booking =>
        booking.status !== 'CANCELLED' && booking.status !== 'FAILED'
      );
    } else if (activeTab === 'Cancelled') {
      filtered = filtered.filter(booking => booking.status === 'CANCELLED');
    } else if (activeTab === 'Failed') {
      filtered = filtered.filter(booking => booking.status === 'FAILED');
    } else if (activeTab === 'Past') {
      filtered = [];
    }

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  // Get booking type info
  const getBookingTypeInfo = (type) => {
    const typeInfo = {
      flight: {
        icon: 'airplane',
        label: 'Flight',
        color: '#0EA5E9',
        bgColor: '#E0F2FE',
        gradient: ['#0EA5E9', '#0284C7'],
      },
      cruise: {
        icon: 'boat',
        label: 'Cruise',
        color: '#8B5CF6',
        bgColor: '#EDE9FE',
        gradient: ['#8B5CF6', '#7C3AED'],
      },
      hotel: {
        icon: 'bed',
        label: 'Hotel',
        color: '#EC4899',
        bgColor: '#FCE7F3',
        gradient: ['#EC4899', '#DB2777'],
      },
      package: {
        icon: 'gift',
        label: 'Package',
        color: '#F59E0B',
        bgColor: '#FEF3C7',
        gradient: ['#F59E0B', '#D97706'],
      },
    };
    return typeInfo[type] || typeInfo.flight;
  };

  // Render booking card
  const renderBookingCard = (booking) => {
    const typeInfo = getBookingTypeInfo(booking.type);
    const bookingDate = new Date(booking.bookingDate || booking.orderCreatedAt);

    return (
      <TouchableOpacity
        key={booking.orderId || booking.bookingReference}
        style={styles.bookingCard}
        activeOpacity={0.7}
      >
        {/* Colored Top Bar */}
        <LinearGradient
          colors={typeInfo.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardTopBar}
        />

        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.iconContainer, { backgroundColor: typeInfo.bgColor }]}>
              <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.bookingTitle}>{typeInfo.label} Booking</Text>
              <Text style={styles.bookingId}>
                {booking.pnr || booking.orderId || booking.bookingReference}
              </Text>
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            booking.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCancelled
          ]}>
            <Text style={styles.statusText}>
              {booking.status || 'Confirmed'}
            </Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Booking Date</Text>
            <Text style={styles.infoValue}>
              {bookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>

          {booking.amount && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Amount</Text>
              <Text style={styles.infoValue}>${booking.amount}</Text>
            </View>
          )}

          {booking.transactionId && (
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Transaction</Text>
              <Text style={styles.infoValue}>{booking.transactionId}</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={20} color="#0EA5E9" />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color="#0EA5E9" />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#0EA5E9" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="airplane-outline" size={100} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>No {activeTab} Bookings</Text>
      <Text style={styles.emptyStateText}>
        {isGuest
          ? 'Sign in to view your trips and bookings.'
          : `You don't have any ${activeTab.toLowerCase()} trips.\nWhen you book a trip, it will appear here.`}
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => isGuest ? navigation.navigate('Profile') : navigation.navigate('Home')}
      >
        <Text style={styles.emptyStateButtonText}>
          {isGuest ? 'Sign In' : 'Book a Trip'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0EA5E9', '#0284C7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="briefcase" size={28} color="#FFF" />
            <Text style={styles.headerTitle}>My Trips</Text>
          </View>
          {isGuest ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle" size={36} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        {isGuest && (
          <View style={styles.guestBanner}>
            <Ionicons name="information-circle-outline" size={16} color="#FFF" />
            <Text style={styles.guestText}>Viewing as guest</Text>
          </View>
        )}
      </LinearGradient>

      {/* Segmented Control for Status */}
      <View style={styles.segmentedControl}>
        {['Upcoming', 'Cancelled', 'Past'].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.segment,
              activeTab === tab && styles.segmentActive,
              index === 0 && styles.segmentFirst,
              index === 2 && styles.segmentLast,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.segmentText,
              activeTab === tab && styles.segmentTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filterChipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {['All', 'Flights', 'Hotels', 'Cruise', 'Packages'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Ionicons
                name={
                  filter === 'All' ? 'list' :
                  filter === 'Flights' ? 'airplane' :
                  filter === 'Hotels' ? 'bed' :
                  filter === 'Cruise' ? 'boat' :
                  'gift'
                }
                size={18}
                color={activeFilter === filter ? '#FFF' : '#6B7280'}
              />
              <Text style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.mainContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0EA5E9']}
            tintColor="#0EA5E9"
          />
        }
      >
        {filteredBookings.length > 0 ? (
          <>
            <View style={styles.resultSummary}>
              <Text style={styles.resultText}>
                {filteredBookings.length} {activeTab.toLowerCase()} {filteredBookings.length === 1 ? 'trip' : 'trips'}
              </Text>
              <TouchableOpacity style={styles.sortButton}>
                <Ionicons name="swap-vertical" size={16} color="#6B7280" />
                <Text style={styles.sortText}>Sort</Text>
              </TouchableOpacity>
            </View>
            {filteredBookings.map(renderBookingCard)}
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

      {/* Login Popup Modal */}
      <Modal
        visible={showLoginPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLoginPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLoginPopup(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>

            <Ionicons name="lock-closed-outline" size={64} color="#0ea5e9" style={styles.modalIcon} />

            <Text style={styles.modalTitle}>Please Login</Text>
            <Text style={styles.modalText}>
              You need to be logged in to view your trips and manage your bookings.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={() => {
                  setShowLoginPopup(false);
                  navigation.navigate('Profile');
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>Login Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => setShowLoginPopup(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyTripsScreen;
