import { ConfigPlugin, createRunOncePlugin, withEntitlementsPlist } from '@expo/config-plugins';

const withScreenTime: ConfigPlugin = (config) => {
  // Add Screen Time entitlements
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.family-controls'] = true;
    config.modResults['com.apple.developer.deviceactivity'] = true;
    config.modResults['com.apple.developer.managedsettings'] = true;
    
    return config;
  });

  return config;
};

export default createRunOncePlugin(withScreenTime, 'react-native-screen-time');