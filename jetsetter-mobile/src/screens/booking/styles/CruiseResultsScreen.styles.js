import { StyleSheet } from 'react-native';
import { COLORS, SCREEN_CONFIG } from '../../../constants/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  searchSummary: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
    ...SCREEN_CONFIG.SHADOW,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 8,
  },
  searchCriteria: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  sortContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    ...SCREEN_CONFIG.SHADOW,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginRight: 8,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: COLORS.WHITE,
  },
  cruiseCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 16,
    overflow: 'hidden',
    ...SCREEN_CONFIG.SHADOW,
  },
  cruiseImage: {
    width: '100%',
    height: 200,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  cruiseContent: {
    padding: 16,
  },
  cruiseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cruiseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    flex: 1,
    marginRight: 8,
  },
  cruisePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  cruiseLine: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 12,
  },
  cruiseDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  destinationsContainer: {
    marginBottom: 12,
  },
  destinationsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  destinations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  destination: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
  },
  bookButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
});

export default styles;



