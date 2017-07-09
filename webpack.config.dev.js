// webpack.config.dev.js
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    }, {
      test: /\.js?$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'src'), /* exclude: /node_modules/ */
      query: {
        presets: ['stage-2', 'es2015', 'react']
      }
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
}