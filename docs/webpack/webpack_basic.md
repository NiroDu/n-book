# Webpack Basic

[webpack documentation](https://webpack.js.org/concepts)

## 起手式

推荐在项目中安装 webpack，而不是全局安装 webpack，这样才可以在不同的项目中使用不同版本的 webpack 进行打包。

npx 想要解决的主要问题，就是调用项目内部安装的模块。原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
[npx - 阮一峰](http://www.ruanyifeng.com/blog/2019/02/npx.html)

### 安装 webpack

webpack-cli 使得可以在命令行里使用 webpack 指令。

```bash
npm install webpack webpack-cli --save-dev
```

运行 webpack，后面都直接写到 package.json 的 scripts 中去。

```bash
// 将 index.js 作为 webpack 的入口文件进行打包：
npx webpack index.js
```

```bash
// 指定 webpack 执行的配置文件
npx webpack   xxx.js
```

下面来解释一下最基础的 webpack 配置：

```js
const path = require("path");
module.exports = {
  // 还有 production 这一个选项，压缩和不压缩的区别
  mode: "development",
  // 入口文件，简写：entry: './src/index.js',
  // chunk的默认值是main
  entry: {
    main: "./src/index.js"
  },
  // 输出文件夹
  output: {
    filename: "bundle.js",
    // __dirname 表示当前文件所在的目录
    path: path.resolve(__dirname, "dist")
  }
};
```

## 核心概念

### 什么是 Loader？

webpack 默认只能处理 JS 文件，除此以外的文件需要处理都需要借助 Loader。

### file-loader

> The file-loader resolves import/require() on a file into a url and emits the file into the output directory.

[file-loader](https://webpack.js.org/loaders/file-loader)

file-loader 用于打包除 JS 类型以外的文件到对应的输出目录。

像`[name]_[hash].[ext]`这样的变量在 webpack 中称为**placeholders**，有不同类型，可在这里查询：[placeholders](https://webpack.js.org/loaders/file-loader#placeholders)

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            // 以output中的path为基础进行打包，在这里即dist目录下的 images/
            outputPath: "images/"
          }
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

### url-loader

> url-loader Works like the file loader, but can return a data URL if the file is smaller than a limit.

[url-loader](https://webpack.js.org/loaders/url-loader)

url-loader 和 file-loader 很类似，都是用于处理各类文件的打包的。但 url-loader 打包是将文件转换为 base64 文件写入 js 中。

例如简单的小图片适合转化为 base64 写进 JS 文件中，优点是可以不用再去请求图片资源，但是复杂的大图片转换为 base64 就太大了，不适合写进 JS 中，所以使用 url-loader 需要设定一个阈值，也就是通过`limit`来指定多大以下的文件才会被使用 url-loader 去打包为 base64，否则使用`fallback`中指定的 loader 来进行处理（默认是 file-loader）。

```js
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            // 10240 byte 也就是 10.24kb
            // 指定文件的最大大小（以字节为单位）
            limit: 10240
            // fallback: 'file-loader'
          }
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

## 打包 css/sass/添加前缀

> webpack 配置是从下到上，从右到左的执行顺序。

css-loader 分析 css 文件之间的引用和关系，然后合并成一份 css 代码，style-loader 会再将这段 css 代码挂载到 head 上。

[css-loader](https://webpack.js.org/loaders/css-loader)

[sass-loader](https://webpack.js.org/loaders/sass-loader)

```js
...
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 10240
          }
        }
      },
      {
        test: /\.scss$/,
        // use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
        use: ["style-loader", {
					loader: 'css-loader',
					options: {
						importLoaders: 2
					}
				}, "sass-loader", "postcss-loader"]
      }
    ]
  },
