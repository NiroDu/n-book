# Webpack Basic

[webpack documentation](https://webpack.js.org/concepts)

## 起手式

推荐在项目中安装 webpack，而不是全局安装 webpack，这样才可以在不同的项目中使用不同版本的 webpack 进行打包。

npx 想要解决的主要问题，就是调用项目内部安装的模块。原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
[npx - 阮一峰](http://www.ruanyifeng.com/blog/2019/02/npx.html)

### 安装 webpack

webpack-cli 使得可以在命令行里使用 webpack 指令。

```
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

file-loader 用于打包除JS类型以外的文件到对应的输出目录。

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

例如简单的小图片适合转化为base64写进JS文件中，优点是可以不用再去请求图片资源，但是复杂的大图片转换为base64就太大了，不适合写进JS中，所以使用 url-loader 需要设定一个阈值，也就是通过`limit`来指定多大以下的文件才会被使用 url-loader 去打包为base64，否则使用`fallback`中指定的loader来进行处理（默认是file-loader）。

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

