/* eslint import/no-extraneous-dependencies: off */

import path from 'path';
import webpack from 'webpack';
import CleanPlugin from 'clean-webpack-plugin';

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'public'),
};

export default {
  entry: {
    app: PATHS.app,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
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
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