...
```

css-loader 的`importLoaders`参数，The option allows you to configure how many loaders before css-loader should be applied to @imported resources.

例如 index.js 中引入了 index.scss，而 index.scss 中又引入了 head.scss，按照`use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]`的执行顺序，应该先去加前缀、编译 sass，才是开始执行 css-loader 打包 css，对于 head.scss 文件也是如此。所以设置`importLoaders: 2`的原因是再执行 css-loader 前先去执行它之前 2 个 loader 一遍。

[importLoaders 的解释](https://webpack.js.org/loaders/css-loader#importloaders)

另外，使用`postcss-loader`需要在根目录新建一个`postcss.config.js`，把配置项写在里面：

```js
module.exports = {
  plugins: [
    // 添加前缀
    require("autoprefixer")
  ]
};
```

[postcss-loader](https://webpack.js.org/loaders/postcss-loader)

## 出入口和使用插件

指定多入口，在 output 配置时使用`filename: "[name].js"`，如下例，将会在 dist 目录打包成两个文件：`main.js`和`sub.js`

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
...
  entry: {
    main: "./src/index.js",
    sub: "./src/index.js"
  },
  output: {
    publicPath: "http://cdn.com.cn",
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CleanWebpackPlugin(["dist"])
  ],
...
};
```

介绍一下很常见的`publicPath`，这个在引用外部文件的时候很常用，这个选项会在打包文件引用路径之前加上前缀。

> This option specifies the public URL of the output directory when referenced in a browser. A relative URL is resolved relative to the HTML page. Server-relative URLs, protocol-relative URLs or absolute URLs are also possible and sometimes required, i. e. when hosting assets on a CDN.

> The value of the option is prefixed to every URL created by the runtime or loaders. Because of this the value of this option ends with `/` in most cases.

使用了`publicPath: "http://cdn.com.cn"`打包出的：

```html
// dist/index.js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>html</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="http://cdn.com.cn/main.js"></script>
    <script type="text/javascript" src="http://cdn.com.cn/sub.js"></script>
  </body>
</html>
```

没使用`publicPath: "http://cdn.com.cn"`打包出的：

```html
// dist/index.js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>html 模版</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/javascript" src="main.js"></script>
    <script type="text/javascript" src="sub.js"></script>
  </body>
</html>
```

## sourceMap

sourceMap 用于映射源文件和打包后文件的对应关系（行和列），便于调试源代码。

