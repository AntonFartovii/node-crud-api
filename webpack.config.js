const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ['ts-loader'],
        exclude: ['/node_modules/', '/build/', '/dist/'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  target: 'node',
};

module.exports = () => {
  return config;
};
