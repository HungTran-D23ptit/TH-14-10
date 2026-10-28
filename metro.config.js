const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_conditionNames = ['react-native', 'browser'];

module.exports = mergeConfig(defaultConfig, {});