[devtool](https://webpack.js.org/configuration/devtool/#devtool)

[详解 Webpack 中的 sourcemap](https://segmentfault.com/a/1190000008315937)

[JavaScript Source Map 详解 - 阮一峰](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

```js
module.exports = {
	mode: 'development',
	// mode: 'production',
	devtool: 'cheap-module-eval-source-map',
...
}
```

各种 sourceMap 区别大概是：

source-map 会在打包后的 js 同级目录生成一个`.map`文件。

inline(-source-map)：将`.map`经过 base64 编码作为 DataURI 嵌入打包的 js 文件中，不单独生成.map 文件。

cheap(-source-map)：不包含列信息，也不包含 loader 的 sourcemap

module(-source-map)：包含 loader(第三方库)的 sourcemap（比如 babel 的 sourcemap）

eval：使用 eval 将 webpack 中每个模块包裹，然后在模块末尾添加模块来源//# souceURL， 依靠 souceURL 找到原始代码的位置，速度最快，但是提示不够全。（eval 模式有点特殊， 它和其他模式不一样的地方是它依靠 sourceURL 来定位原始代码， 而其他所有选项都使用.map 文件的方式来定位）

development 环境最好使用`devtool: 'cheap-module-eval-source-map'`，线上还想用 sourcemap 调试的话，可以使用`devtool: 'cheap-module-source-map'`。

## WebpackDevServer

实现代码自动更新。

### 第一种方式：webpack --watch

在`package.json`的 scripts 命令追加参数`webpack --watch`
仅仅是自动打包，不会启动服务器，不会自动刷新浏览器。

```js
...
"scripts": {
  "bundle": "webpack",
  "watch": "webpack --watch",
  "start": "webpack-dev-server",
  "server": "node server.js"
},
...
```

### 第二种方式

在 node 中直接使用 webpack，安装`webpackDevMiddleware`和`express`。
会自动更新+打包，但这样的配置不会自动打开浏览器和刷新浏览器。

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");
// complier是webpack的编译器，将配置项config传入，返回一个编译对象，重新执行编译
const complier = webpack(config);
const app = express();
app.use(
  webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
  })
);

app.listen(3000, () => {
  console.log("server is running");
});
```

### 第三种方式：WebpackDevServer

WebpackDevServer：自动打包+自动启动服务器+自动刷新浏览器。

安装 WebpackDevServer：`npm install webpack-dev-server -D`

[webpack-dev-server](https://webpack.js.org/configuration/dev-server#devserverproxy)

在`webpack.config.js`中添加配置项`devServer`。

```js
...
devServer: {
  // 启动服务器的对应目录
  contentBase: './dist',
  // 启动服务器完成后自动打开浏览器
  open: true,
  // 端口设置
  port: 8080,
  // 添加代理
  proxy: {
    '/api': 'http://localhost:3000'
  }
},
...
```

WebpackDevServer 打包生成的文件并不会放到 dist 目录下，而是放在内存中，有效的增加打包速度，所以在目录下是看不到打包文件的。

## Hot Module Replacement

模块热更新，在代码进行更新后，只会去修改被更新的地方，而不是重新刷新加载整个页面。

开启 devServer 的`hot`和`hotOnly`选项，并且在 plugins 里添加`new webpack.HotModuleReplacementPlugin()`。

`hot`和`hotOnly`选项含义：

```bash
hot：Enable webpack's Hot Module Replacement feature   [boolean]
hotOnly：Do not refresh page if HMR fails        [boolean]
```

```js
module.exports = {
  ...
	devServer: {
    ...
		hot: true,
		hotOnly: true
  },
  	plugins: [
    ...
		new webpack.HotModuleReplacementPlugin()
  ],
...
}
```

例如，

```js
// ./counter.js
// 挂载一个按钮，点击+1，用来测试页面不是重新刷新，而是热更新（热更新这里不会被变动
function counter() {
  var div = document.createElement("div");
  div.setAttribute("id", "counter");
  div.innerHTML = 1;
  div.onclick = function() {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1;
  };
  document.body.appendChild(div);
}
export default counter;
```

```js
// ./number.js
// 挂载一个节点
function number() {
  var div = document.createElement("div");
  div.setAttribute("id", "number");
  div.innerHTML = 3000;
  document.body.appendChild(div);
}
export default number;
```

```js
import counter from "./counter";
import number from "./number";

counter();
number();

// 当module.hot开启时执行
if (module.hot) {
  // 当./number.js文件变动时，执行下面函数的内容
  module.hot.accept("./number", () => {
    // 移除原来节点，重新执行number()
    document.body.removeChild(document.getElementById("number"));
    number();
  });
}
```

使用框架时，热更新的判断在 vue-loader 等 loader 里做了，所以平时都不写这些。

## 配置 babel 解析 ES6

[babel](https://babeljs.io/setup#installation)

[babel 用法](https://babeljs.io/docs/en/usage)

```js
npm install --save-dev babel-loader @babel/core @babel/cli @babel/preset-env @babel/polyfill
```

@babel/polyfill 用于兼容低版本浏览器（如 Promise、map 等），使用的时候在 JS 文件中使用`import "@babel/polyfill";`引入即可，本质是在 window 对象下挂载，例如`window.Promise`

```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
      "targets": {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"
  ]
}
```

这个配置表示只引入 在页面中使用到的需要 polyfill 的代码实现，不会全部引入 polyfill 的内容，写了这个就不需要再`import "@babel/polyfill";`了。

## Tree Shaking

Tree Shaking 只支持 ES Module 写法的引入，不支持因为 CommonJS 写法的引入，ES Module 底层是静态引入方式，而 CommonJS 是动态引入方式。

### 配置 Tree Shaking

当 mode 为'development'时，先是在`webpack.config.js`里添加`optimization`的`usedExports`项。在 mode 为'production'时，不需要添加这一项，webpack 默认完成 Tree Shaking，只需要配置`sideEffects`。

```js
module.exports = {
	mode: 'development',
...
	optimization: {
		usedExports: true
  },
...
}
```

然后是在`package.json`中添加`sideEffects`。因为 webpack 会根据模块的导入和导出情况进行 Tree Shaking，像`@babel/polyfill`这样的只有导入没有导出，或者是`import './index.css'`默认情况下会被 Shaking 掉，所以在`sideEffects`里加入它，则在 Tree Shaking 时会忽略掉它。假如没有这样的模块，直接设置`sideEffects`为 false。

```js
{
  "name": "du",
  "sideEffects": ["@babel/polyfill","*.css"],
  // "sideEffects": false,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server"
  },
