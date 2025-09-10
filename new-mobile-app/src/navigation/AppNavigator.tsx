import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../providers/AuthProvider';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import EMDRSessionScreen from '../screens/EMDRSessionScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  EMDRSession: undefined;
  Subscription: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen component
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EMDRSession" component={EMDRSessionScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}