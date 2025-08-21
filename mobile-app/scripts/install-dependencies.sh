#!/bin/bash

echo "Installing Apple IAP dependencies for EMDRise mobile app..."

# Navigate to mobile app directory
cd "$(dirname "$0")/.."

# Install dependencies
echo "Running npm install..."
npm install

# Check if EAS CLI is installed globally
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI globally..."
    npm install -g @expo/cli eas-cli
else
    echo "EAS CLI already installed"
fi

echo "Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up your Apple Developer account and App Store Connect"
echo "2. Create subscription products in App Store Connect"
echo "3. Set up RevenueCat account and get API keys"
echo "4. Copy .env.example to .env and add your RevenueCat API keys"
echo "5. Run 'eas build --profile development --platform ios' to create development build"
echo ""
echo "See APPLE_IAP_SETUP.md for detailed setup instructions."