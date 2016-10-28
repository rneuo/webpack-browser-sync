var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

require('dotenv').config()

const isProduction = (process.env.NODE_ENV === 'production')

var defineEnv = new webpack.DefinePlugin({
  'ENV.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'ENV.HELLO_WORLD': JSON.stringify(process.env.HELLO_WORLD)
})
var uglify = new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
var extractText = new ExtractTextPlugin('style.css')
var browserSync = new BrowserSyncPlugin({
  host: 'localhost',
  port: 3001,
  server: { baseDir: ['public'] },
  files: ['src/*.css', 'src/*.js', 'public/*.html']
}, { reload: true })
var jsPlugins = isProduction ? [defineEnv, uglify] : [browserSync, defineEnv]
var cssPlugins = isProduction ? [extractText, uglify] : [extractText, browserSync]

var build_path = {
  js: isProduction ? 'build/js' : 'public',
  css: isProduction ? 'build/css' : 'public'
}

const config_for_js = {
  entry: {
    'main': './main.js'
  },

  output: {
    path: path.join(__dirname, build_path.js),
    filename: 'app.js'
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

  devtool: 'source-map',

  plugins: jsPlugins
}

const config_for_static = {
  entry: [
    './src/scss/style.scss',
    'font-awesome/scss/font-awesome.scss'
  ],

  output: {
    path: path.join(__dirname, build_path.css),
    filename: 'style.css'
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

  devtool: 'source-map'
}

module.exports = [config_for_js, config_for_static]
