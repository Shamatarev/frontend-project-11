// Generated using webpack-cli https://github.com/webpack/webpack-cli

// eslint-disable-next-line import/no-extraneous-dependencies
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  // output: './dist/',
  devServer: {
    open: true,
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.js$/, // Регулярное выражение для выбора JavaScript-файлов
        exclude: /node_modules/, // Исключение папки node_modules
        use: {
          loader: 'babel-loader', // Используем загрузчик Babel
          options: {
            presets: ['@babel/preset-env'], // Пресет Babel для поддержки современного JavaScript
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
