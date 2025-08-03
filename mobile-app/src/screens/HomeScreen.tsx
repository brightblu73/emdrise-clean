import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { useEMDR } from '../providers/EMDRProvider';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { isAuthenticated, user } = useAuth();
  const { selectedTherapist } = useEMDR();
  const navigation = useNavigation();

  const handleStartSession = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (!selectedTherapist) {
      navigation.navigate('TherapistSelection');
      return;
    }

    navigation.navigate('EMDRSession');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>EMDR👁️👁️ise</Text>
          <Text style={styles.subtitle}>
            Professional EMDR Therapy at Your Fingertips
          </Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          {isAuthenticated ? (
            <Text style={styles.welcomeText}>
              Welcome back, {user?.username}!
            </Text>
          ) : (
            <Text style={styles.welcomeText}>
              Begin your healing journey with EMDR therapy
            </Text>
          )}
        </View>

        {/* Therapist Selection Preview */}
        <View style={styles.therapistPreview}>
          <Text style={styles.sectionTitle}>Choose Your Therapist</Text>
          <View style={styles.therapistOptions}>
            <TouchableOpacity
              style={[
                styles.therapistCard,
                selectedTherapist === 'maria' && styles.selectedCard
              ]}
              onPress={() => navigation.navigate('TherapistSelection')}
            >
              <View style={styles.circularHeadshot}>
                <View style={styles.mariaHeadshot}>
                  <View style={styles.mariaFace}>
                    <View style={styles.mariaHair} />
                    <View style={styles.mariaEyes}>
                      <View style={styles.eye} />
                      <View style={styles.eye} />
                    </View>
                    <View style={styles.mariaNose} />
                    <View style={styles.mariaMouth} />
                  </View>
                  <View style={styles.mariaClothing} />
                </View>
              </View>
              <Text style={styles.therapistName}>Maria</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.therapistCard,
                selectedTherapist === 'alistair' && styles.selectedCard
              ]}
              onPress={() => navigation.navigate('TherapistSelection')}
            >
              <View style={styles.circularHeadshot}>
                <View style={styles.alistairHeadshot}>
                  <View style={styles.alistairFace}>
                    <View style={styles.alistairHair} />
                    <View style={styles.alistairEyes}>
                      <View style={styles.eye} />
                      <View style={styles.eye} />
                    </View>
                    <View style={styles.alistairNose} />
                    <View style={styles.alistairMouth} />
                    <View style={styles.alistairBeard} />
                  </View>
                  <View style={styles.alistairClothing} />
                </View>
              </View>
              <Text style={styles.therapistName}>Alistair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You'll Experience</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <Text style={styles.featureText}>Guided EMDR Protocol</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👁️</Text>
              <Text style={styles.featureText}>Bilateral Stimulation</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💚</Text>
              <Text style={styles.featureText}>Safe Space Creation</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Mobile-First Design</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSession}
        >
          <Text style={styles.startButtonText}>
            {!isAuthenticated
              ? 'Sign In to Begin'
              : !selectedTherapist
              ? 'Select Therapist'
              : 'Continue Your Journey'}
          </Text>
        </TouchableOpacity>

        {/* Trial Info */}
        <View style={styles.trialInfo}>
          <Text style={styles.trialText}>
            7-day free trial • No credit card required
          </Text>
          <Text style={styles.pricingText}>
            Then £12.99/month • Cancel anytime
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 300,
  },
  welcomeSection: {
    backgroundColor: '#e0f2fe',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: '#0369a1',
    textAlign: 'center',
    fontWeight: '600',
  },
  therapistPreview: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    textAlign: 'center',
  },
  therapistOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  therapistCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  therapistAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  therapistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  // Circular headshot container
  circularHeadshot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    borderWidth: 3,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Maria headshot styles
  mariaHeadshot: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mariaFace: {
    width: 45,
    height: 50,
    backgroundColor: '#f4c2a1',
    borderRadius: 22,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  mariaHair: {
    position: 'absolute',
    top: -10,
    left: -8,
    right: -8,
    height: 35,
    backgroundColor: '#8b4513',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  mariaEyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 18,
    marginTop: 8,
  },
  mariaNose: {
    width: 2,
    height: 8,
    backgroundColor: '#e8a87c',
    marginTop: 3,
  },
  mariaMouth: {
    width: 8,
    height: 3,
    backgroundColor: '#d97706',
    borderRadius: 2,
    marginTop: 4,
  },
  mariaClothing: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#2563eb',
  },

  // Alistair headshot styles
  alistairHeadshot: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alistairFace: {
    width: 47,
    height: 52,
    backgroundColor: '#f7d794',
    borderRadius: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  alistairHair: {
    position: 'absolute',
    top: -10,
    left: -8,
    right: -8,
    height: 35,
    backgroundColor: '#4a5568',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  alistairEyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 18,
    marginTop: 8,
  },
  alistairNose: {
    width: 2,
    height: 8,
    backgroundColor: '#e8c078',
    marginTop: 3,
  },
  alistairMouth: {
    width: 8,
    height: 3,
    backgroundColor: '#d97706',
    borderRadius: 2,
    marginTop: 2,
  },
  alistairBeard: {
    width: 25,
    height: 12,
    backgroundColor: '#2d3748',
    borderRadius: 6,
    marginTop: 2,
  },
  alistairClothing: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#059669',
  },

  // Shared eye style
  eye: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2d3748',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trialInfo: {
    alignItems: 'center',
  },
  trialText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 5,
  },
  pricingText: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default HomeScreen;