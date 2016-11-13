export default {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'python-range.umd.js',
    library: 'pythonRange',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            ['env', {
              targets: {
                edge: 12,
                firefox: 42,
                chrome: 49,
                safari: 10,
                node: 6,
              },
              modules: false,
            }],
          ],
          plugins: ['transform-object-rest-spread'],
        },
      },
    ],
  },
};
