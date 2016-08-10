module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],

    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate',
          'babel'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|.*\.spec\.js)/,
        loader: 'isparta'
      },
      // vucalur: make angular-material fonts load properly:
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader?limit=100000'
      }
    ]
  },
  plugins: [],
  debug: true,
  devtool: 'cheap-module-eval-source-map'
};
