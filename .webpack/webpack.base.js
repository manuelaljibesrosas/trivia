const { resolve } = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackTemplate = require('html-webpack-template');

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, '..', 'src', 'main.tsx'),
  output: {
    filename: '[name].js',
    path: resolve(__dirname, '..', 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: fs.readdirSync(
      resolve(__dirname, '..', 'src'),
      { withFileTypes: true },
    )
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .reduce((acc, cur) => {
        acc[cur] = resolve(__dirname, '..', 'src', cur);
        return acc;
      }, {}),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            '@babel/proposal-class-properties',
          ],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: htmlWebpackTemplate,
      title: require(resolve(__dirname, '..', 'package.json')).name,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no viewport-fit=cover',
        },
      ],
      templateContent: ({ htmlWebpackPlugin }) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `,
    }),
  ],
};
