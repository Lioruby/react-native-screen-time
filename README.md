# React Native Screen Time

A React Native Expo module that provides access to iOS Screen Time API for managing app usage, setting time limits, and blocking applications.

## Features

- ✅ Request Screen Time authorization
- ✅ Get authorization status
- ✅ Retrieve screen time reports (today, weekly, monthly, custom date range)
- ✅ Set app time limits
- ✅ Block/unblock applications  
- ✅ Get list of installed applications
- ✅ TypeScript support with full type definitions
- ✅ Expo Config Plugin for automatic setup

## Installation

```bash
npm install react-native-screen-time
# or
yarn add react-native-screen-time
```

### Expo Configuration

Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      "react-native-screen-time"
    ]
  }
}
```

This will automatically configure the required iOS entitlements:
- `com.apple.developer.family-controls`
- `com.apple.developer.deviceactivity` 
- `com.apple.developer.managedsettings`

## Usage

### Basic Usage

```typescript
import { ScreenTimeApi } from 'react-native-screen-time';

// Request authorization
try {
  await ScreenTimeApi.requestAuthorization();
  console.log('Screen Time access granted');
} catch (error) {
  console.error('Authorization failed:', error);
}

// Check authorization status
const isAuthorized = ScreenTimeApi.isAuthorized();
console.log('Is authorized:', isAuthorized);

// Get today's screen time
const todayData = await ScreenTimeApi.getTodayScreenTime();
console.log('Total screen time today:', todayData.totalScreenTime, 'seconds');
```

### Screen Time Reports

```typescript
// Get today's screen time
const today = await ScreenTimeApi.getTodayScreenTime();

// Get weekly screen time
const weekly = await ScreenTimeApi.getWeeklyScreenTime();

// Get monthly screen time  
const monthly = await ScreenTimeApi.getMonthlyScreenTime();

// Get custom date range
const startDate = Date.now() / 1000 - (7 * 24 * 60 * 60); // 7 days ago
const endDate = Date.now() / 1000;
const custom = await ScreenTimeApi.getScreenTimeReport(startDate, endDate);
```

### App Management

```typescript
// Set app time limit (60 minutes for Instagram)
await ScreenTimeApi.setAppTimeLimit('com.burbn.instagram', 60);

// Remove time limit
await ScreenTimeApi.removeAppTimeLimit('com.burbn.instagram');

// Block an application
await ScreenTimeApi.blockApplication('com.facebook.Facebook');

// Unblock an application
await ScreenTimeApi.unblockApplication('com.facebook.Facebook');

// Get installed applications
const apps = await ScreenTimeApi.getInstalledApplications();
console.log('Installed apps:', apps);
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { ScreenTimeApi, AuthorizationStatus } from 'react-native-screen-time';

export function ScreenTimeExample() {
  const [status, setStatus] = useState<AuthorizationStatus>('notDetermined');
  const [screenTime, setScreenTime] = useState(null);
  
  useEffect(() => {
    setStatus(ScreenTimeApi.getAuthorizationStatus());
  }, []);
  
  const requestPermission = async () => {
    try {
      await ScreenTimeApi.requestAuthorization();
      setStatus('approved');
      Alert.alert('Success', 'Screen Time access granted');
    } catch (error) {
      Alert.alert('Error', 'Failed to get Screen Time access');
    }
  };
  
  const getTodayData = async () => {
    try {
      const data = await ScreenTimeApi.getTodayScreenTime();
      setScreenTime(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to get screen time data');
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Text>Authorization Status: {status}</Text>
      
      {status !== 'approved' && (
        <Button title="Request Permission" onPress={requestPermission} />
      )}
      
      {status === 'approved' && (
        <Button title="Get Today's Data" onPress={getTodayData} />
      )}
      
      {screenTime && (
        <Text>Screen Time: {screenTime.totalScreenTime} seconds</Text>
      )}
    </View>
  );
}
```

## API Reference

### ScreenTimeApi

#### Authorization Methods

- `requestAuthorization(): Promise<string>` - Request Screen Time access
- `getAuthorizationStatus(): AuthorizationStatus` - Get current authorization status
- `isAuthorized(): boolean` - Check if authorized (convenience method)

#### Screen Time Reports

- `getScreenTimeReport(startDate: number, endDate: number): Promise<ScreenTimeReport>` - Get report for date range
- `getTodayScreenTime(): Promise<TodayScreenTimeReport>` - Get today's screen time
- `getWeeklyScreenTime(): Promise<ScreenTimeReport>` - Get last 7 days
- `getMonthlyScreenTime(): Promise<ScreenTimeReport>` - Get current month

#### App Management

- `setAppTimeLimit(bundleId: string, timeLimit: number): Promise<string>` - Set time limit (minutes)
- `removeAppTimeLimit(bundleId: string): Promise<string>` - Remove time limit
- `blockApplication(bundleId: string): Promise<string>` - Block app
- `unblockApplication(bundleId: string): Promise<string>` - Unblock app
- `getInstalledApplications(): Promise<InstalledApplication[]>` - Get installed apps

### Types

```typescript
type AuthorizationStatus = 'notDetermined' | 'denied' | 'approved' | 'unknown';

interface ScreenTimeReport {
  totalScreenTime: number; // in seconds
  startDate: number; // Unix timestamp
  endDate: number; // Unix timestamp
  applications: ApplicationUsage[];
  categories: CategoryUsage[];
}

interface TodayScreenTimeReport {
  totalScreenTime: number; // in seconds
  date: number; // Unix timestamp
  apps: ApplicationUsage[];
}

interface ApplicationUsage {
  bundleIdentifier: string;
  displayName: string;
  totalTime: number; // in seconds
  numberOfNotifications?: number;
  numberOfPickups?: number;
}

interface InstalledApplication {
  bundleIdentifier: string;
  displayName: string;
  token?: number;
}
```

## Requirements

- **iOS 15.0+** - Screen Time API requires iOS 15 or later
- **Expo SDK 47+** - For Expo Config Plugin support
- **Physical Device** - Screen Time API doesn't work in iOS Simulator
- **Apple Developer Account** - Required for Screen Time entitlements

## Important Notes

### Platform Support
- **iOS Only**: Screen Time API is exclusive to iOS
- **No Android Support**: Returns errors on Android/Web platforms

### Apple App Store Requirements
- Apps using Screen Time API require special approval from Apple
- You must provide clear justification for Screen Time access
- Follow Apple's guidelines for Screen Time API usage

### Privacy Considerations
- Screen Time data is highly sensitive personal information
- Always explain to users why your app needs this access
- Request permission only when necessary for core functionality
- Consider implementing parental controls if targeting families

### Testing
- Must test on physical iOS devices (iOS Simulator not supported)
- Users must enable Screen Time in device settings
- Authorization dialog only appears once per app installation

## Troubleshooting

### Common Issues

**"Screen Time access not authorized"**
- Call `requestAuthorization()` first
- Check device Settings > Screen Time is enabled
- Verify user granted permission

**"Module not found" or build errors**
- Run `expo prebuild --clean` 
- Ensure iOS deployment target is 15.0+
- Check Xcode version is recent

**Authorization not working**
- Test on physical device only
- Check device has Screen Time enabled
- Reinstall app to reset permission state

**App Store rejection**
- Provide clear justification for Screen Time usage
- Follow Apple's Screen Time API guidelines
- Ensure your use case aligns with intended purposes

## License

MIT