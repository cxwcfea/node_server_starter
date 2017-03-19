/* eslint import/no-extraneous-dependencies: off */

import path from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'public'),
  style: path.join(__dirname, 'app/main.css'),
};

export default {
  entry: {
    app: PATHS.app,
    style: PATHS.style,
    vendor: ['react', 'react-dom'],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  output: {
    path: PATHS.build,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
        include: PATHS.app,
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader?cacheDirectory'],
        include: PATHS.app,
      },
    ],
  },
  plugins: [
    new CleanPlugin([PATHS.build]),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new HtmlWebpackPlugin({
      template: 'node_modules/html-webpack-template/index.ejs',
      title: 'My App',
      appMountId: 'app',
      inject: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
