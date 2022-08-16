const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');

const PAGE_ROOT = 'src/jsx/pages/';
const files = glob
  .sync('**/*.jsx', {
    cwd: PAGE_ROOT,
  })
  .map((page) => {
    console.log(page);
    const fileExt = path.extname(page);
    const distFileName = page.replace(new RegExp(fileExt + '$'), '.html');
    return {
      template: path.join(PAGE_ROOT, page),
      filename: distFileName,
    };
  });

module.exports = {
  target: ['web', 'es5'],
  entry: './src/scripts/index.js',
  output: {
    path: `${__dirname}/public`,
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js(|x)$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    ...files.map(
      (file) =>
        new HtmlWebpackPlugin({
          template: file.template,
          filename: file.filename,
          inject: false,
        })
    ),
  ],
};
