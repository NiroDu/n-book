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
npx webpack --config xxx.js
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
  	require('autoprefixer')
  ]
}
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

sourceMap用于映射源文件和打包后文件的对应关系（行和列），便于调试源代码。

[devtool](https://webpack.js.org/configuration/devtool/#devtool)

[详解Webpack中的sourcemap](https://segmentfault.com/a/1190000008315937)

[JavaScript Source Map 详解 - 阮一峰](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

```js
module.exports = {
	mode: 'development',
	// mode: 'production',
	devtool: 'cheap-module-eval-source-map',
...
}
```
各种sourceMap区别大概是：

source-map会在打包后的js同级目录生成一个`.map`文件。

inline(-source-map)：将`.map`经过base64编码作为DataURI嵌入打包的js文件中，不单独生成.map文件。

cheap(-source-map)：不包含列信息，也不包含loader的sourcemap

module(-source-map)：包含loader(第三方库)的sourcemap（比如babel的sourcemap）

eval：使用eval将webpack中每个模块包裹，然后在模块末尾添加模块来源//# souceURL， 依靠souceURL找到原始代码的位置，速度最快，但是提示不够全。（eval模式有点特殊， 它和其他模式不一样的地方是它依靠sourceURL来定位原始代码， 而其他所有选项都使用.map文件的方式来定位）


development环境最好使用`devtool: 'cheap-module-eval-source-map'`，线上还想用sourcemap调试的话，可以使用`devtool: 'cheap-module-source-map'`。

## WebpackDevServer