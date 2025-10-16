import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SCREEN_CONFIG } from '../../../constants/config';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  ratingBadge: {
    position: 'absolute',
    top: 200,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.GRAY,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  cruiseInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cruiseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  cruiseLine: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  cruisePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.WHITE,
    ...SCREEN_CONFIG.SHADOW,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: COLORS.LIGHT,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    textAlign: 'center',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  destinationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.DARK,
  },
  includedList: {
    backgroundColor: COLORS.LIGHT,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  includedText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.DARK,
  },
  itineraryDay: {
    backgroundColor: COLORS.LIGHT,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayNumber: {
    backgroundColor: COLORS.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dayNumberText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dayPort: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  dayTimes: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  dayActivities: {
    marginLeft: 76,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.DARK,
  },
  reviewSummary: {
    backgroundColor: COLORS.LIGHT,
    padding: 20,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 20,
    alignItems: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  reviewsList: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: COLORS.LIGHT,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.DARK,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.DARK,
    lineHeight: 20,
  },
  bookingSummary: {
    backgroundColor: COLORS.LIGHT,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.DARK,
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  summaryNote: {
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  bookButtonContainer: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default styles;



