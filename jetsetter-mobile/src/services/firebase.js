import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDQRZgBAkv6rfSqtJUQk6jLY56ftz0eEMg',
  authDomain: 'jets-1b5fa.firebaseapp.com',
  projectId: 'jets-1b5fa',
  storageBucket: 'jets-1b5fa.firebasestorage.app',
  messagingSenderId: '84512959275',
  appId: '1:84512959275:web:ea8a029a10024492dab36e',
};

const app = initializeApp(firebaseConfig);

// Initialize Auth for React Native
export const auth = getAuth(app);

export default app;
