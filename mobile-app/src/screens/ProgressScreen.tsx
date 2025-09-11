import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { EMDRiseColors, EMDRiseTypography, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows } from '../constants/branding';

interface SessionData {
  id: number;
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

interface TargetData {
  id: number;
  memory: string;
  initialSuds: number;
  finalSuds: number | null;
  initialVoc: number;
  finalVoc: number | null;
  status: string;
  createdAt: string;
}

interface TabProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const { width } = Dimensions.get('window');

const TabButton: React.FC<TabProps> = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.activeTabButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

const MetricCard: React.FC<{ icon: string; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <View style={[styles.metricIcon, { backgroundColor: color }]}>
      <Text style={styles.metricIconText}>{icon}</Text>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const ProgressBar: React.FC<{ value: number; height?: number; color?: string }> = ({ value, height = 6, color = EMDRiseColors.primaryGreen }) => (
  <View style={[styles.progressBarContainer, { height }]}>
    <View style={[styles.progressBarFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} />
  </View>
);

const LoadingSpinner: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={EMDRiseColors.primaryBlue} />
  </View>
);

const ProgressScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // React Query for data fetching - matching web version exactly
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/sessions'],
    enabled: !!user,
    queryFn: () => {
      // For now, return empty array - this will be connected to actual API later
      return [];
    }
  });

  const { data: targetsData, isLoading: targetsLoading } = useQuery({
    queryKey: ['/api/targets'],
    enabled: !!user,
    queryFn: () => {
      // For now, return empty array - this will be connected to actual API later
      return [];
    }
  });

  const sessions = (sessionsData as SessionData[]) || [];
  const targets = (targetsData as TargetData[]) || [];
  const isLoading = sessionsLoading || targetsLoading;

  // Calculate metrics - matching web version exactly
  const completedSessions = sessions.filter((s) => s.status === 'complete');
  const totalProcessingTime = completedSessions.reduce((acc: number, session: SessionData) => {
    if (session.startedAt && session.completedAt) {
      const start = new Date(session.startedAt);
      const end = new Date(session.completedAt);
      return acc + (end.getTime() - start.getTime());
    }
    return acc;
  }, 0);

  const averageSudsReduction = targets.length > 0 
    ? targets.reduce((acc: number, target: TargetData) => {
        if (target.initialSuds && target.finalSuds !== null) {
          const reduction = ((target.initialSuds - target.finalSuds) / target.initialSuds) * 100;
          return acc + reduction;
        }
        return acc;
      }, 0) / targets.filter((t: TargetData) => t.finalSuds !== null).length
    : 0;

  const daysInTherapy = user && user.createdAt 
    ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatProcessingTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return renderOverviewTab();
      case 'sessions':
        return renderSessionsTab();
      case 'insights':
        return renderInsightsTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Progress Overview - 4-card grid */}
      <View style={styles.metricsGrid}>
        <MetricCard
          icon="🎯"
          value={completedSessions.length.toString()}
          label="Sessions Completed"
          color={EMDRiseColors.primaryBlue}
        />
        <MetricCard
          icon="📈"
          value={`${Math.round(averageSudsReduction)}%`}
          label="Average SUDS Reduction"
          color={EMDRiseColors.primaryGreen}
        />
        <MetricCard
          icon="🧠"
          value={targets.length.toString()}
          label="Targets Processed"
          color={EMDRiseColors.secondaryBlue}
        />
        <MetricCard
          icon="📅"
          value={daysInTherapy.toString()}
          label="Days of Healing"
          color={EMDRiseColors.warmAccent}
        />
      </View>

      {/* Current Session Progress */}
      {/* Weekly Progress Goals */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>This Week's Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Sessions Goal</Text>
              <Text style={styles.progressValue}>2/3</Text>
            </View>
            <ProgressBar value={67} />
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Practice Minutes</Text>
              <Text style={styles.progressValue}>45/60</Text>
            </View>
            <ProgressBar value={75} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderSessionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recent Sessions</Text>
      {isLoading ? (
        <LoadingSpinner />
      ) : sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No sessions yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start your first EMDR session to begin tracking your progress.
          </Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('TherapistSelection' as never)}
          >
            <Text style={styles.startButtonText}>Start Your First Session</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.sessionsList}>
          {sessions.slice(0, 10).map((session: SessionData) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionTitleContainer}>
                  <Text style={styles.sessionTitle} numberOfLines={2}>
                    {session.target?.memory ? 
                      session.target.memory.substring(0, 50) + (session.target.memory.length > 50 ? '...' : '') :
                      `Session ${session.id}`
                    }
                  </Text>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.startedAt)}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  session.status === 'complete' ? styles.statusComplete : styles.statusInProgress
                ]}>
                  <Text style={[
                    styles.statusText,
                    session.status === 'complete' ? styles.statusCompleteText : styles.statusInProgressText
                  ]}>
                    {session.status === 'complete' ? '✓ Complete' : 'In Progress'}
                  </Text>
                </View>
              </View>
              
              {session.target && (
                <View style={styles.sessionMetrics}>
                  {session.target.initialSuds !== undefined && session.target.finalSuds !== undefined && (
                    <Text style={styles.metricText}>
                      SUDS: {session.target.initialSuds} → {session.target.finalSuds}
                    </Text>
                  )}
                  {session.target.initialVoc !== undefined && session.target.finalVoc !== undefined && (
                    <Text style={styles.metricText}>
                      VOC: {session.target.initialVoc} → {session.target.finalVoc}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderInsightsTab = () => (
    <View style={styles.tabContent}>
      {/* Subscription Status */}
      <View style={styles.subscriptionCard}>
        <Text style={styles.sectionTitle}>Subscription Status</Text>
        <View style={styles.subscriptionDetails}>
          <View style={styles.subscriptionRow}>
            <Text style={styles.subscriptionLabel}>Status</Text>
            <View style={[
              styles.subscriptionBadge,
              user?.subscriptionStatus === 'active' ? styles.subscriptionActive : styles.subscriptionTrial
            ]}>
              <Text style={[
                styles.subscriptionBadgeText,
                user?.subscriptionStatus === 'active' ? styles.subscriptionActiveText : styles.subscriptionTrialText
              ]}>
                {user?.subscriptionStatus === 'trial' ? 'Free Trial' :
                 user?.subscriptionStatus === 'active' ? 'Active' :
                 user?.subscriptionStatus || 'Unknown'}
              </Text>
            </View>
          </View>
          
          {user?.subscriptionStatus === 'trial' && user?.trialEndsAt && (
            <View style={styles.subscriptionRow}>
              <Text style={styles.subscriptionLabel}>Trial Ends</Text>
              <Text style={styles.subscriptionValue}>
                {formatDate(user.trialEndsAt)}
              </Text>
            </View>
          )}
          
          {user?.subscriptionStatus === 'trial' && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('Subscription' as never)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('TherapistSelection' as never)}
          >
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionText}>Start New Session</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Resources' as never)}
          >
            <Text style={styles.quickActionIcon}>🧠</Text>
            <Text style={styles.quickActionText}>Manage Resources</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>✅</Text>
            <Text style={styles.quickActionText}>New Assessment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Authentication guard - matching web version exactly
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authCard}>
            <Text style={styles.authMessage}>Please sign in to view your progress.</Text>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Main render - matching web version exactly
  return (
    <SafeAreaView style={styles.container}>
      {/* Header - matching web version */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Page Header - matching web version */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Your Healing Journey</Text>
          <Text style={styles.pageDescription}>
            Track your progress and celebrate your growth
          </Text>
        </View>

        {/* Tab Navigation - matching web version */}
        <View style={styles.tabContainer}>
          <TabButton
            title="Overview"
            isActive={selectedTab === 'overview'}
            onPress={() => setSelectedTab('overview')}
          />
          <TabButton
            title="Sessions"
            isActive={selectedTab === 'sessions'}
            onPress={() => setSelectedTab('sessions')}
          />
          <TabButton
            title="Insights"
            isActive={selectedTab === 'insights'}
            onPress={() => setSelectedTab('insights')}
          />
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Disclaimer - matching web version */}
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

export default ProgressScreen;

const styles = StyleSheet.create({
  // Main Container - matching web version
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },

  // Header Styles - matching web navigation
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.md,
    backgroundColor: EMDRiseColors.primaryBlue,
    ...EMDRiseShadows.medium,
  },
  backButton: {
    marginRight: EMDRiseSpacing.lg,
  },
  backButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  headerTitle: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.bold,
  },

  // Content Area
  content: {
    flex: 1,
    paddingHorizontal: EMDRiseSpacing.lg,
  },

  // Page Header - matching web version
  pageHeader: {
    marginTop: EMDRiseSpacing.xl,
    marginBottom: EMDRiseSpacing['2xl'],
  },
  pageTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  pageDescription: {
    fontSize: EMDRiseTypography.sizes.body.large,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.sizes.body.large * EMDRiseTypography.lineHeights.relaxed,
  },

  // Authentication Guard
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: EMDRiseSpacing['3xl'],
  },
  authCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    alignItems: 'center',
  },
  authMessage: {
    fontSize: EMDRiseTypography.sizes.body.large,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing['2xl'],
  },
  signInButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing['3xl'],
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    ...EMDRiseShadows.medium,
  },
  signInButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.bold,
  },

  // Tab Navigation - web equivalent
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.xs,
    marginBottom: EMDRiseSpacing['2xl'],
    ...EMDRiseShadows.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    ...EMDRiseShadows.small,
  },
  tabText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.secondary,
  },
  activeTabText: {
    color: EMDRiseColors.text.white,
    fontWeight: EMDRiseTypography.weights.semibold,
  },

  // Tab Content Area
  tabContent: {
    flex: 1,
    marginBottom: EMDRiseSpacing['2xl'],
  },

  // Metrics Grid (4-card overview)
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: EMDRiseSpacing['2xl'],
  },
  metricCard: {
    width: (width - EMDRiseSpacing.lg * 2 - EMDRiseSpacing.md) / 2,
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
    borderLeftWidth: 4,
    ...EMDRiseShadows.medium,
  },
  metricIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  metricIconText: {
    fontSize: 28,
  },
  metricValue: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  metricLabel: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },

  // Progress Section
  progressSection: {
    marginBottom: EMDRiseSpacing['2xl'],
  },
  progressCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  progressItem: {
    marginBottom: EMDRiseSpacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  progressLabel: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
  },
  progressValue: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
  },

  // Progress Bar Component
  progressBarContainer: {
    backgroundColor: EMDRiseColors.muted,
    borderRadius: EMDRiseBorderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: EMDRiseBorderRadius.sm,
  },

  // Loading Component
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing['4xl'],
  },

  // Section Titles
  sectionTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.lg,
  },

  // Empty State
  emptyState: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['3xl'],
    alignItems: 'center',
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  emptyStateTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h3,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.secondary,
    marginBottom: EMDRiseSpacing.sm,
  },
  emptyStateDescription: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing['2xl'],
    lineHeight: EMDRiseTypography.sizes.body.base * EMDRiseTypography.lineHeights.relaxed,
  },
  startButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing['2xl'],
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    ...EMDRiseShadows.medium,
  },
  startButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.bold,
  },

  // Sessions List
  sessionsList: {
    flex: 1,
  },

  // Session Cards - matching web styling
  sessionCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: EMDRiseSpacing.md,
  },
  sessionTitleContainer: {
    flex: 1,
    marginRight: EMDRiseSpacing.md,
  },
  sessionTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
  },
  sessionDate: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.muted,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: EMDRiseSpacing.sm,
    paddingVertical: EMDRiseSpacing.xs,
    borderRadius: EMDRiseBorderRadius.full,
  },
  statusComplete: {
    backgroundColor: EMDRiseColors.safeSpace,
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  statusCompleteText: {
    color: EMDRiseColors.primaryGreen,
  },
  statusInProgressText: {
    color: EMDRiseColors.warmAccent,
  },

  // Session Metrics
  sessionMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EMDRiseSpacing.lg,
  },
  metricText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
  },

  // Subscription Card
  subscriptionCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    marginBottom: EMDRiseSpacing['2xl'],
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  subscriptionDetails: {
    gap: EMDRiseSpacing.md,
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
  },
  subscriptionValue: {
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
  },
  subscriptionBadge: {
    paddingHorizontal: EMDRiseSpacing.sm,
    paddingVertical: EMDRiseSpacing.xs,
    borderRadius: EMDRiseBorderRadius.full,
  },
  subscriptionActive: {
    backgroundColor: EMDRiseColors.safeSpace,
  },
  subscriptionTrial: {
    backgroundColor: '#fff3cd',
  },
  subscriptionBadgeText: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  subscriptionActiveText: {
    color: EMDRiseColors.primaryGreen,
  },
  subscriptionTrialText: {
    color: EMDRiseColors.warmAccent,
  },
  upgradeButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.md,
    borderRadius: EMDRiseBorderRadius.lg,
    marginTop: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  upgradeButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.small,
    fontWeight: EMDRiseTypography.weights.semibold,
    textAlign: 'center',
  },

  // Quick Actions
  quickActionsCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    marginBottom: EMDRiseSpacing['2xl'],
    ...EMDRiseShadows.medium,
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
  },
  quickActionsGrid: {
    gap: EMDRiseSpacing.md,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: EMDRiseSpacing.md,
  },
  quickActionText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
  },

  // Disclaimer Card - matching web version
  disclaimerCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing['3xl'],
    borderLeftWidth: 4,
    borderLeftColor: EMDRiseColors.primaryBlue,
  },
  disclaimerText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.primaryBlue,
    lineHeight: EMDRiseTypography.sizes.body.small * EMDRiseTypography.lineHeights.relaxed,
  },
});

export default ProgressScreen;