import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBoz4hR3UZV9n-Rr97QFIRAIArHH06TQDU",
  authDomain: "expensetracker-8981f.firebaseapp.com",
  projectId: "expensetracker-8981f",
  storageBucket: "expensetracker-8981f.firebasestorage.app",
  messagingSenderId: "711676683883",
  appId: "1:711676683883:web:a4f0990b0e41cf6245f32e"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);