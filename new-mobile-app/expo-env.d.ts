/// <reference types="expo/types" />

// Add environment variable types
declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        EXPO_PUBLIC_SUPABASE_URL: string;
        EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
        EXPO_PUBLIC_REVENUECAT_API_KEY: string;
        EXPO_PUBLIC_BUNDLE_ID: string;
        EXPO_PUBLIC_PRODUCT_ID: string;
        EXPO_PUBLIC_MONTHLY_PRICE: string;
        EXPO_PUBLIC_ENVIRONMENT: 'development' | 'staging' | 'production';
      }
    }
  }
}