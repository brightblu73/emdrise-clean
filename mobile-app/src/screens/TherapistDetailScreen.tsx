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
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';

// Note: In a production app, you would use react-native-video for video playback
// For now, we'll create a placeholder that matches the web functionality
const VideoPlaceholder = () => (
  <View style={styles.videoPlaceholder}>
    <Text style={styles.videoPlaceholderIcon}>🎬</Text>
    <Text style={styles.videoPlaceholderText}>EMDR Introduction Video</Text>
    <Text style={styles.videoPlaceholderSubtext}>
      Learn about EMDR therapy and meet your virtual therapist guide
    </Text>
  </View>
);

export default function TherapistDetailScreen() {
  const { isAuthenticated, user } = useAuth();
  const navigation = useNavigation();

  const handleBeginSession = () => {
    Alert.alert(
      'Begin EMDR Session',
      'Are you ready to start your EMDR therapy session?',
      [
        {
          text: 'Not Yet',
          style: 'cancel',
        },
        {
          text: 'Begin Session',
          onPress: () => navigation.navigate('Processing' as never),
          style: 'default',
        }
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.authMessage}>Please sign in to meet your therapist.</Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login' as never)}
            data-testid="sign-in-button"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meet Your Therapist</Text>
          <Text style={styles.headerSubtitle}>
            Welcome to your EMDR therapy journey
          </Text>
        </View>

        {/* Video Section */}
        <View style={styles.videoCard}>
          <VideoPlaceholder />
        </View>

        {/* Therapist Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your EMDR Guide</Text>
          <Text style={styles.infoText}>
            This video introduction will help you understand what to expect during your EMDR therapy session. 
            EMDR (Eye Movement Desensitization and Reprocessing) is a proven therapy technique that helps 
            process traumatic memories and reduce their emotional impact.
          </Text>
          
          <View style={styles.keyPointsContainer}>
            <Text style={styles.keyPointsTitle}>What you'll learn:</Text>
            <Text style={styles.keyPoint}>• How EMDR therapy works</Text>
            <Text style={styles.keyPoint}>• What to expect during your session</Text>
            <Text style={styles.keyPoint}>• How to prepare mentally</Text>
            <Text style={styles.keyPoint}>• Safety measures and grounding techniques</Text>
          </View>
        </View>

        {/* Session Preparation */}
        <View style={styles.preparationCard}>
          <Text style={styles.preparationTitle}>Before You Begin</Text>
          <Text style={styles.preparationText}>
            Make sure you're in a quiet, comfortable space where you won't be interrupted. 
            Have some water nearby and ensure you have at least 45-60 minutes available 
            for your complete EMDR session.
          </Text>
          
          <View style={styles.checklistContainer}>
            <Text style={styles.checklistTitle}>Session Checklist:</Text>
            <Text style={styles.checklistItem}>✓ Quiet, private space</Text>
            <Text style={styles.checklistItem}>✓ Comfortable seating</Text>
            <Text style={styles.checklistItem}>✓ Water available</Text>
            <Text style={styles.checklistItem}>✓ 45-60 minutes available</Text>
            <Text style={styles.checklistItem}>✓ Phone on silent</Text>
          </View>
        </View>

        {/* Begin Session Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.beginButton}
            onPress={handleBeginSession}
            data-testid="begin-session-button"
          >
            <Text style={styles.beginButtonText}>Begin EMDR Session</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            data-testid="back-button"
          >
            <Text style={styles.backButtonText}>← Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: EMDRiseSpacing.xl,
  },
  authMessage: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  signInButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
  },
  signInButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
  },
  scrollContainer: {
    flex: 1,
    padding: EMDRiseSpacing.lg,
  },
  header: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.xl,
    marginBottom: EMDRiseSpacing.lg,
    alignItems: 'center',
    ...EMDRiseShadows.small,
  },
  headerTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  videoPlaceholder: {
    backgroundColor: EMDRiseColors.muted,
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  videoPlaceholderIcon: {
    fontSize: 48,
    marginBottom: EMDRiseSpacing.md,
  },
  videoPlaceholderText: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
    textAlign: 'center',
  },
  videoPlaceholderSubtext: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
  },
  infoCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  infoTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
  },
  infoText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
    marginBottom: EMDRiseSpacing.lg,
  },
  keyPointsContainer: {
    backgroundColor: EMDRiseColors.primaryBlue + '15',
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
  },
  keyPointsTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  keyPoint: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  preparationCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
    ...EMDRiseShadows.small,
  },
  preparationTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h4,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.md,
  },
  preparationText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.base,
    marginBottom: EMDRiseSpacing.lg,
  },
  checklistContainer: {
    backgroundColor: EMDRiseColors.primaryGreen + '15',
    borderRadius: EMDRiseBorderRadius.lg,
    padding: EMDRiseSpacing.md,
  },
  checklistTitle: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.sm,
  },
  checklistItem: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.primary,
    marginBottom: EMDRiseSpacing.xs,
    lineHeight: EMDRiseTypography.lineHeights.normal * EMDRiseTypography.sizes.body.small,
  },
  buttonContainer: {
    paddingVertical: EMDRiseSpacing.xl,
    gap: EMDRiseSpacing.md,
  },
  beginButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
    ...EMDRiseShadows.medium,
  },
  beginButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.bold,
  },
  backButton: {
    paddingVertical: EMDRiseSpacing.lg,
    borderRadius: EMDRiseBorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  backButtonText: {
    color: EMDRiseColors.text.primary,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
  },
});