const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')


module.exports = {
    entry: {
        server: './src/app_server.js'
    },
    output: {
        path: path.join(__dirname, 'public/dist'),
        publicPath: '/',
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
      alias: {
        '@root': path.resolve(__dirname, './'), 
      }
    },
    externals: [nodeExternals()],
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",     
            }
          },
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          },
        ]
      }
};