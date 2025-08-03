import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useEMDR } from '../providers/EMDRProvider';
import { useNavigation } from '@react-navigation/native';

const TherapistSelectionScreen = () => {
  const { selectedTherapist, setSelectedTherapist } = useEMDR();
  const navigation = useNavigation();

  const handleTherapistSelect = (therapist: 'maria' | 'alistair') => {
    setSelectedTherapist(therapist);
  };

  const handleStartTrial = () => {
    if (!selectedTherapist) {
      Alert.alert('Please select a therapist', 'Please select a therapist before starting your EMDR journey.');
      return;
    }
    navigation.navigate('EMDRSession');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Therapist</Text>
          <Text style={styles.subtitle}>
            Select the therapist you'd prefer to guide you through your EMDR sessions
          </Text>
        </View>

        <View style={styles.therapistContainer}>
          {/* Maria */}
          <TouchableOpacity
            style={[
              styles.therapistCard,
              selectedTherapist === 'maria' && styles.selectedCard
            ]}
            onPress={() => handleTherapistSelect('maria')}
          >
            <View style={styles.therapistHeader}>
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
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>Maria</Text>
                <Text style={styles.therapistCredentials}>
                  EMDR Certified • Trauma Specialist
                </Text>
              </View>
            </View>
            
            <View style={styles.therapistDetails}>
              <Text style={styles.detailsTitle}>Approach:</Text>
              <Text style={styles.detailsText}>
                Warm, empathetic, and patient-centered approach to healing. 
                Specializes in creating safe spaces for processing difficult memories.
              </Text>
            </View>

            <View style={styles.specialties}>
              <Text style={styles.specialtiesTitle}>Specialties:</Text>
              <View style={styles.specialtyTags}>
                <Text style={styles.specialtyTag}>Anxiety</Text>
                <Text style={styles.specialtyTag}>PTSD</Text>
                <Text style={styles.specialtyTag}>Depression</Text>
              </View>
            </View>

            {selectedTherapist === 'maria' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Alistair */}
          <TouchableOpacity
            style={[
              styles.therapistCard,
              selectedTherapist === 'alistair' && styles.selectedCard
            ]}
            onPress={() => handleTherapistSelect('alistair')}
          >
            <View style={styles.therapistHeader}>
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
              <View style={styles.therapistInfo}>
                <Text style={styles.therapistName}>Alistair</Text>
                <Text style={styles.therapistCredentials}>
                  EMDR Certified • Clinical Psychologist
                </Text>
              </View>
            </View>
            
            <View style={styles.therapistDetails}>
              <Text style={styles.detailsTitle}>Approach:</Text>
              <Text style={styles.detailsText}>
                Calm, methodical, and supportive therapeutic style. 
                Focuses on building resilience and practical coping strategies.
              </Text>
            </View>

            <View style={styles.specialties}>
              <Text style={styles.specialtiesTitle}>Specialties:</Text>
              <View style={styles.specialtyTags}>
                <Text style={styles.specialtyTag}>Trauma</Text>
                <Text style={styles.specialtyTag}>Phobias</Text>
                <Text style={styles.specialtyTag}>Stress</Text>
              </View>
            </View>

            {selectedTherapist === 'alistair' && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedTherapist && styles.disabledButton
          ]}
          onPress={handleStartTrial}
          disabled={!selectedTherapist}
        >
          <Text style={styles.startButtonText}>
            Start Free Trial
          </Text>
        </TouchableOpacity>

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
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
  therapistContainer: {
    marginBottom: 30,
  },
  therapistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
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
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  therapistRole: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  therapistCredentials: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  therapistDetails: {
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  specialties: {
    marginBottom: 10,
  },
  specialtiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  specialtyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 5,
  },
  selectedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
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

export default TherapistSelectionScreen;