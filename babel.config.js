module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // 또는 ['module:metro-react-native-babel-preset']
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true
        }
      ]
    ]
  };
};
