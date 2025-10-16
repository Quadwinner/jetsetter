import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import destinationsData from '../../data/destinations.json';
import cruiseLinesData from '../../data/cruiselines.json';
import styles from './styles/HomeScreen.styles';

// Hero Section with Search - MOVED OUTSIDE to prevent re-creation
const HeroSection = ({
  searchDestination,
  handleDestinationChange,
  searchDate,
  setSearchDate,
  handleSearch,
  searchLoading,
  showSuggestions,
  filteredSuggestions,
  handleSuggestionClick,
  showDatePicker,
  setShowDatePicker,
  dateObject,
  handleDateChange
}) => (
  <ImageBackground
    source={{ uri: 'https://images.unsplash.com/photo-1508515803898-d0ebb8c48291?w=1200' }}
    style={styles.hero}
    imageStyle={styles.heroImage}
  >
    <LinearGradient
      colors={['rgba(0, 102, 178, 0.85)', 'rgba(30, 136, 229, 0.85)']}
      style={styles.heroOverlay}
    >
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>Discover Your Perfect</Text>
        <Text style={styles.heroTitleHighlight}>Cruise Adventure</Text>
        <Text style={styles.heroSubtitle}>
          Explore breathtaking destinations with luxury cruise experiences
        </Text>

        <View style={styles.searchCard}>
          <View style={styles.searchInputGroup}>
            <Ionicons name="location" size={20} color="#0066b2" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Where do you want to go?"
              value={searchDestination}
              onChangeText={handleDestinationChange}
            />
          </View>

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsDropdown}>
              {filteredSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionClick(suggestion)}
                >
                  <Ionicons name="location-outline" size={18} color="#0066b2" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                    <Text style={styles.suggestionCountry}>{suggestion.country}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.searchInputGroup}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#0066b2" style={styles.searchIcon} />
            <Text style={[styles.searchInput, !searchDate && { color: '#94A3B8' }]}>
              {searchDate || 'Select date'}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={dateObject}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={[styles.searchButton, searchLoading && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.searchButtonText}>Searching...</Text>
              </>
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Search Cruises</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  </ImageBackground>
);

