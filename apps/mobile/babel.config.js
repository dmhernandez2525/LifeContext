module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // TODO-p3: Add 'react-native-reanimated/plugin' back when using advanced animations
    plugins: [],
  };
};