...
}
```

## webpack-merge

区分环境，合并重复代码。

```
npm i webpack-merge -D
```

目前完整的 webpack 配置文件：

```js
// webpack.common.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 10240
          }
        }
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: "file-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CleanWebpackPlugin(["dist"])
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist")
  }
};
```

开发环境

```js
// webpack.dev.js
const webpack = require("webpack");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 8080,
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  optimization: {
    usedExports: true
  }
};

module.exports = merge(commonConfig, devConfig);
```

生产环境

```js
// webpack.prod.js
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const prodConfig = {
  mode: "production",
  devtool: "cheap-module-source-map"
};

module.exports = merge(commonConfig, prodConfig);
```

```js
// package.json
{
  "name": "du",
  "sideEffects": false,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  },
...
}
```

## Code Splitting

代码分割，同步和异步引入有两种方式实现。

[Code Splitting](https://webpack.js.org/guides/code-splitting/)

### 同步引入

同步代码： 只需要在 webpack.common.js 中做 optimization 的配置即可。

```js
// 同步引入lodash
import _ from "lodash";
console.log(_.join(["a", "b"], "-"));
```

```js
// 配置webpack config文件
module.exports = {
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
  },
  ...
}
```

在打包后就会单独将 lodash 这种第三方库，与业务代码分开单独生成一个新文件。

### 异步引入

异步代码(import): 异步代码，无需做任何配置，会自动进行代码分割，放置到新的文件中。

[动态导入 Dynamic Imports](https://webpack.js.org/guides/code-splitting#dynamic-imports)

```js
function getComponent() {
  // import() calls use promises internally.
  return import("lodash").then(({ default: _ }) => {
    var element = document.createElement("div");
    element.innerHTML = _.join(["Hello", "webpack"], "-");
    return element;
  });
}
getComponent().then(element => {
  document.body.appendChild(element);
});
```

使用实验性的动态 import 语法，需要安装`babel-plugin-syntax-dynamic-import`。

[babel-plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)

```js
// .babelrc
{
	presets: [
		[
			"@babel/preset-env", {
				targets: {
					chrome: "67",
				},
				useBuiltIns: 'usage'
			}
		],
		"@babel/preset-react"
  ],
  // 添加这一行
	plugins: ["@babel/plugin-syntax-dynamic-import"]
}
```

### magic comments

[magic-comments](https://webpack.js.org/api/module-methods/#magic-comments)

假如想为动态引入的包指定打包后的名字，可以使用 magic comments + splitChunks 配置。

```js
function getComponent() {
  return import(/* webpackChunkName:"lodash" */ "lodash").then(
    ({ default: _ }) => {
      var element = document.createElement("div");
      element.innerHTML = _.join(["Hello", "webpack"], "-");
      return element;
    }
  );
}
```

### SplitChunksPlugin

[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin)

下面详细讲解一下`splitChunks`的配置。

splitChunks 的默认配置如下：

```js
// webpack.config.js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      // chunks指定哪种类型的引入会被分割，值有all, async, initial，默认值async
      chunks: "async",
      // 小于30kb的就不进行代码分割了
      minSize: 30000,
      // maxSize 设置成50000的话，会尝试将一个100000的库拆分为两个vendors。设置为0则不拆分。
      maxSize: 0,
      // 打包出来的Chunk里最少1个Chunk使用到了这个模块（一个模块至少被用了多少次的时候才会对它进行分割）
      minChunks: 1,
      // 同时加载的模块数最多是5个，假如加载的数目超过了5个，后面的模块就不会进行代码分割了
      maxAsyncRequests: 5,
      // 入口文件 同时加载的模块数最多是3个，超过3个就不会进行代码分割了
      maxInitialRequests: 3,
      // 文件连接符，连接vendors和文件名
      automaticNameDelimiter: "~",
      // 让filename生效
      name: true,
      cacheGroups: {
        // 在node_modules文件夹里的那些库才会被分割成vendors
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // -10优先级大于-20，符合条件的会被优先打包到vendors.js
          priority: -10,
          filename: "vendors.js"
        },
        // 不用vendors的话
        // vendors: false,
        default: {
          minChunks: 2,
          priority: -20,
          // 如果一个模块之前就被打包进去了，那就去复用那个模块
          reuseExistingChunk: true
          // filename: 'common.js',
        }
      }
    }
  }
  // 上面等价于
  // optimization: {}
};
```

代码中的同步引入的代码需要结合`chunks`和`cacheGroups`中的`vendors`一块使用，如上配置，当同步引入的代码库是在`node_modules`中，才会对库进行代码分割。

假如同时引入了 lodash 和 jquery 两个库，两个文件都符合` chunks``minSize``minChunks `的要求，又匹配了`vendors`的正则，（`default`没有正则，默认所有都匹配）。那在代码分割时，文件会先在缓存中存储，再根据`cacheGroups`的`priority`优先级，确定执行`vendors`还是`default`的分割。

### chunkFilename
```js
module.exports = {
	entry: {
		main: './src/index.js',
  },
  ...
	output: {
		filename: '[name].js',
		chunkFilename: '[name].chunk.js',
		path: path.resolve(__dirname, '../dist')
	}
}
```

从`entry`中指定的文件或是被页面直接引用到的文件会使用`filename`，而`chunkFilename`如其名，例如在`index.js`中引用的第三方模块（间接引用），然后又配置了代码分割成为一个个chunk的话，就会使用`chunkFilename`指定的名字。

### CSS Code Splitting

默认情况下，webpack会讲css直接打包进js中（css-in-js），假如我们想要将css单独拎出来，需要借助[mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin)实现css的代码分割。

安装
```bash
npm install --save-dev mini-css-extract-plugin
```

引入plugins，并且将原来的`style-loader`替换成`MiniCssExtractPlugin.loader`，并且可以配置HRM。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 不能再用style-loader打包了
          // 'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '../',
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
 
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
```