const HomeScreen = ({ navigation }) => {
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedCruiseLine, setSelectedCruiseLine] = useState('');
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObject, setDateObject] = useState(new Date());


  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Traveled with Royal Caribbean',
      text: 'The best cruise booking experience I\'ve ever had! Their customer service team went above and beyond to help me find the perfect cruise for my family.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      position: 'Frequent Cruiser',
      text: 'I\'ve booked multiple cruises through this platform and have never been disappointed. The prices are competitive and the booking process is seamless.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      position: 'First-time Cruiser',
      text: 'As someone new to cruising, I appreciated how easy it was to find information and compare options. They made the whole experience stress-free!',
      rating: 5,
    },
  ];

  const handleDestinationChange = (text) => {
    setSearchDestination(text);

    if (text.trim().length >= 2) {
      const suggestions = destinationsData.destinations.filter(dest =>
        dest.name.toLowerCase().includes(text.toLowerCase()) ||
        dest.country.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(suggestions.slice(0, 5));
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchDestination(suggestion.name);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObject(selectedDate);
      setSearchDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleSearch = async () => {
    if (searchDestination.trim()) {
      setSearchLoading(true);
      setShowSuggestions(false);
      try {
        // Import cruise service
        const cruiseService = require('../../services/cruiseService').default;

        // Search for cruises with the destination
        const result = await cruiseService.searchCruises({
          destination: searchDestination.trim(),
          passengers: 2
        });

        if (result.success && result.cruises.length > 0) {
          // Navigate directly to results with search data
          navigation.navigate('CruiseResults', {
            cruises: result.cruises,
            searchParams: { destination: searchDestination.trim(), passengers: 2 }
          });
        } else {
          Alert.alert('No Results', 'No cruises found for that destination. Please try a different search.');
        }
      } catch (error) {
        console.error('Search error:', error);
        Alert.alert('Error', 'Unable to search cruises. Please try again.');
      } finally {
        setSearchLoading(false);
      }
    } else {
      Alert.alert('Search', 'Please enter a destination to search for cruises');
    }
  };

  const handleSubscribe = () => {
    if (subscriptionEmail) {
      Alert.alert('Success', 'Thank you for subscribing!');
      setSubscriptionEmail('');
    }
  };

  const handleContactSubmit = () => {
    if (contactForm.name && contactForm.email && contactForm.message) {
      Alert.alert('Success', 'Your message has been sent!');
      setShowContactForm(false);
      setContactForm({ name: '', email: '', message: '' });
    }
  };

  // Destination Section
  const DestinationSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>EXPLORE BY DESTINATION</Text>
      <Text style={styles.sectionSubtitle}>
        Discover breathtaking destinations and unforgettable experiences
      </Text>

      <View style={styles.destinationsGrid}>
        {destinationsData.destinations.slice(0, 6).map((dest) => (
          <TouchableOpacity key={dest.id} style={styles.destinationCard}>
            <Image source={{ uri: dest.image }} style={styles.destinationImage} />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#ffc107" />
              <Text style={styles.ratingText}>{dest.rating}</Text>
            </View>
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{dest.name}</Text>
              <Text style={styles.destinationPrice}>Starts from ${dest.price}/p.p</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={async () => {
                  const cruiseService = require('../../services/cruiseService').default;
                  const result = await cruiseService.searchCruises({
                    destination: dest.name,
                    passengers: 2
                  });
                  if (result.success && result.cruises.length > 0) {
                    navigation.navigate('CruiseResults', {
                      cruises: result.cruises,
                      searchParams: { destination: dest.name, passengers: 2 }
                    });
                  } else {
                    Alert.alert('No Cruises', `No cruises found for ${dest.name} at the moment.`);
                  }
                }}
              >
                <Text style={styles.bookButtonText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.exploreMore}>
        <Text style={styles.exploreMoreText}>Explore more</Text>
        <Ionicons name="arrow-forward" size={16} color="#0066b2" />
      </TouchableOpacity>
    </View>
  );

  // Cruise Line Section
  const CruiseLineSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>EXPLORE BY CRUISE LINE</Text>
      <Text style={styles.sectionSubtitle}>
        Choose from the world's leading cruise operators
      </Text>

      <View style={styles.cruiseLinesGrid}>
        {cruiseLinesData.cruiseLines.map((cruise) => (
          <TouchableOpacity key={cruise.id} style={styles.cruiseCard}>
            <Image source={{ uri: cruise.image }} style={styles.cruiseImage} />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#ffc107" />
              <Text style={styles.ratingText}>{cruise.rating}</Text>
            </View>
            <View style={styles.cruiseInfo}>
              <Text style={styles.cruiseName}>{cruise.name}</Text>
              <Text style={styles.cruisePrice}>Starts from {cruise.price}/p.p</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={async () => {
                  const cruiseService = require('../../services/cruiseService').default;
                  const result = await cruiseService.searchCruises({
                    cruiseLine: cruise.name,
                    passengers: 2
                  });
                  if (result.success && result.cruises.length > 0) {
                    navigation.navigate('CruiseResults', {
                      cruises: result.cruises,
                      searchParams: { cruiseLine: cruise.name, passengers: 2 }
                    });
                  } else {
                    Alert.alert('No Cruises', `No cruises found for ${cruise.name} at the moment.`);
                  }
                }}
              >
                <Text style={styles.bookButtonText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.exploreMore}>
        <Text style={styles.exploreMoreText}>Explore more</Text>
        <Ionicons name="arrow-forward" size={16} color="#0066b2" />
      </TouchableOpacity>
    </View>
  );

  // Trust Indicators
  const TrustIndicators = () => (
    <View style={styles.trustSection}>
      <Text style={styles.trustTitle}>Trusted by Thousands</Text>
      <View style={styles.trustGrid}>
        <View style={styles.trustItem}>
          <Text style={styles.trustValue}>12K+</Text>
          <Text style={styles.trustLabel}>Happy Customers</Text>
        </View>
        <View style={styles.trustItem}>
          <Text style={styles.trustValue}>150+</Text>
          <Text style={styles.trustLabel}>Destinations</Text>
        </View>
        <View style={styles.trustItem}>
          <Text style={styles.trustValue}>98%</Text>
          <Text style={styles.trustLabel}>Satisfaction Rate</Text>
        </View>
        <View style={styles.trustItem}>
          <Text style={styles.trustValue}>24/7</Text>
          <Text style={styles.trustLabel}>Customer Support</Text>
        </View>
      </View>
    </View>
  );

  // Testimonial Banner
  const TestimonialBanner = () => (
    <LinearGradient
      colors={['#0066b2', '#1e88e5']}
      style={styles.testimonialBanner}
    >
      <Text style={styles.testimonialQuote}>
        "The best cruise booking experience I've ever had!"
      </Text>
      <Text style={styles.testimonialAuthor}>— Sarah Johnson, traveled with Royal Caribbean</Text>
      <View style={styles.testimonialRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons key={star} name="star" size={16} color="#ffc107" />
        ))}
        <Text style={styles.testimonialRatingText}>5.0 from over 3,200 reviews</Text>
      </View>
      <View style={styles.testimonialButtons}>
        <TouchableOpacity
          style={styles.testimonialButton}
          onPress={() => setShowTestimonials(true)}
        >
          <Ionicons name="people" size={16} color="#0066b2" />
          <Text style={styles.testimonialButtonText}>Read Testimonials</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.testimonialButton, styles.testimonialButtonOutline]}
          onPress={() => setShowContactForm(true)}
        >
          <Ionicons name="headset" size={16} color="#fff" />
          <Text style={[styles.testimonialButtonText, { color: '#fff' }]}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // Promo Section
  const PromoSection = () => (
    <View style={styles.promoSection}>
      <View style={styles.promoCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800' }}
          style={styles.promoImage}
        />
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>Limited Time</Text>
        </View>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Summer Cruise Special</Text>
          <Text style={styles.promoText}>
            Book your summer cruise now and get up to 30% off on select destinations. Plus, receive a complimentary beverage package for two.
          </Text>
          <View style={styles.promoFeatures}>
            {['Up to 30% off', 'Free beverage package', 'Flexible cancellation', 'Kids sail free'].map((feature, index) => (
              <View key={index} style={styles.promoFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.promoFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.promoButton}
            onPress={() => navigation.navigate('CruiseSearch')}
          >
            <Text style={styles.promoButtonText}>View Special Offers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Newsletter Section
  const NewsletterSection = () => (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1200' }}
      style={styles.newsletter}
      imageStyle={{ opacity: 0.3 }}
    >
      <LinearGradient
        colors={['rgba(30, 58, 138, 0.9)', 'rgba(30, 64, 175, 0.9)']}
        style={styles.newsletterOverlay}
      >
        <Ionicons name="mail" size={32} color="#fff" />
        <Text style={styles.newsletterTitle}>Stay Updated</Text>
        <Text style={styles.newsletterText}>
          Subscribe to receive the latest cruise deals and travel tips
        </Text>
        <View style={styles.newsletterInput}>
          <TextInput
            style={styles.newsletterTextInput}
            placeholder="Enter your email address"
            placeholderTextColor="#999"
            value={subscriptionEmail}
            onChangeText={setSubscriptionEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.newsletterButton} onPress={handleSubscribe}>
            <Text style={styles.newsletterButtonText}>Subscribe</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );

  // Testimonials Modal
  const TestimonialsModal = () => (
    <Modal
      visible={showTestimonials}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTestimonials(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Customer Testimonials</Text>
            <TouchableOpacity onPress={() => setShowTestimonials(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialPosition}>{testimonial.position}</Text>
                <View style={styles.testimonialStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#ffc107" />
                  ))}
                </View>
                <Text style={styles.testimonialText}>{testimonial.text}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Contact Form Modal
  const ContactFormModal = () => (
    <Modal
      visible={showContactForm}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowContactForm(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contact Support</Text>
            <TouchableOpacity onPress={() => setShowContactForm(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Your Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="John Doe"
                value={contactForm.name}
                onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                placeholder="john@example.com"
                keyboardType="email-address"
                value={contactForm.email}
                onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>How can we help?</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="Please describe your question or issue..."
                multiline
                numberOfLines={4}
                value={contactForm.message}
                onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleContactSubmit}>
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#1E293B' }}>Jetsetters</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={32} color="#0EA5E9" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
        keyboardDismissMode="none"
      >
        <HeroSection
          searchDestination={searchDestination}
          handleDestinationChange={handleDestinationChange}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
          handleSearch={handleSearch}
          searchLoading={searchLoading}
          showSuggestions={showSuggestions}
          filteredSuggestions={filteredSuggestions}
          handleSuggestionClick={handleSuggestionClick}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          dateObject={dateObject}
          handleDateChange={handleDateChange}
        />
      <DestinationSection />
      <CruiseLineSection />
      <TrustIndicators />
      <TestimonialBanner />
      <PromoSection />
      <NewsletterSection />
      <TestimonialsModal />
      <ContactFormModal />
    </ScrollView>
    </View>
  );
};

export default HomeScreen;
