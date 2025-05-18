
const path = require('path');

module.exports = {
  entry: {
    popup: './src/popup_src/index.tsx',
    content: './src/content_scripts/index.ts',
    background: './src/service_worker/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  mode: 'development',
};
