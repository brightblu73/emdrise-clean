
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Logo } from '../components/Logo';

interface TermsOfUseScreenProps {
  onBack?: () => void;
}

export default function TermsOfUseScreen({ onBack }: TermsOfUseScreenProps) {
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
            <Text style={styles.title}>Terms &amp; Conditions – EMDRise</Text>
            <Text style={styles.subtitle}>
              <Text style={styles.bold}>Last updated: 04.08.2025</Text>
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Purpose of EMDRise</Text>
              <Text style={styles.bodyText}>
                EMDRise is a self‑guided EMDR‑based tool designed to support emotional processing
                and personal well‑being. It is not a substitute for professional mental health
                care, diagnosis, or treatment. If you are experiencing a mental health emergency
                or crisis, call emergency services (e.g., 999 in the UK, 911 in the US) or seek
                professional help immediately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Eligibility</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>You are 18 years or older and able to consent; OR</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>You are under 18 and using the app with parental supervision and professional guidance.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Subscriptions, Payments, and Refunds</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Subscription pricing is displayed at the point of purchase.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Payments are processed via Apple App Store, Google Play Store, or Stripe.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>All payments are final and non‑refundable, except as required by law or by Apple/Google policies.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Subscriptions auto‑renew unless canceled in your App Store or Google Play settings before the renewal date.</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Use the app responsibly and in a safe environment.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Stop any session immediately if you experience severe distress and contact a mental health professional if needed.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Do not use EMDRise in emergencies or situations requiring urgent mental health intervention.</Text>
              </View>
              <Text style={styles.emphasisText}>You are solely responsible for your well‑being and safety while using EMDRise.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Disclaimer and Waiver of Liability</Text>
              <Text style={styles.bodyText}>
                By using EMDRise, you acknowledge and agree that:
              </Text>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>No medical advice is provided by the app.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>Results may vary; some users may experience emotional discomfort, vivid dreams, or temporary distress.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>You assume full responsibility for your use of the app and its exercises.</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>EMDRise disclaims all liability to the fullest extent permitted by law for emotional or physical reactions, decisions made based on the app, or data loss and technical failures.</Text>
              </View>
              <Text style={styles.emphasisText}>
                If you experience severe distress or a medical emergency, stop using EMDRise and seek professional help immediately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Data and Privacy</Text>
              <Text style={styles.bodyText}>
                We process your personal information according to our Privacy Policy. By using the
                app, you consent to our data handling practices as described in that policy.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
              <Text style={styles.bodyText}>
                EMDRise and its content are the intellectual property of EMDRise and its licensors.
                You may not copy, distribute, or modify the app or its content without our prior
                written consent.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Termination of Access</Text>
              <Text style={styles.bodyText}>
                We may suspend or terminate your access if you violate these Terms, or remove
                content and accounts at our discretion to maintain safety and compliance.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Governing Law</Text>
              <Text style={styles.bodyText}>
                These Terms are governed by the laws of England and Wales, without regard to
                conflict of law principles.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Contact</Text>
              <Text style={styles.bodyText}>
                For any questions or concerns about these Terms, contact:
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
  listText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  bodyText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  emphasisText: {
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    fontSize: 14,
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
