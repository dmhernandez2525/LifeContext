const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Get the project root and workspace root
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Handle pnpm symlinks
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// Ensure packages can find their dependencies
config.resolver.extraNodeModules = {
  '@expo/metro-runtime': path.resolve(projectRoot, 'node_modules/@expo/metro-runtime'),
  '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),
  // Manually resolve react-native-css-interop imports for web
  'react-native-css-interop': path.resolve(projectRoot, 'node_modules/react-native-css-interop'),
};

module.exports = withNativeWind(config, { input: './global.css' });


