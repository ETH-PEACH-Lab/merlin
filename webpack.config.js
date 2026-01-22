const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/public'),
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/gif.js/dist/gif.worker.js',
          to: 'gif.worker.js'
        }
      ]
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
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.post('/api/save-input', (req, res) => {
        const fs = require('fs');
        const path = require('path');
        const { spawn } = require('child_process');
        
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const content = `Problem statement: ${data.problemDescription}\nReference implementation: ${data.referenceImplementation}\nInstance: ${data.instance}`;
            const filePath = path.join(__dirname, 'generate', 'input.txt');
            
            // Save the input file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Input file saved to generate/input.txt');
            
            // Execute prompt.py
            const pythonProcess = spawn('python3', ['prompt.py'], {
              cwd: path.join(__dirname, 'generate')
            });

            let stdout = '';
            let stderr = '';

            pythonProcess.stdout.on('data', (data) => {
              stdout += data.toString();
              console.log(`Python output: ${data.toString()}`);
            });

            pythonProcess.stderr.on('data', (data) => {
              stderr += data.toString();
              console.error(`Python error: ${data.toString()}`);
            });

            pythonProcess.on('close', (code) => {
              if (code === 0) {
                console.log('Python script executed successfully');
                
                // Read the generated response.txt
                const responsePath = path.join(__dirname, 'generate', 'outputs', 'response.txt');
                try {
                  const generatedCode = fs.readFileSync(responsePath, 'utf8');
                  res.json({ 
                    success: true, 
                    message: 'File saved and generation completed',
                    generatedCode: generatedCode,
                    output: stdout
                  });
                } catch (readError) {
                  res.status(500).json({ 
                    success: false, 
                    error: 'Failed to read generated output: ' + readError.message
                  });
                }
              } else {
                console.error(`Python script exited with code ${code}`);
                res.status(500).json({ 
                  success: false, 
                  error: `Python script failed with code ${code}`,
                  stderr: stderr
                });
              }
            });

            pythonProcess.on('error', (error) => {
              console.error('Failed to start Python process:', error);
              res.status(500).json({ 
                success: false, 
                error: 'Failed to start Python process: ' + error.message
              });
            });

          } catch (error) {
            res.status(500).json({ success: false, error: error.message });
          }
        });
      });

      return middlewares;
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