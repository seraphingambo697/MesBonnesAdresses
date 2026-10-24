const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    // Nécessaire pour que Firebase charge son bundle React Native
    unstable_enablePackageExports: false,
  },
};

module.exports = mergeConfig(defaultConfig, config);
