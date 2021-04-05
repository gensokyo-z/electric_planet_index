module.exports = {
  presets: [
    [
      '@vue/app',
      {
        polyfills: ['es6.string.includes']
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ]
  ]
};
