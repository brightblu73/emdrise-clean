import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthProvider } from './src/providers/AuthProvider';
import { EMDRProvider } from './src/providers/EMDRProvider';
import AppNavigator from './src/navigation/AppNavigator';

export type TherapistType = 'maria' | 'alistair';

export default function App() {
  return (
    <AuthProvider>
      <EMDRProvider>
        <SafeAreaView style={styles.container}>
          <AppNavigator />
        </SafeAreaView>
      </EMDRProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});