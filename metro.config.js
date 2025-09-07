const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("otf", "ttf");

config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

config.watchFolders = [
	path.resolve(__dirname, "src"),
	path.resolve(__dirname, "assets"),
];

module.exports = config;
