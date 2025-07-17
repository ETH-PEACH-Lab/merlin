const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');


const path = require('path');
const argvs = require('yargs').argv;
const devMode = process.env.WEBPACK_SERVE || argvs.mode === 'development';

const DEFAULT_PORT = 8080;
const host = process.env.MONACA_SERVER_HOST || argvs.host || '0.0.0.0';
const port = argvs.port || DEFAULT_PORT;
const socketProtocol = process.env.MONACA_TERMINAL ? 'wss' : 'ws';

let webpackConfig = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: ['./src/main.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js',
  },

  optimization: {
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    removeEmptyChunks: true,
    providedExports: true
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.html', '.styl'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    fallback: {
      "fs": false,
      "https": false,
      "path": false,
      "os": false,
      "fs/promises": false,
      "image-size": false
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: devMode ? [require.resolve('react-refresh/babel')] : []
          }
        }]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new ProgressBarPlugin(),
    new ReactRefreshWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      favicon: 'src/public/favicon.png' // Ensure this line is added
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^node:(fs|https|path|os|image-size|fs\/promises)$/,
      (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }
    )
  ],

  resolveLoader: {
    modules: ['node_modules']
  },

  performance: {
    hints: false
  },

  devServer: {
    port:port,
    host: host,
    allowedHosts: 'all',
    hot: true,
    client: {
      webSocketURL: `${socketProtocol}://${host}:${port}/ws`,
      overlay: {
        runtimeErrors: false
      }
    },
    devMiddleware:{
      publicPath: '/',
      stats: true
    }
  }
};

module.exports = webpackConfig;

// // Development mode
// if (devMode) {

//   webpackConfig.devtool = 'eval';

//   webpackConfig.devServer = {
//     port: port,
//     host: host,
//     allowedHosts: 'all',
//     hot: true,
//     client: {
//       webSocketURL: `${socketProtocol}://${host}:${port}/ws`,
//     },
//     devMiddleware: {
//       publicPath: '/',
//       stats: true
//     }
//   }

//   let devPlugins = [
//     new HtmlWebPackPlugin({
//       template: 'src/public/index.html.ejs',
//       favicon: 'src/public/favicon.png' // Ensure this line is added
//     })
//   ];

//   webpackConfig.plugins = webpackConfig.plugins.concat(devPlugins);

// } else {

//   // Production mode
//   let prodPlugins = [
//     new HtmlWebPackPlugin({
//       template: 'src/public/index.html.ejs',
//       favicon: 'src/public/favicon.png', // Ensure this line is added
//       externalCSS: ['components/loader.css'],
//       externalJS: ['cordova.js', 'components/loader.js'],
//       minify: {
//         caseSensitive: true,
//         collapseWhitespace: true,
//         conservativeCollapse: true,
//         removeAttributeQuotes: true,
//         removeComments: true
//       }
//     })
//   ];
//   webpackConfig.plugins = webpackConfig.plugins.concat(prodPlugins);

// }