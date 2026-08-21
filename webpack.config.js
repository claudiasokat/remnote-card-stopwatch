const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BannerPlugin } = require('webpack');

const SANDBOX_SUFFIX = '-sandbox';

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  entry: {
    index: './src/widgets/index.tsx',
    'index-sandbox': './src/widgets/index.tsx',

    card_stopwatch: './src/widgets/card_stopwatch.tsx',
    'card_stopwatch-sandbox': './src/widgets/card_stopwatch.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
    publicPath: '',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2020',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!doctype html>
        <html>
        <head>
<style>
html, body {
  margin: 0;
  padding: 0;
  background: transparent !important;
  overflow: hidden;
}
</style>
</head>
          <body></body>
          <script>
            const params = new URLSearchParams(window.location.search);
            const widgetName = params.get('widgetName');

            if (!widgetName) {
              document.body.innerHTML = 'Widget ID not specified.';
            } else {
              const script = document.createElement('script');
              script.type = 'module';
              script.src = widgetName + '-sandbox.js';
              document.body.appendChild(script);
            }
          </script>
        </html>
      `,
      filename: 'index.html',
      inject: false,
    }),

    new BannerPlugin({
      banner: (file) => {
        return !file.chunk.name.includes(SANDBOX_SUFFIX)
          ? 'const IMPORT_META=import.meta;'
          : '';
      },
      raw: true,
    }),

    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
    hot: false,
  },
};
