module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'add-react-displayname',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@containers': './src/containers',
            '@features': './src/features',
            '@graphql': './src/graphql',
            '@hooks': './src/hooks',
            '@navigators': './src/navigators',
            '@types': './src/types',
            '@utils': './src/utils',
            '@assets': './assets',
          },
        },
      ],

      'react-native-reanimated/plugin',
    ],
  };
};
