const webpack = require('webpack')
const path = require('path')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  context: src,
  entry: './index.js',
  output: {
    path: dist,
    publicPath: 'dist',
    filename: 'sunburst.js',
    library: 'sunburst',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new BabiliPlugin()
  ],
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        include: src,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                'es2017',
              ],
              plugins: [
                ['transform-object-rest-spread']
              ]
            }
          },
          'eslint-loader'
        ]
      }
    ]
  }
}
