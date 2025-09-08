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

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  TherapistSelection: undefined;
  EMDRSession: undefined;
  Subscription: undefined;
  PrivacyPolicy: undefined;
  TermsOfUse: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}