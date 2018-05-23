const path = require('path');
const webpack = require('webpack');

const port = process.env.PORT || '8080';

const config = {
  context: __dirname,
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './renderer.js'),
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
  ],
  target: 'electron-renderer',
  output: {
    filename: 'renderer.bundle.js',
    path: __dirname + '/bundle',
    publicPath: `http://localhost:${port}/bundle/`,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      
      {

        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'renderer.js')
        ],
        exclude: /node_modules/,

        loader: 'babel-loader',
        
        options: {
          presets: ['env', 'react', 'react-hmre']
        }
      },

      {
        test: /\.css$/,
        include: [
          path.join(__dirname, 'src/styles')
        ],
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }

    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
};

module.exports = config;