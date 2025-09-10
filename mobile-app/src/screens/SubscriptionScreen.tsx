import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { SubscriptionManager } from '../components/SubscriptionManager';

interface SubscriptionScreenProps {
  navigation?: any;
  onSubscriptionActive?: () => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  navigation,
  onSubscriptionActive,
}) => {
  const handleSubscriptionChange = (isActive: boolean) => {
    if (isActive) {
      onSubscriptionActive?.();
      // Navigate to EMDRSession or back to Home
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
      } else {
        navigation?.navigate?.('Home');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EMDRise</Text>
        <Text style={styles.headerSubtitle}>EMDR Therapy Made Simple</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome to your EMDR therapy journey. Choose a plan to get started with 
          professional-guided therapy sessions.
        </Text>

        <View style={styles.features}>
          <Text style={styles.featureTitle}>What's Included:</Text>
          <Text style={styles.feature}>• Complete 10-phase EMDR protocol</Text>
          <Text style={styles.feature}>• Professional therapist guidance</Text>
          <Text style={styles.feature}>• Bilateral stimulation tools</Text>
          <Text style={styles.feature}>• Session progress tracking</Text>
          <Text style={styles.feature}>• 7-day free trial</Text>
        </View>

        <SubscriptionManager onSubscriptionChange={handleSubscriptionChange} />
      </View>

      {navigation?.canGoBack?.() && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  feature: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default SubscriptionScreen;