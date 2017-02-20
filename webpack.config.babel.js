import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import Config from 'webpack-config';
import ngAnnotatePlugin from 'ng-annotate-webpack-plugin';

const ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test' || ENV === 'test-watch';
const isProd = ENV === 'build';

/**
 * Common config
 */
const config = new Config().merge({
  entry: {
    bundle: path.join(__dirname, '/src/index.js'),
    vendor: ['angular'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  context: path.join(__dirname, '/src'),
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader'
          }
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|png|svg|jpg)$/,
        loader: 'url-loader?limit=300'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'ng-cache-loader?prefix=[dir]/[dir]'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'}),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: false,
      dry: false
    }),
    new HtmlWebpackPlugin({
      title: 'Starter',
      template: 'index.ejs',
      inject: 'body'
    })
  ]
});

/**
 * Development config
 */
if (!isProd) {
  config.merge({
    output: {
      pathinfo: true
    },
    devtool: '#eval',
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      hot: true,
      inline: true,
      historyApiFallback: true,
      noInfo: true,
      quiet: true
    }
  });
}

/**
 * Production config
 */
if (isProd) {
  config.merge({
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new ngAnnotatePlugin({
        add: true
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: false
      })
    ]
  })
}

export default config;