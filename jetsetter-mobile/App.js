import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { setUser } from './src/store/slices/authSlice';
import authService from './src/services/authService';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication state on app load
    const checkAuthState = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        const user = await authService.getCurrentUser();

        if (isAuthenticated && user) {
          dispatch(setUser(user));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error('Auth state check error:', error);
        dispatch(setUser(null));
      }
    };

    checkAuthState();

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
