import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AuthProvider } from './src/providers/AuthProvider';
import { EMDRProvider } from './src/providers/EMDRProvider';
import AppNavigator from './src/navigation/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EMDRProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </EMDRProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}