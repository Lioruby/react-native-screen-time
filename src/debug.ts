import { Platform } from 'react-native';
import { NativeModulesProxy } from 'expo-modules-core';

export function debugModule() {
  console.log('=== React Native Screen Time Debug ===');
  console.log('Platform:', Platform.OS);
  console.log('Available modules in NativeModulesProxy:', Object.keys(NativeModulesProxy));
  console.log('ReactNativeScreenTime available:', !!NativeModulesProxy.ReactNativeScreenTime);
  
  if (NativeModulesProxy.ReactNativeScreenTime) {
    console.log('Module methods:', Object.keys(NativeModulesProxy.ReactNativeScreenTime));
  }
  
  console.log('=== End Debug ===');
}