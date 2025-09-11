import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/providers/AuthProvider';
import { EMDRProvider } from './src/providers/EMDRProvider';
import AppNavigator from './src/navigation/AppNavigator';

// Create a query client with the same configuration as the web version
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export type TherapistType = 'maria' | 'alistair';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EMDRProvider>
          <SafeAreaView style={styles.container}>
            <AppNavigator />
          </SafeAreaView>
        </EMDRProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});