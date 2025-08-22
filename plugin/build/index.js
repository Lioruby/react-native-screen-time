"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");

const withScreenTimeApi = (config) => {
    // Add Screen Time entitlements
    config = (0, config_plugins_1.withEntitlementsPlist)(config, (config) => {
        config.modResults['com.apple.developer.family-controls'] = true;
        config.modResults['com.apple.developer.deviceactivity'] = true;
        config.modResults['com.apple.developer.managedsettings'] = true;
        return config;
    });
    return config;
};

exports.default = (0, config_plugins_1.createRunOncePlugin)(withScreenTimeApi, 'react-native-screen-time-api');