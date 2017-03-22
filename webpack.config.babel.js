export default {
  entry: './src/index.js',
  output: {
    path: __dirname + './dist',
    filename: 'python-range.umd.js',
    library: 'pythonRange',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
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
};
