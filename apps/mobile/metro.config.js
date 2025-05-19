// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");

const path = require("node:path");

const config = withTurborepoManagedCache(
  withNativeWind(getDefaultConfig(__dirname), {
    input: "./src/styles.css",
    configPath: "./tailwind.config.ts",
  }),
);

// Add workspace package resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

// Make sure we can resolve workspace packages
config.watchFolders = [
  path.resolve(__dirname, "../../packages/consts"),
  path.resolve(__dirname, "../../packages/utils"),
  path.resolve(__dirname, "../../packages/templates"),
  path.resolve(__dirname, "../../packages/auth"),
  path.resolve(__dirname, "../../packages/storage"),
];

// XXX: Resolve our exports in workspace packages
// https://github.com/expo/expo/issues/26926
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ["require", "default", "browser"];

// It's possible this line was added to try and fix the phosphor issue.
// You might be able to remove it if the resolveRequest below works.
// Or, keep it if it addresses other aspects. Test thoroughly.
config.resolver.unstable_disablePackageExportsForPackage = (
  config.resolver.unstable_disablePackageExportsForPackage || []
).filter((pkg) => pkg !== "phosphor-react-native");

// Custom resolver for phosphor-react-native
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (
  context,
  moduleName,
  platform,
  ...restArgs
) => {
  if (moduleName === "phosphor-react-native") {
    // Redirect to the ESM version
    return context.resolveRequest(
      { ...context, resolveRequest: originalResolveRequest }, // Pass original context but with original resolveRequest
      "phosphor-react-native/lib/module",
      platform,
      ...restArgs,
    );
  }
  // Fallback to default Metro resolver (or the next one in the chain if previously customized)
  return originalResolveRequest(context, moduleName, platform, ...restArgs);
};

// Fix _interopRequireDefault helper by forcing the correct resolution path
config.resolver.extraNodeModules = {
  "@babel/runtime/helpers/interopRequireDefault": require.resolve(
    "@babel/runtime/helpers/interopRequireDefault",
  ),
};

module.exports = config;

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} metroConfig
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(metroConfig) {
  metroConfig.cacheStores = [
    new FileStore({ root: path.join(__dirname, ".cache/metro") }),
  ];
  return metroConfig;
}