假如打算Minimizing，可以使用[optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)对CSS压缩，对JS压缩的话使用[terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)。

```js
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  ...
};
```

将多入口的多个CSS文件都集中打包到一个CSS中，并自定义名字：：[Extracting all CSS in a single file](https://webpack.js.org/plugins/mini-css-extract-plugin#extracting-all-css-in-a-single-file)

将多入口的多个CSS文件分别打包到对应的CSS文件中，并自定义名字：[Extracting CSS based on entry](https://webpack.js.org/plugins/mini-css-extract-plugin#extracting-css-based-on-entry)

按着配置来即可。

## Lazy Loading

手动实现，点击页面后再加载文件。

```js
async function getComponent() {
  const { default: _ } = await import(/* webpackChunkName:"lodash" */ "lodash");
  const element = document.createElement("div");
  element.innerHTML = _.join(["Hello", "World"], "-");
  return element;
}

document.addEventListener("click", () => {
  getComponent().then(element => {
    document.body.appendChild(element);
  });
});
```

## Bundle Analysis,Preloading,Prefetching

### 打包分析

[bundle-analysis](https://webpack.js.org/guides/code-splitting#bundle-analysis)

> You can generate the required JSON file for this tool by running `webpack --profile --json > stats.json`

在`package.json`中添加配置即可，执行后会生成一个`.json`格式的文件，这个文件记载着 webpack 的打包信息。可以将这个文件导入下面这些网站进行可视化分析：

- [webpack analyse](https://github.com/webpack/analyse)
- [webpack-chart](https://alexkuz.github.io/webpack-chart/)
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)

或者是直接安装[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)插件进行分析。

### Preloading,Prefetching

[prefetching/preloading-modules](https://webpack.js.org/guides/code-splitting#prefetchingpreloading-modules)

**查看代码利用率：在 chrome 中，按住`command+shift+p`唤出控制台，然后输入`coverage`，点击录制可以看到代码的利用率。**

使用 magic comments `/* webpackPrefetch: true */`，执行预加载（浏览器支持程度不同）。

```js
// ./fn.js
function fn() {
  // ...
}
export default fn;
```

```js
document.addEventListener("click", () => {
  import(/* webpackPrefetch: true */ "./fn.js").then(({ default: fn }) => {
    fn();
  });
});
```

## Webpack与浏览器缓存(Caching)
