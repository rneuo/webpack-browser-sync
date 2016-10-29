var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var AssetsPlugin = require('assets-webpack-plugin')

require('dotenv').config()

const isProduction = (process.env.NODE_ENV === 'production')

var assets = new AssetsPlugin({
  filename: 'webpack-asset-manifest.json',
  includeManifest: 'manifest',
  prettyPrint: true
})
var defineEnv = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'HELLO_WORLD': JSON.stringify(process.env.HELLO_WORLD)
  }
})
var uglify = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
var extractText = new ExtractTextPlugin('style-bundle.css')
var browserSync = new BrowserSyncPlugin({
  host: 'localhost',
  port: 3001,
  server: { baseDir: ['public', 'src/html'] },
  files: ['src/*.css', 'src/*.js', 'src/*.html']
}, { reload: true })
var jsPlugins = isProduction ? [defineEnv, uglify, assets] : [defineEnv, browserSync, assets]
var cssPlugins = isProduction ? [extractText, uglify, assets] : [extractText, browserSync, assets]

var build_path = {
  js: 'public/assets',
  css: 'public/assets'
}

var devTool = isProduction ? '' : 'source-map'

const config_for_js = {
  entry: {
    'app': './main.js'
  },

  output: {
    path: path.join(__dirname, build_path.js),
    filename: isProduction ? '[name]-bundle-[hash].js' : '[name]-bundle.js'
  },

  context: path.resolve(__dirname, 'src'),

  module: {
    preLoaders: [
      { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ }
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
      { test: /\.html$/, loader: 'html' }
    ]
  },

  resolve: {
    root: [ path.resolve(__dirname, 'src') ]
  },

  devtool: devTool,

  plugins: jsPlugins
}

const config_for_static = {
  entry: [
    './src/scss/style.scss',
    'font-awesome/scss/font-awesome.scss'
  ],

  output: {
    path: path.join(__dirname, build_path.css),
    filename: isProduction ? '[name]-bundle-[hash].css' : '[name]-bundle.css'
  },

  module: {
    loaders: [
      { test: /\.css$/, loaders: [ 'style', 'css' ] },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass') },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },

  plugins: cssPlugins,

  devtool: devTool
}

module.exports = [config_for_js, config_for_static]
