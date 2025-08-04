
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Logo } from '../components/Logo';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

export default function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Logo Header */}
        <View style={styles.logoContainer}>
          <Logo variant="hero" style={styles.logo} />
        </View>

        {/* Main Content Card */}
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>Privacy Policy – EMDRise</Text>
            <Text style={styles.subtitle}>
              <Text style={styles.bold}>Last updated: 04.08.2025</Text>
            </Text>

            <Text style={styles.introText}>
              EMDRise ("we," "our," "us") is committed to protecting your privacy and handling
              your personal information responsibly. By using the EMDRise mobile app and any
              related services (collectively, the "Services"), you agree to the terms of this
              Privacy Policy.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>Account Information:</Text>
                  <Text style={styles.listText}> Email address and any details you provide when creating an account.</Text>
                </View>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>Therapeutic Data:</Text>
                  <Text style={styles.listText}> Self‑entered session notes, progress tracking, and reflections (sensitive personal data).</Text>
                </View>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>Technical and Usage Data:</Text>
                  <Text style={styles.listText}> Device type, operating system, app version, anonymized usage analytics, IP address, and approximate location.</Text>
                </View>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>Payment Information:</Text>
                  <Text style={styles.listText}> Processed via Apple App Store, Google Play Store, or Stripe. We do not store your card details.</Text>
                </View>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <View style={styles.listContent}>
                  <Text style={styles.listLabel}>Communications:</Text>
                  <Text style={styles.listText}> If you opt in, we may send account updates, reminders, or follow‑ups via email or in‑app notifications.</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Provide and maintain the EMDRise app</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Securely store your session history and progress</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Respond to support requests and troubleshoot issues</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Communicate updates, reminders, or relevant information (if opted in)</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Comply with legal obligations</Text>
              </View>
              <Text style={styles.emphasisText}>We do not sell your personal information.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
              <Text style={styles.bodyText}>
                Your data is stored on <Text style={styles.bold}>Supabase</Text>, a GDPR‑compliant cloud platform.
                Data is encrypted in transit and at rest. While we take strong measures to protect
                your data, no system is completely secure. Enter sensitive information thoughtfully.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. International Users and Data Transfers</Text>
              <Text style={styles.bodyText}>
                We follow UK GDPR and EU GDPR principles. If you use EMDRise outside these regions,
                your information may be stored on servers located outside your country. By using
                the app, you consent to this transfer and processing of your data.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Data Retention and Deletion</Text>
              <Text style={styles.bodyText}>
                We retain your data while your account is active or as required by law. You can
                request deletion of your data at any time by contacting
                <Text style={styles.linkText}> support@emdrise.com</Text>.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Your Rights</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Access the information we hold about you</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Request correction or deletion of your data</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Withdraw consent for processing (may limit functionality)</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
              <Text style={styles.bodyText}>
                EMDRise is intended for users aged 18 and over. Users under 18 require parental
                supervision and professional guidance. We do not knowingly collect data from
                children under 13.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Data Breaches</Text>
              <Text style={styles.bodyText}>
                If a breach affects your data, we will notify you and relevant authorities as
                required by law.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
              <Text style={styles.bodyText}>
                We may update this policy to reflect changes in our practices or legal requirements.
                Material updates will be communicated in‑app or via email.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Contact</Text>
              <Text style={styles.bodyText}>
                For any questions about this Privacy Policy, contact us at:
                {'\n'}
                <Text style={styles.contactText}>support@emdrise.com</Text>
              </Text>
            </View>
          </View>
        </View>

        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 24,
    marginBottom: 24,
  },
  cardContent: {
    maxWidth: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 32,
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  introText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#1E90FF',
    marginRight: 8,
    fontSize: 16,
  },
  listContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listLabel: {
    fontWeight: 'bold',
    color: '#1e293b',
    fontSize: 14,
  },
  listText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  bodyText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
  emphasisText: {
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    fontSize: 14,
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  contactText: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
