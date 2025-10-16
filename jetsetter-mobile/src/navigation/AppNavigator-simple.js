import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Simple test screens
const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>🚢 Jetsetterss</Text>
    <Text style={styles.subtitle}>Cruise Booking App</Text>
    <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate('CruiseSearch')}
    >
      <Text style={styles.buttonText}>Test Cruise Search</Text>
    </TouchableOpacity>
  </View>
);

const CruiseSearchScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>🔍 Cruise Search</Text>
    <Text style={styles.subtitle}>Search for cruises</Text>
    <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.buttonText}>Back to Home</Text>
    </TouchableOpacity>
  </View>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CruiseSearch" component={CruiseSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppNavigator;



