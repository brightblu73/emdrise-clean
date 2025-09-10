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
import { useAuth } from '../providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { EMDRiseColors, EMDRiseStyles, EMDRiseSpacing, EMDRiseBorderRadius, EMDRiseShadows, EMDRiseTypography } from '../constants/branding';

// EMDRise Logo Component for mobile
const Logo = ({ variant = 'hero' }: { variant?: 'hero' | 'header' }) => (
  <View style={[styles.logoContainer, variant === 'header' && styles.logoHeader]}>
    <Text style={[styles.logoText, variant === 'header' && styles.logoTextHeader]}>EMDRise</Text>
    <Text style={[styles.logoTagline, variant === 'header' && styles.logoTaglineHeader]}>Healing Together</Text>
  </View>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signUp, signInWithApple } = useAuth();
  const navigation = useNavigation();

  // Sign In handler (for existing users)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting sign in process for:', email);
      const { error } = await signInWithEmail(email, password);
      if (!error) {
        console.log('Login successful, redirecting to homepage...');
        navigation.navigate('Home');
      } else {
        console.error('Login error:', error);
        Alert.alert('Error', error.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login exception:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up handler (for new users starting trial)
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting sign up process for:', email);
      const { error } = await signUp(email, password);
      if (!error) {
        Alert.alert(
          'Check Your Email',
          'Please check your email to verify your account. After verification, you\'ll be redirected to complete your trial setup.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('Sign up error:', error);
        Alert.alert('Error', error.message || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      Alert.alert('Error', 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apple Sign In handler
  const handleAppleSignIn = async () => {
    try {
      const { error } = await signInWithApple();
      if (error) {
        console.error('Apple sign in error:', error);
        Alert.alert('Error', 'Apple Sign In is not yet available. Please use email sign in.');
      }
    } catch (error) {
      console.error('Apple sign in failed:', error);
      Alert.alert('Error', 'Sign in failed. Please try email sign in.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Logo and Tagline */}
            <View style={styles.header}>
              <Logo variant="hero" />
              <Text style={styles.tagline}>Begin your journey to emotional freedom</Text>
            </View>

            {/* Main Auth Card */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Start Your 7-Day Free Trial</Text>
                <Text style={styles.cardSubtitle}>Choose your sign-in method</Text>
              </View>

              <View style={styles.cardContent}>
                {/* Apple Sign In Button */}
                <TouchableOpacity
                  style={styles.appleButton}
                  onPress={handleAppleSignIn}
                >
                  <Text style={styles.appleIcon}>🍎</Text>
                  <Text style={styles.appleButtonText}>Sign in with Apple</Text>
                </TouchableOpacity>

                {/* Email Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR CONTINUE WITH EMAIL</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Email and Password Form */}
                <View style={styles.emailForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Create Account / Start Free Trial Button */}
                  <TouchableOpacity
                    style={[styles.gradientButton, isLoading && styles.disabledButton]}
                    onPress={handleSignUp}
                    disabled={isLoading}
                  >
                    <Text style={styles.gradientButtonText}>
                      {isLoading ? 'Creating Account...' : 'Create Account / Start Free Trial'}
                    </Text>
                  </TouchableOpacity>

                  {/* Sign In Separator */}
                  <View style={styles.signInSeparator}>
                    <Text style={styles.signInText}>Already have an account? Sign in below.</Text>
                  </View>

                  {/* Sign In Button */}
                  <TouchableOpacity
                    style={[styles.gradientButton, isLoading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Text style={styles.gradientButtonText}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMDRiseColors.safeSpace, // Safe space background per brand guidelines
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: EMDRiseSpacing.xl,
    paddingVertical: EMDRiseSpacing['4xl'],
  },
  
  // Header with Logo
  header: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing['3xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: EMDRiseSpacing.lg,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: EMDRiseTypography.sizes.heading.h1,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.primaryBlue,
  },
  logoTextHeader: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    marginRight: EMDRiseSpacing.sm,
  },
  logoTagline: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.primaryBlue,
    marginTop: EMDRiseSpacing.xs,
  },
  logoTaglineHeader: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    marginTop: 0,
  },
  tagline: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  
  // Auth Card
  authCard: {
    backgroundColor: EMDRiseColors.card,
    borderRadius: EMDRiseBorderRadius.xl,
    padding: EMDRiseSpacing['2xl'],
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    ...EMDRiseShadows.medium,
  },
  cardHeader: {
    marginBottom: EMDRiseSpacing.xl,
  },
  cardTitle: {
    fontSize: EMDRiseTypography.sizes.heading.h2,
    fontWeight: EMDRiseTypography.weights.bold,
    color: EMDRiseColors.text.primary,
    textAlign: 'center',
    marginBottom: EMDRiseSpacing.sm,
  },
  cardSubtitle: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
  cardContent: {
    gap: EMDRiseSpacing.lg,
  },
  
  // Apple Sign In Button
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  appleIcon: {
    fontSize: 16,
    marginRight: EMDRiseSpacing.sm,
  },
  appleButtonText: {
    fontSize: EMDRiseTypography.sizes.body.base,
    color: EMDRiseColors.text.primary,
    fontWeight: EMDRiseTypography.weights.medium,
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: EMDRiseSpacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: EMDRiseColors.border,
  },
  dividerText: {
    fontSize: EMDRiseTypography.sizes.body.tiny,
    color: EMDRiseColors.text.muted,
    paddingHorizontal: EMDRiseSpacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Email Form
  emailForm: {
    gap: EMDRiseSpacing.lg,
  },
  inputContainer: {
    gap: EMDRiseSpacing.sm,
  },
  label: {
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.medium,
    color: EMDRiseColors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: EMDRiseColors.border,
    borderRadius: EMDRiseBorderRadius.lg,
    paddingHorizontal: EMDRiseSpacing.lg,
    paddingVertical: EMDRiseSpacing.md,
    fontSize: EMDRiseTypography.sizes.body.base,
    backgroundColor: EMDRiseColors.therapeuticBg,
    color: EMDRiseColors.text.primary,
  },
  
  // Gradient Buttons (matching web EMDR gradient)
  gradientButton: {
    backgroundColor: EMDRiseColors.primaryBlue, // Fallback color
    borderRadius: EMDRiseBorderRadius.xl,
    paddingVertical: EMDRiseSpacing.lg,
    paddingHorizontal: EMDRiseSpacing.xl,
    alignItems: 'center',
    ...EMDRiseShadows.medium,
    // Note: In production, this would use LinearGradient component
    // background: linear-gradient(135deg, var(--primary-blue), var(--primary-green))
  },
  disabledButton: {
    opacity: 0.6,
  },
  gradientButtonText: {
    color: EMDRiseColors.text.white,
    fontSize: EMDRiseTypography.sizes.body.base,
    fontWeight: EMDRiseTypography.weights.semibold,
    textAlign: 'center',
  },
  
  // Sign In Separator
  signInSeparator: {
    alignItems: 'center',
    paddingVertical: EMDRiseSpacing.sm,
  },
  signInText: {
    fontSize: EMDRiseTypography.sizes.body.small,
    color: EMDRiseColors.text.secondary,
    textAlign: 'center',
  },
});

export default LoginScreen;