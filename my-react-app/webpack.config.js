const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

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
    ]
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
            plugins: devMode ? ['react-hot-loader/babel'] : []
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
  ],

  resolveLoader: {
    modules: ['node_modules']
  },

  performance: {
    hints: false
  }
};

// Development mode
if (devMode) {

  webpackConfig.devtool = 'eval';

  webpackConfig.devServer = {
    port: port,
    host: host,
    allowedHosts: 'all',
    client: {
      webSocketURL: `${socketProtocol}://${host}:${port}/ws`,
    },
    devMiddleware: {
      publicPath: '/',
      stats: true
    }
  }

  let devPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs'
    })
  ];

  webpackConfig.plugins = webpackConfig.plugins.concat(devPlugins);

} else {

  // Production mode
  let prodPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      externalCSS: ['components/loader.css'],
      externalJS: ['cordova.js', 'components/loader.js'],
      minify: {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    })
  ];
  webpackConfig.plugins = webpackConfig.plugins.concat(prodPlugins);

}

module.exports = webpackConfig;
