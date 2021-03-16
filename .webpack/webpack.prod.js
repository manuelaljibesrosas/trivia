const { merge } = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base');

module.exports = merge(
  baseConfig,
  {
    mode: 'production',
    plugins: [
      new CleanWebpackPlugin(),
      new CompressionPlugin(),
    ],
  },
);
