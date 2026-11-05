// Keep Metro (the Expo app bundler) out of the separate React web preview in web/.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const path = require('path');
const webDir = path.join(__dirname, 'web').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
config.resolver.blockList = [new RegExp(`^${webDir}[\\\\/].*`)];

module.exports = config;
