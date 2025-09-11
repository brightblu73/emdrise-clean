import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { useEMDR } from '../providers/EMDRProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SessionData {
  id: string;
  phase: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  therapist: 'maria' | 'alistair';
  target?: {
    memory: string;
    initialSuds: number;
    finalSuds: number;
    initialVoc: number;
    finalVoc: number;
  };
  notes?: string;
}

const ProgressScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { currentSession } = useEMDR();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    try {
      // Load session history from AsyncStorage
      const storedSessions = await AsyncStorage.getItem('sessionHistory');
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        setSessions(Array.isArray(parsed) ? parsed : []);
      }

      // Include current session if active
      if (currentSession) {
        setSessions(prev => {
          const filtered = prev.filter(s => s.id !== currentSession.id);
          return [currentSession as SessionData, ...filtered];
        });
      }
    } catch (error) {
      console.error('Error loading session history:', error);
      setSessions([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'In Progress';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  const getProgressPercentage = (phase: number) => {
    return Math.min((phase / 10) * 100, 100);
  };

  const completedSessions = sessions.filter(s => s.status === 'complete');
  const totalProcessingTime = completedSessions.reduce((acc, session) => {
    if (session.startedAt && session.completedAt) {
      const start = new Date(session.startedAt);
      const end = new Date(session.completedAt);
      return acc + (end.getTime() - start.getTime());
    }
    return acc;
  }, 0);

  const averageSudsReduction = completedSessions.length > 0 
    ? completedSessions.reduce((acc, session) => {
        if (session.target?.initialSuds && session.target?.finalSuds !== null) {
          const reduction = ((session.target.initialSuds - session.target.finalSuds) / session.target.initialSuds) * 100;
          return acc + reduction;
        }
        return acc;
      }, 0) / completedSessions.length
    : 0;

  const formatProcessingTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.authMessage}>Please sign in to view your progress.</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Your EMDR Journey</Text>
        <Text style={styles.pageDescription}>
          Track your progress and see how far you've come in your healing journey.
        </Text>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedSessions.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatProcessingTime(totalProcessingTime)}</Text>
            <Text style={styles.statLabel}>Processing Time</Text>
          </View>
        </View>

        {averageSudsReduction > 0 && (
          <View style={styles.reductionCard}>
            <Text style={styles.reductionTitle}>Average SUDS Reduction</Text>
            <Text style={styles.reductionPercentage}>{Math.round(averageSudsReduction)}%</Text>
            <Text style={styles.reductionDescription}>
              This shows how much your distress levels have decreased on average across completed sessions.
            </Text>
          </View>
        )}

        {/* Current Session */}
        {currentSession && (
          <View style={styles.currentSessionCard}>
            <Text style={styles.currentSessionTitle}>Current Session</Text>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionPhase}>Phase {currentSession.phase} of 10</Text>
              <Text style={styles.sessionDate}>
                {formatDate(currentSession.startedAt)}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage(currentSession.phase)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(getProgressPercentage(currentSession.phase))}% Complete
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => navigation.navigate('EMDRSession')}
            >
              <Text style={styles.continueButtonText}>Continue Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Session History */}
        <Text style={styles.sectionTitle}>Session History</Text>
        
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No sessions yet</Text>
            <Text style={styles.emptyStateDescription}>
              Start your first EMDR session to begin tracking your progress.
            </Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => navigation.navigate('TherapistSelection')}
            >
              <Text style={styles.startButtonText}>Start Your Journey</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sessionsContainer}>
            {sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionTitle}>
                    Session with {session.therapist === 'maria' ? 'Maria' : 'Alistair'}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    session.status === 'complete' ? styles.statusComplete : styles.statusInProgress
                  ]}>
                    <Text style={[
                      styles.statusText,
                      session.status === 'complete' ? styles.statusCompleteText : styles.statusInProgressText
                    ]}>
                      {session.status === 'complete' ? 'Completed' : 'In Progress'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionDetail}>
                    📅 {formatDate(session.startedAt)}
                  </Text>
                  <Text style={styles.sessionDetail}>
                    ⏱️ {formatDuration(session.startedAt, session.completedAt)}
                  </Text>
                  <Text style={styles.sessionDetail}>
                    📊 Phase {session.phase} of 10
                  </Text>
                </View>

                {session.target && (
                  <View style={styles.targetInfo}>
                    <Text style={styles.targetTitle}>Target Memory:</Text>
                    <Text style={styles.targetMemory} numberOfLines={2}>
                      {session.target.memory}
                    </Text>
                    {session.status === 'complete' && (
                      <View style={styles.ratingsContainer}>
                        <Text style={styles.ratingText}>
                          SUDS: {session.target.initialSuds} → {session.target.finalSuds}
                        </Text>
                        <Text style={styles.ratingText}>
                          VOC: {session.target.initialVoc} → {session.target.finalVoc}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {session.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesTitle}>Notes:</Text>
                    <Text style={styles.notesText} numberOfLines={3}>
                      {session.notes}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            💡 Progress tracking is for your personal reflection. EMDRise is not a substitute 
            for professional mental health care. Please consult with a licensed therapist 
            for comprehensive treatment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E90FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginTop: 20,
    marginBottom: 8,
  },
  pageDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  reductionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reductionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05A660',
    marginBottom: 8,
  },
  reductionPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#05A660',
    marginBottom: 8,
  },
  reductionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  currentSessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currentSessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionPhase: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#05A660',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  continueButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusComplete: {
    backgroundColor: '#d4edda',
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompleteText: {
    color: '#155724',
  },
  statusInProgressText: {
    color: '#856404',
  },
  sessionDetails: {
    marginTop: 12,
    gap: 4,
  },
  sessionDetail: {
    fontSize: 14,
    color: '#666',
  },
  targetInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  targetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  targetMemory: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  ratingsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingText: {
    fontSize: 12,
    color: '#05A660',
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  disclaimerCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#1E90FF',
    lineHeight: 20,
  },
});

export default ProgressScreen;