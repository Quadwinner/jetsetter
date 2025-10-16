import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { logout as logoutAction } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import styles from './styles/ProfileScreen.styles';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
  });
  const [originalData, setOriginalData] = useState({});

  // Load profile data from AsyncStorage
  const loadProfileData = useCallback(async () => {
    try {
      console.log('Loading profile data...');
      const authStatus = await AsyncStorage.getItem('isAuthenticated');
      const isAuth = authStatus === 'true';
      console.log('Is authenticated:', isAuth);
      setIsAuthenticated(isAuth);

      if (isAuth) {
        // Always check Firebase user data first
        const userData = await AsyncStorage.getItem('user');
        console.log('User data from AsyncStorage:', userData);

        if (userData) {
          const user = JSON.parse(userData);
          console.log('Parsed user:', user);

          // Convert Firebase user data to profile format
          const nameParts = (user.displayName || '').split(' ');
          const profileFromFirebase = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: '',
            gender: '',
            dateOfBirth: '',
          };

          // Check if we have additional profile data stored
          const storedProfile = await AsyncStorage.getItem('userProfile');
          if (storedProfile) {
            const savedProfile = JSON.parse(storedProfile);
            // Merge: Keep Firebase auth data but preserve user-edited fields like phone, gender, dob
            const mergedProfile = {
              ...profileFromFirebase,
              phone: savedProfile.phone || '',
              gender: savedProfile.gender || '',
              dateOfBirth: savedProfile.dateOfBirth || '',
            };
            console.log('Setting merged profile data:', mergedProfile);
            setProfileData(mergedProfile);
            setOriginalData(mergedProfile);
            // Update stored profile with latest Firebase data
            await AsyncStorage.setItem('userProfile', JSON.stringify(mergedProfile));
          } else {
            // No stored profile, use Firebase data
            console.log('Setting profile from Firebase:', profileFromFirebase);
            setProfileData(profileFromFirebase);
            setOriginalData(profileFromFirebase);
            await AsyncStorage.setItem('userProfile', JSON.stringify(profileFromFirebase));
          }
        } else {
          // Fallback to stored profile if no Firebase user data
          const storedProfile = await AsyncStorage.getItem('userProfile');
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            console.log('Using stored profile (no Firebase data):', profile);
            setProfileData(profile);
            setOriginalData(profile);
          } else {
            // No data at all
            console.log('No profile found, using default');
            const defaultProfile = {
              firstName: 'User',
              lastName: '',
              email: '',
              phone: '',
              gender: '',
              dateOfBirth: '',
            };
            setProfileData(defaultProfile);
            setOriginalData(defaultProfile);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  // Reload profile data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  // Navigate to login screen
  const handleLogin = async () => {
    // Clear authentication state to trigger navigation to AuthStack
    await AsyncStorage.setItem('isAuthenticated', 'false');
    await AsyncStorage.removeItem('user');
    dispatch(logoutAction());
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Firebase
              await authService.signout();

              // Dispatch logout action to Redux
              dispatch(logoutAction());

              // Clear local state
              await AsyncStorage.removeItem('userProfile');
              setIsAuthenticated(false);
              setProfileData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                gender: '',
                dateOfBirth: '',
              });
              setIsEditing(false);

              Alert.alert('Success', 'Logged out successfully!');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      setOriginalData(profileData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  // Handle reset
  const handleReset = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Render guest view
  const renderGuestView = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={60} style={styles.profileIcon} />
        </View>
        <Text style={styles.userName}>Guest User</Text>
        <View style={styles.guestBadge}>
          <Text style={styles.guestBadgeText}>Not Logged In</Text>
        </View>
      </View>

      <View style={styles.authSection}>
        <Ionicons name="lock-closed-outline" size={64} color="#0ea5e9" style={styles.authIcon} />
        <Text style={styles.authTitle}>Sign In to Your Account</Text>
        <Text style={styles.authText}>
          Access your bookings, manage your profile, and enjoy exclusive benefits by signing in.
        </Text>
        <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#0ea5e9" style={styles.menuItemIcon} />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>Help & Support</Text>
            <Text style={styles.menuItemSubtitle}>Get assistance with your bookings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} style={styles.menuItemArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
          <Ionicons name="information-circle-outline" size={24} color="#0ea5e9" style={styles.menuItemIcon} />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>About</Text>
            <Text style={styles.menuItemSubtitle}>Learn more about Jetsetter</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} style={styles.menuItemArrow} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Render authenticated view
  const renderAuthenticatedView = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={60} style={styles.profileIcon} />
        </View>
        <Text style={styles.userName}>
          {profileData.firstName} {profileData.lastName}
        </Text>
        <Text style={styles.userEmail}>{profileData.email}</Text>
      </View>

      <View style={styles.content}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.firstName}
              onChangeText={(value) => handleFieldChange('firstName', value)}
              editable={isEditing}
              placeholder="Enter first name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.lastName}
              onChangeText={(value) => handleFieldChange('lastName', value)}
              editable={isEditing}
              placeholder="Enter last name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.email}
              onChangeText={(value) => handleFieldChange('email', value)}
              editable={isEditing}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.phone}
              onChangeText={(value) => handleFieldChange('phone', value)}
              editable={isEditing}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  profileData.gender === 'male' && styles.genderButtonActive
                ]}
                onPress={() => isEditing && handleFieldChange('gender', 'male')}
                disabled={!isEditing}
              >
                <Text style={[
                  styles.genderButtonText,
                  profileData.gender === 'male' && styles.genderButtonTextActive
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  profileData.gender === 'female' && styles.genderButtonActive
                ]}
                onPress={() => isEditing && handleFieldChange('gender', 'female')}
                disabled={!isEditing}
              >
                <Text style={[
                  styles.genderButtonText,
                  profileData.gender === 'female' && styles.genderButtonTextActive
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  profileData.gender === 'other' && styles.genderButtonActive
                ]}
                onPress={() => isEditing && handleFieldChange('gender', 'other')}
                disabled={!isEditing}
              >
                <Text style={[
                  styles.genderButtonText,
                  profileData.gender === 'other' && styles.genderButtonTextActive
                ]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.dateOfBirth}
              onChangeText={(value) => handleFieldChange('dateOfBirth', value)}
              editable={isEditing}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Edit/Save Buttons */}
          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#0ea5e9" style={styles.menuItemIcon} />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Notifications</Text>
              <Text style={styles.menuItemSubtitle}>Manage your notification preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} style={styles.menuItemArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-outline" size={24} color="#0ea5e9" style={styles.menuItemIcon} />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Privacy & Security</Text>
              <Text style={styles.menuItemSubtitle}>Control your privacy settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} style={styles.menuItemArrow} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
            <Ionicons name="help-circle-outline" size={24} color="#0ea5e9" style={styles.menuItemIcon} />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
              <Text style={styles.menuItemSubtitle}>Get assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} style={styles.menuItemArrow} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return isAuthenticated ? renderAuthenticatedView() : renderGuestView();
};

export default ProfileScreen;
