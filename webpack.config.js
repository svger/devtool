const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const pkg = require('./package.json');
const projPkg = require(path.join(cwd, 'package.json'));

module.exports = {
  //页面入口文件配置
  entry: './demo/index.js',
  //入口文件输出配置
  output: {
    path: path.join(__dirname, 'demo', 'static'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: projPkg.browserslist || pkg.browserslist,
                  },
                  modules: false,
                  useBuiltIns: false,
                  debug: false,
                },
              ],
              'stage-0',
              'react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      }, {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(__dirname, './postcss.config.js'),
              },
            }
          }, {
            loader: 'less-loader',
            options: {
              globalVars: {
                'theme': `'${projPkg.theme}'`
              },
              // modifyVars: {
              //   '@theme': projPkg.theme
              // }
            }
          }
        ]
      }, {
        test: /\.(jpe?g|png|gif|eot|ttf|wav|mp3|woff|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[hash:8].[name].[ext]'
          }
        }
      }
    ],
  },
  //插件项
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', 'process.env.BROWSER': true }),
  ]
};