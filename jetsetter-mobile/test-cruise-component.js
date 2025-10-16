// Simple test component to verify cruise booking flow
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CruiseTestComponent = ({ navigation }) => {
  const testCruiseFlow = () => {
    console.log('🚢 Testing Cruise Booking Flow...');
    
    // Test navigation to cruise search
    navigation.navigate('CruiseSearch');
    console.log('✅ Navigated to CruiseSearchScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚢 Cruise Booking Test</Text>
      <Text style={styles.subtitle}>Tap to test the complete cruise booking flow</Text>
      
      <TouchableOpacity style={styles.button} onPress={testCruiseFlow}>
        <Text style={styles.buttonText}>Start Cruise Booking Test</Text>
      </TouchableOpacity>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>Test Steps:</Text>
        <Text style={styles.instruction}>1. Search for cruises</Text>
        <Text style={styles.instruction}>2. View results and select a cruise</Text>
        <Text style={styles.instruction}>3. Review cruise details</Text>
        <Text style={styles.instruction}>4. Complete booking form</Text>
        <Text style={styles.instruction}>5. Confirm booking</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
});

export default CruiseTestComponent;



