import path from 'path';
import webpack from 'webpack';

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'public'),
};

export default {
  devtool: 'eval-source-map',
  entry: {
    app: [PATHS.app, 'webpack-hot-middleware/client'],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: PATHS.build,
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
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
    new webpack.HotModuleReplacementPlugin(),
  ],
};
