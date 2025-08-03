import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EMDRSessionScreen from './src/screens/EMDRSessionScreen';

// Mobile App with all today's improvements
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedTherapist, setSelectedTherapist] = useState<'maria' | 'alistair' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load saved therapist preference
  useEffect(() => {
    loadTherapistPreference();
  }, []);

  const loadTherapistPreference = async () => {
    try {
      const savedTherapist = await AsyncStorage.getItem('selectedTherapist');
      if (savedTherapist) {
        setSelectedTherapist(savedTherapist as 'maria' | 'alistair');
      }
    } catch (error) {
      console.log('No saved therapist preference');
    }
  };

  const saveTherapistPreference = async (therapist: 'maria' | 'alistair') => {
    try {
      await AsyncStorage.setItem('selectedTherapist', therapist);
      setSelectedTherapist(therapist);
    } catch (error) {
      console.error('Failed to save therapist preference');
    }
  };

  const handleTherapistSelection = (therapist: 'maria' | 'alistair') => {
    saveTherapistPreference(therapist);
    Alert.alert(
      'Therapist Selected',
      `You've chosen ${therapist === 'maria' ? 'Maria' : 'Alistair'} as your EMDR therapist.`,
      [{ text: 'Continue', onPress: () => setCurrentScreen('emdr') }]
    );
  };

  const handleStartTrial = () => {
    if (!selectedTherapist) {
      Alert.alert(
        'Select Therapist',
        'Please select a therapist before starting your EMDR journey.'
      );
      return;
    }
    
    if (!isAuthenticated) {
      setCurrentScreen('login');
      return;
    }
    
    setCurrentScreen('emdr');
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>EMDRise 👁️🧠👁️</Text>
        <Text style={styles.tagline}>Professional EMDR Therapy</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose Your Therapist</Text>
        <Text style={styles.cardDescription}>
          Select your preferred EMDR therapist to guide your healing journey
        </Text>
        
        <View style={styles.therapistGrid}>
          <TouchableOpacity 
            style={[
              styles.therapistCard,
              selectedTherapist === 'maria' && styles.selectedTherapist
            ]}
            onPress={() => handleTherapistSelection('maria')}
          >
            <Text style={styles.therapistName}>Maria</Text>
            <Text style={styles.therapistRole}>EMDR Therapist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.therapistCard,
              selectedTherapist === 'alistair' && styles.selectedTherapist
            ]}
            onPress={() => handleTherapistSelection('alistair')}
          >
            <Text style={styles.therapistName}>Alistair</Text>
            <Text style={styles.therapistRole}>EMDR Therapist</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>EMDRise Premium</Text>
        <Text style={styles.price}>£12.99/month after 7-day free trial</Text>
        <Text style={styles.features}>
          • 10 guided EMDR therapy scripts{'\n'}
          • Professional therapist videos{'\n'}
          • Bilateral stimulation (BLS) system{'\n'}
          • Progress tracking & session notes{'\n'}
          • Therapeutic resources library
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.startButton,
            !selectedTherapist && styles.disabledButton
          ]}
          onPress={handleStartTrial}
          disabled={!selectedTherapist}
        >
          <Text style={styles.startButtonText}>
            {selectedTherapist ? 'Start Free Trial' : 'Select Therapist First'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Professional EMDR therapy designed by certified therapists
        </Text>
      </View>
    </ScrollView>
  );

  const renderLoginScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>EMDRise</Text>
        <Text style={styles.tagline}>Sign In to Continue</Text>
      </View>
      
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => {
            setIsAuthenticated(true);
            setCurrentScreen('emdr');
          }}
        >
          <Text style={styles.loginButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.backLink}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEMDRScreen = () => (
    <EMDRSessionScreen 
      therapist={selectedTherapist!}
      onBack={() => setCurrentScreen('home')}
    />
  );

  // Render current screen with StatusBar
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return renderLoginScreen();
      case 'emdr':
        return renderEMDRScreen();
      default:
        return renderHomeScreen();
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#3b82f6',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  therapistGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  therapistCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  selectedTherapist: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  therapistRole: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  features: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blsSection: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  blsNote: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  blsButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  blsButtonText: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
  },
  backLink: {
    color: '#3b82f6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});