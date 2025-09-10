import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { EMDRiseColors, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseTypography, EMDRiseStyles } from '../constants/branding';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signInWithEmail, signInWithApple, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password.');
      return;
    }

    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        Alert.alert('Authentication Error', error.message);
        return;
      }

      // Success - navigate to home or previous screen
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await signInWithApple();
      
      if (error) {
        Alert.alert('Apple Sign In Error', error.message);
        return;
      }

      // Success - navigate to home or previous screen
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Apple Sign In failed. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Logo and Title */}
          <View style={styles.titleSection}>
            <Text style={styles.logoText}>EMDRise</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.description}>
              {isSignUp 
                ? 'Start your EMDR therapy journey with professional guidance'
                : 'Continue your healing journey with professional EMDR therapy'
              }
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formSection}>
            {/* Apple Sign In Button */}
            <TouchableOpacity 
              style={styles.appleButton}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Text style={styles.appleButtonText}>
                🍎 {isSignUp ? 'Sign up with Apple' : 'Sign in with Apple'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Form */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={EMDRiseColors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={EMDRiseColors.gray[400]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Email Auth Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Text>
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
              <Text style={styles.toggleText}>
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
            <Text style={styles.footerSubtext}>
              EMDRise is not a substitute for professional mental health care.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.therapeuticBg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  header: {
    paddingTop: EMDRiseSpacing.md,
    paddingBottom: EMDRiseSpacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.primaryBlue,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.xl,
  },
  logoText: {
    fontSize: EMDRiseTypography.fontSize['4xl'],
    fontWeight: EMDRiseTypography.fontWeight.bold,
    color: EMDRiseColors.primaryBlue,
    marginBottom: EMDRiseSpacing.sm,
  },
  subtitle: {
    fontSize: EMDRiseTypography.fontSize['2xl'],
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    color: EMDRiseColors.gray[800],
    marginBottom: EMDRiseSpacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: EMDRiseSpacing.md,
  },
  formSection: {
    flex: 1,
    marginBottom: EMDRiseSpacing.xl,
  },
  appleButton: {
    backgroundColor: EMDRiseColors.black,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.lg,
  },
  appleButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: EMDRiseSpacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: EMDRiseColors.gray[300],
  },
  dividerText: {
    marginHorizontal: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.fontSize.sm,
    color: EMDRiseColors.gray[500],
  },
  inputSection: {
    marginBottom: EMDRiseSpacing.md,
  },
  inputLabel: {
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.medium,
    color: EMDRiseColors.gray[700],
    marginBottom: EMDRiseSpacing.xs,
  },
  input: {
    backgroundColor: EMDRiseColors.white,
    borderWidth: 1,
    borderColor: EMDRiseColors.gray[300],
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.gray[800],
  },
  primaryButton: {
    ...EMDRiseStyles.primaryButton,
    marginTop: EMDRiseSpacing.lg,
    marginBottom: EMDRiseSpacing.md,
  },
  primaryButtonText: {
    ...EMDRiseStyles.primaryButtonText,
  },
  disabledButton: {
    backgroundColor: EMDRiseColors.gray[400],
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.md,
  },
  toggleText: {
    fontSize: EMDRiseTypography.fontSize.base,
    color: EMDRiseColors.primaryBlue,
    fontWeight: EMDRiseTypography.fontWeight.medium,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: EMDRiseColors.gray[200],
  },
  footerText: {
    fontSize: EMDRiseTypography.fontSize.xs,
    color: EMDRiseColors.gray[500],
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: EMDRiseSpacing.xs,
  },
  footerSubtext: {
    fontSize: EMDRiseTypography.fontSize.xs,
    color: EMDRiseColors.gray[400],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});