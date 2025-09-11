import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import EMDRSessionScreen from '../screens/EMDRSessionScreen';
import TherapistSelectionScreen from '../screens/TherapistSelectionScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import PreparationScreen from '../screens/PreparationScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import TherapistDetailScreen from '../screens/TherapistDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  TherapistSelection: undefined;
  EMDRSession: undefined;
  Subscription: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
  Resources: undefined;
  Progress: undefined;
  Assessment: undefined;
  Preparation: undefined;
  Processing: undefined;
  TherapistDetail: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E90FF', // EMDRise primary blue
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="TherapistSelection" 
          component={TherapistSelectionScreen}
          options={{ title: 'Choose Your Therapist' }}
        />
        <Stack.Screen 
          name="EMDRSession" 
          component={EMDRSessionScreen}
          options={{ title: 'EMDR Session', headerShown: false }}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
          options={{ title: 'EMDRise Premium' }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen}
          options={{ title: 'Privacy Policy' }}
        />
        <Stack.Screen 
          name="TermsOfUse" 
          component={TermsOfUseScreen}
          options={{ title: 'Terms of Use' }}
        />
        <Stack.Screen 
          name="Resources" 
          component={ResourcesScreen}
          options={{ title: 'Resources' }}
        />
        <Stack.Screen 
          name="Progress" 
          component={ProgressScreen}
          options={{ title: 'Progress' }}
        />
        <Stack.Screen 
          name="Assessment" 
          component={AssessmentScreen}
          options={{ title: 'EMDR Assessment', headerShown: false }}
        />
        <Stack.Screen 
          name="Preparation" 
          component={PreparationScreen}
          options={{ title: 'EMDR Preparation', headerShown: false }}
        />
        <Stack.Screen 
          name="Processing" 
          component={ProcessingScreen}
          options={{ title: 'EMDR Processing', headerShown: false }}
        />
        <Stack.Screen 
          name="TherapistDetail" 
          component={TherapistDetailScreen}
          options={{ title: 'Meet Your Therapist', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}