import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/config';
import supabase from './supabase';

// Create axios instance with backend API
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class APIAuthService {
  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { data } = await api.post('/register', userData);

      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('isAuthenticated', 'true');
      }

      return { success: true, user: data.user, token: data.token };
    } catch (error) {
      console.error('API Register error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const { data } = await api.post('/login', { email, password });

      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('isAuthenticated', 'true');
      }

      return { success: true, user: data.user, token: data.token };
    } catch (error) {
      console.error('API Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/logout');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('isAuthenticated', 'false');

      // Also sign out from Supabase
      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('API Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data } = await api.get('/me');
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Get current user error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    try {
      const { data } = await api.post('/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  }
}

export default new APIAuthService();
