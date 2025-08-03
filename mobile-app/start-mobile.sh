#!/bin/bash
cd mobile-app
echo "Starting EMDRise Mobile App..."
echo "Installing basic dependencies..."
npx expo install
echo "Starting Expo development server..."
npx expo start --web