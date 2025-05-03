/** @type {import("@babel/core").ConfigFunction} */
module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { jsxImportSource: "nativewind", runtime: "automatic" },
      ],
      "nativewind/babel",
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
