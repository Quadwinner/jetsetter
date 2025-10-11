import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },

  // Sort Options
  sortContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#0EA5E9',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },

  // Results Count
  resultsCount: {
    fontSize: 14,
    color: '#64748B',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Flight List
  scrollView: {
    flex: 1,
  },
  flightCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  stopsText: {
    fontSize: 14,
    color: '#64748B',
  },

  // Route
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routePoint: {
    flex: 1,
  },
  airportCode: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#64748B',
  },
  flightPath: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  pathLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#CBD5E1',
  },
  planeIcon: {
    marginHorizontal: 8,
    transform: [{ rotate: '90deg' }],
  },
  durationText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },

  // Stops
  stopsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  stopsDetails: {
    fontSize: 13,
    color: '#64748B',
  },

  // Price
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0EA5E9',
    marginBottom: 2,
  },
  perPersonText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  selectButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  bottomPadding: {
    height: 20,
  },
});
