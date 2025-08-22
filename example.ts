import { ScreenTimeApi } from 'react-native-screen-time';

// Example usage of the Screen Time API

async function exampleUsage() {
  try {
    // 1. Check if already authorized
    const status = ScreenTimeApi.getAuthorizationStatus();
    console.log('Authorization status:', status);
    
    // 2. Request authorization if needed
    if (status !== 'approved') {
      await ScreenTimeApi.requestAuthorization();
      console.log('Authorization requested');
    }
    
    // 3. Get today's screen time
    const todayData = await ScreenTimeApi.getTodayScreenTime();
    console.log('Today screen time:', todayData);
    
    // 4. Get weekly screen time
    const weeklyData = await ScreenTimeApi.getWeeklyScreenTime();
    console.log('Weekly screen time:', weeklyData);
    
    // 5. Get monthly screen time
    const monthlyData = await ScreenTimeApi.getMonthlyScreenTime();
    console.log('Monthly screen time:', monthlyData);
    
    // 6. Set app time limit (60 minutes for Safari)
    await ScreenTimeApi.setAppTimeLimit('com.apple.mobilesafari', 60);
    console.log('Time limit set for Safari');
    
    // 7. Block an application
    await ScreenTimeApi.blockApplication('com.instagram.app');
    console.log('Instagram blocked');
    
    // 8. Get installed applications
    const installedApps = await ScreenTimeApi.getInstalledApplications();
    console.log('Installed apps:', installedApps);
    
    // 9. Remove time limit
    await ScreenTimeApi.removeAppTimeLimit('com.apple.mobilesafari');
    console.log('Time limit removed for Safari');
    
    // 10. Unblock application
    await ScreenTimeApi.unblockApplication('com.instagram.app');
    console.log('Instagram unblocked');
    
  } catch (error) {
    console.error('Screen Time API error:', error);
  }
}

// React component example
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';

export function ScreenTimeExample() {
  const [authorized, setAuthorized] = useState(false);
  const [screenTime, setScreenTime] = useState(null);
  
  useEffect(() => {
    // Check authorization status on mount
    const status = ScreenTimeApi.getAuthorizationStatus();
    setAuthorized(status === 'approved');
  }, []);
  
  const requestPermission = async () => {
    try {
      await ScreenTimeApi.requestAuthorization();
      setAuthorized(true);
      Alert.alert('Success', 'Screen Time access granted');
    } catch (error) {
      Alert.alert('Error', 'Failed to get Screen Time access');
    }
  };
  
  const getTodayData = async () => {
    if (!authorized) {
      Alert.alert('Error', 'Screen Time access not authorized');
      return;
    }
    
    try {
      const data = await ScreenTimeApi.getTodayScreenTime();
      setScreenTime(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to get screen time data');
    }
  };
  
  const setAppLimit = async () => {
    if (!authorized) {
      Alert.alert('Error', 'Screen Time access not authorized');
      return;
    }
    
    try {
      await ScreenTimeApi.setAppTimeLimit('com.apple.mobilesafari', 30);
      Alert.alert('Success', 'Set 30 minute limit for Safari');
    } catch (error) {
      Alert.alert('Error', 'Failed to set app limit');
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Text>Screen Time Example</Text>
      <Text>Authorized: {authorized ? 'Yes' : 'No'}</Text>
      
      {!authorized && (
        <Button title="Request Permission" onPress={requestPermission} />
      )}
      
      {authorized && (
        <>
          <Button title="Get Today's Data" onPress={getTodayData} />
          <Button title="Set Safari Limit" onPress={setAppLimit} />
          
          {screenTime && (
            <View>
              <Text>Total Screen Time: {screenTime.totalScreenTime} seconds</Text>
              <Text>Apps: {screenTime.apps.length}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}