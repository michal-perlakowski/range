module.exports = function karma(config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      { pattern: 'src/**/*.js', included: false },
      'tests/**/*.js',
    ],
    preprocessors: {
      'tests/**/*.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['latest', {
                  modules: false,
                }],
              ],
              plugins: ['transform-object-rest-spread', 'transform-runtime'],
            },
          },
        ],
      },
      devtool: 'inline-source-map',
    },
    webpackMiddleware: {
      noInfo: 'true',
    },
    reporters: ['mocha'],
    logLevel: config.LOG_WARN,
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome', 'Firefox'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    singleRun: process.env.TRAVIS,
  });
};
