import { StyleSheet } from 'react-native';
import { COLORS, SCREEN_CONFIG } from '../../../constants/config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
  },
  content: {
    flex: 1,
  },
  successHeader: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  bookingDetails: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
    ...SCREEN_CONFIG.SHADOW,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  detailSubtext: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  passengerSection: {
    padding: 20,
    paddingTop: 0,
  },
  passengerCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginBottom: 12,
    ...SCREEN_CONFIG.SHADOW,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: 2,
  },
  passengerDetails: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  contactSection: {
    padding: 20,
    paddingTop: 0,
  },
  contactCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    ...SCREEN_CONFIG.SHADOW,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  infoSection: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    ...SCREEN_CONFIG.SHADOW,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.DARK,
    lineHeight: 20,
  },
  nextStepsSection: {
    padding: 20,
    paddingTop: 0,
  },
  stepsList: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    ...SCREEN_CONFIG.SHADOW,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.DARK,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
    marginRight: 12,
  },
  secondaryButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SCREEN_CONFIG.BORDER_RADIUS,
  },
  primaryButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  homeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
});

export default styles;



