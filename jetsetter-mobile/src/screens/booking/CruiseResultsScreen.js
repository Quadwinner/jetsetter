import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles/CruiseResultsScreen.styles';

const CruiseResultsScreen = ({ route, navigation }) => {
  const { cruises, searchParams } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('price'); // price, duration, rating
  const [filteredCruises, setFilteredCruises] = useState(cruises);

  const sortCruises = (cruiseList, sortType) => {
    const sorted = [...cruiseList].sort((a, b) => {
      switch (sortType) {
        case 'price':
          return a.priceValue - b.priceValue;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFilteredCruises(sorted);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    sortCruises(filteredCruises, sortType);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, would re-fetch data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSelectCruise = (cruise) => {
    navigation.navigate('CruiseDetails', { cruise });
  };

  const renderCruiseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cruiseCard}
      onPress={() => handleSelectCruise(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cruiseImage}
        resizeMode="cover"
      />
      
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#ffc107" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <View style={styles.cruiseContent}>
        <View style={styles.cruiseHeader}>
          <Text style={styles.cruiseName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cruisePrice}>{item.price}</Text>
        </View>

        <Text style={styles.cruiseLine}>{item.cruiseLine}</Text>
        
        <View style={styles.cruiseDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="boat" size={16} color="#666" />
            <Text style={styles.detailText}>{item.ship}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.detailText}>{item.departurePort}</Text>
          </View>
        </View>

        <View style={styles.destinationsContainer}>
          <Text style={styles.destinationsLabel}>Destinations:</Text>
          <View style={styles.destinations}>
            {item.destinations.slice(0, 3).map((dest, index) => (
              <Text key={index} style={styles.destination}>
                {dest}{index < Math.min(item.destinations.length, 3) - 1 ? ', ' : ''}
              </Text>
            ))}
            {item.destinations.length > 3 && (
              <Text style={styles.destination}>+{item.destinations.length - 3} more</Text>
            )}
          </View>
        </View>

        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleSelectCruise(item)}
        >
          <Text style={styles.bookButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchSummary}>
        <Text style={styles.resultsCount}>
          {filteredCruises.length} cruise{filteredCruises.length !== 1 ? 's' : ''} found
        </Text>
        {searchParams.destination && (
          <Text style={styles.searchCriteria}>
            Destination: {searchParams.destination}
          </Text>
        )}
        {searchParams.departurePort && (
          <Text style={styles.searchCriteria}>
            Port: {searchParams.departurePort}
          </Text>
        )}
        {searchParams.cruiseLine && (
          <Text style={styles.searchCriteria}>
            Line: {searchParams.cruiseLine}
          </Text>
        )}
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
            onPress={() => handleSort('price')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'duration' && styles.sortButtonActive]}
            onPress={() => handleSort('duration')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'duration' && styles.sortButtonTextActive]}>
              Duration
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => handleSort('rating')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="boat-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Cruises Found</Text>
      <Text style={styles.emptyMessage}>
        Try adjusting your search criteria or browse our popular destinations.
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Modify Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066b2" />
          <Text style={styles.backButtonText}>Back to Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCruises}
        renderItem={renderCruiseCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CruiseResultsScreen;



