var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var libPath = require('../../tools/webpack-util');


var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: "commonjs2",
    library: '@sample-stack/client-core'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFile: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      loaders: 'ts-loader'
    }, {
      test: /\.json?$/,
      loader: 'json'
    },]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules" }),
  { "@sample-stack/core": "@sample-stack/core" }]
};

module.exports = webpack_opts;
