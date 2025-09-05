const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("otf", "ttf");

config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

config.resolver.extraNodeModules = {
	"@": path.resolve(__dirname, "src"),
	"@/assets": path.resolve(__dirname, "assets"),
	"@/components": path.resolve(__dirname, "src/components"),
	"@/utils": path.resolve(__dirname, "src/utils"),
	"@/styles": path.resolve(__dirname, "src/styles"),
	"@/stores": path.resolve(__dirname, "src/stores"),
	"@/hooks": path.resolve(__dirname, "src/hooks"),
	"@/types": path.resolve(__dirname, "src/types/types.ts"),
	"@/props": path.resolve(__dirname, "src/types/props.ts"),
	"@/enums": path.resolve(__dirname, "src/types/enums.ts"),
	"@/constants": path.resolve(__dirname, "src/constants/constants.ts"),
};

config.watchFolders = [
	path.resolve(__dirname, "src"),
	path.resolve(__dirname, "assets"),
];

module.exports = config;
