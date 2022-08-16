# 作業メモ

## 初期設定

npm 初期化

```bash
npm init -y
```

---

webpack インストール

```bash
npm i -D webpack webpack-cli webpack-merge
```

---

webpack.config.js を作成

```
touch webpack.common.js webpack.dev.js webpack.prod.js
```

## webpack でとりあえずバンドルできるようにする

webpack.common.js

```js
module.exports = {
  entry: './src/tsx/index.js',
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/public`,
    // 出力ファイル名
    filename: 'main.js',
  },
};
```

webpack.dev.js

```js
const merge = require('webpack-merge').merge;
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
});
```

## Babel を導入

- babel/core → Babel 本体
- bable/preset-env → ES6 -> ES5 の変換に必要なプリセット

```
npm i -D @babel/core @babel/preset-env babel-loader
```

---

babel の設定ファイル作成

```
touch .babelrc
```

preset-env を使用するように設定(babelrc)

```json
{
  "presets": ["@babel/preset-env"]
}
```

---

target を webpack.config.js に追加(webpack5 から必要)

```
target: ['web', 'es5'],
```

---

rules をかく

- test でファイル形式を指定し、loader（または use）でローダーを指定

```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
    },
  ];
}
```

## 続いて jsx をコンパイル

パッケージをインストール
※React は仮想 DOM としても使う可能性があるので dependencies で

```
npm i -D html-webpack-plugin @babel/preset-react
npm i react react-dom
```

---

Babel で React をコンパイル
.babelrc

```
{
  "presets": ["@babel/preset-env","@babel/react"]
}
```

---

2022/07/22
renderToStaticMarkup が動かない・・・・
→ React v17 に変更で解消

## html を出力できるようにする

html-webpack-plugin をインストール

```
npm i -D html-webpack-plugin
```

---

とりあえず index.html を jsx から
※この ReactDOMServer が v18 だと動かない（TextEncorder がサポートされてないと思われ）

index.jsx

```js
import React from 'react';
import ReactDOMServer from 'react-dom/server';
const Button = () => <button>test</button>;

console.log(ReactDOMServer.renderToStaticMarkup(<Button />));

export default () => `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>title</title>
  </head>
    <div id="app"></div>
    ${ReactDOMServer.renderToStaticMarkup(<Button />)}
  <body>
  </body>
  </html>
`;
```

webpack.common.js

```js
plugins: [
  new HtmlWebpackPlugin({
    title: "My App",
    template: "src/jsx/pages/index.jsx",
  }),
],
```

## Layouts を切り出したり管理しやすいファイル構成に

BaseLayout.jsx

```jsx
import React from 'react';
export const BaseLayout = ({ children }) => {
  return (
    <>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>タイトル</title>
        </head>
        <body>{children}</body>
      </html>
    </>
  );
};
```

pages/index.js

```jsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { BaseLayout } from '../layouts/BaseLayout.jsx';
const Button = () => <button>test</button>;

export default () => {
  return ReactDOMServer.renderToStaticMarkup(
    <BaseLayout>
      <Button />
    </BaseLayout>
  );
};
```

!DOCTYPE html を React で生成できないっぽいので、Wrap する staticRender 関数を作成

```js
import ReactDOMServer from 'react-dom/server';

export const staticRender = (element) => {
  return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(element);
};
```

## 続いて下層のディレクトリ構成を生成する

htmlWebpackPlugin を動的に生成

```js
const PAGE_ROOT = 'src/jsx/pages/';
const files = glob
  .sync('**/*.jsx', {
    cwd: PAGE_ROOT,
  })
  .map((page) => {
    const fileExt = path.extname(page);
    const distFileName = page.replace(new RegExp(fileExt + '$'), '.html');
    return {
      template: path.join(PAGE_ROOT, page),
      filename: distFileName,
    };
  });
```

```js
plugins: [
  ...files.map(file => new HtmlWebpackPlugin({
    template: file.template,
    filename: file.filename,
  })),
],
```

## ESLint を導入しとく

```
npm i -D eslint
npx eslint --init
```

```
How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JavaScript
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest
✔ Would you like to install them now with npm? · No / Yes
```

node も追加しとく

```
"env": {
  "browser": true,
  "es2021": true,
  "node":true,
},
```

```
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {},
};
```

## Prettier も導入

```
npm i -D prettier
```

.prettierrc

```
{
  "semi": true,
  "singleQuote": true
}
```

VSCode で自動補完が効くように
settings.json

```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## ESLint で Warning が出るので解決する

```
React version not specified in eslint-plugin-react settings
```

バージョンがあってないのかな？？

eslintrc に追記で解決

```
settings: {
  react: {
    version: 'detect',
  },
},
```

## BrowserSync も入れとこう

```
npm i -D browser-sync
```

package.json

```
scripts:{
  "server": "browser-sync start -s public -w public"
}
```

## ホットリロードも

```
npm i -D npm-run-all
```

```
scripts:{
  "dev": "webpack:dev server"
}
```

## sass のコンパイル

とりあえず sass インストール

```
npm i -D sass
```

sass → css

```
"sass2css:dev": "sass src/sass/main.scss:public/styles.css",
"sass2css:prod": "sass src/sass/main.scss:public/styles.css --no-source-map",
```

## autoprefixer を入れとく

postcss も必要なので

```
npm i -D postcss-cli autoprefixer
```

postcss の設定ファイルを作る

```
touch postcss.config.js
```

```js
module.exports = {
  plugins: [
    require('autoprefixer')({
      cascade: false,
      grid: true,
    }),
  ],
};
```

scripts を追加

```
"postcss": "postcss public/styles.css -o public/styles.css"
```

## stylelint を追加

まずは必要なパッケージを

```
npm i -D stylelint-scss stylelint-prettier stylelint-config-recommended-scss stylelint-config-recess-order stylelint-config-prettier
```

設定ファイルを作る

```
touch stylelint.config.js
```

```js
module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-config-recess-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': [
      true,
      { semi: true, singleQuote: true, trailingComma: 'all' },
    ],
  },
};
```

VSCode で自動補完するように

```json
{
  // ↓stylelintを有効化
  "stylelint.validate": ["css", "scss"],
  // 自動補完を有効に
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
}
```

## 画像圧縮タスクを追加しとく

必要なプラグインをインストール

```
npm i -D imagemin-cli imagemin-gifsicle imagemin-mozjpeg imagemin-pngquant imagemin-svgo
```

```
"imagemin:png": "imagemin src/images/*.png --out-dir=public/assets/images --plugin.pngquant.quality=0.7 --plugin.pngquant.quality=0.8",
"imagemin:jpeg": "imagemin src/images/*.{jpeg,jpg} --out-dir=public/assets/images --plugin.mozjpeg.quality=0.7",
"imagemin:gif": "imagemin src/images/*.gif --out-dir=public/assets/images --plugin.gifsicle",
"imagemin:svg": "imagemin src/images/*.svg --out-dir=public/assets/images --plugin.svgo",
"imagemin": "run-p imagemin:*",
```

## build コマンドを作る

削除用の scripts を作成

```
"clean": "rimraf public",
```

コマンド追加

```
"build": "run-p clean webpack:prod sass:prod"
```
