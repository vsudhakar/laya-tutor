var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: path.join(__dirname, 'app/app.jsx'),

  target: 'electron-main',

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    }]
  },

  output: {
    path: path.join(__dirname, 'built'),
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      'node_modules'
    ]
  },

  plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
  ]
}