# webpack advanced 原理分析

## 编写一个 Loader

Loader 的本质就只是一个函数，拿到源代码 source 对象，然后再返回处理后的 source 对象。

初始化一个项目

```js
npm init -y
npm i webpack webpack-cli -D
```

我们来实现一个替换文字内容的 loader。

定义 loader 内容，其实就是导出一个函数，但注意这个函数不能写成箭头函数的形式，因为后面我们要用到它的`this`的内容。

```js
// /loaders/replaceLoader.js
// source就是引入文件的源代码/内容
module.exports = function(source) {
  // this.query 中是 loader 的 options 传来的参数，下面webpack配置可以看到。
  console.log(this.query); // 输出：{name: Du}
  // 将内容里的'world'换成'Du'
  return source.replace("world", "Du");
};
```

一个最简单的 Loader 便写完了，那如何去使用这个 Loader 呢？

我们来配置`webpack.config.js`文件，只需要在`module.rules`中声明就好。

```js
// /webpack.config.js
const path = require("path");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            // 使用的loader的路径
            loader: path.resolve(__dirname, "./loaders/replaceLoader.js"),
            options: {
              // 这里面可以自定义要传递过去的参数
              name: "Du"
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
```

这样就实现了一个最简单的 Loader。

### this.query

关于`this.query`这个参数的说明，我们还可以查询官方的 api 文档，这里除了 query 以外，还有很多可供选择的 api 可用。

[点击查看 loaders API](https://webpack.js.org/api/loaders#thisquery)

例如在传递的参数这里，官方推荐使用[loaderUtils](https://github.com/webpack/loader-utils#getoptions)的`getOptions`方法来解析传递过来的参数。

```js
// /loaders/replaceLoader.js
const loaderUtils = require("loader-utils");
module.exports = function(source) {
  // 使用getOptions可以直接拿到options传过来的参数
  const options = loaderUtils.getOptions(this);
  return source.replace("world", options.name);
};
```

### this.callback

再解释一个很常用的参数：`this.callback`，官方解释 A function that can be called synchronously or asynchronously in order to return multiple results.

使用这个 callback 我们可以 return 回更多不同的结果。

```js
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

其中 meta 可以是任何内容，我们套用进我们的代码中，忽略掉 meta 和 sourceMap 参数：

```js
// /loaders/replaceLoader.js
const loaderUtils = require("loader-utils");
module.exports = function(source) {
  // 使用getOptions可以直接拿到options传过来的参数
  const options = loaderUtils.getOptions(this);
  const result = source.replace("world", options.name);
  this.callback(null, result);
};
```

### this.async

> Tells the loader-runner that the loader intends to call back asynchronously. Returns this.callback.

当我们希望在 Loader 中异步调用后再返回结果，这个时候就需要用到`this.async`。

```js
// /loaders/replaceLoader.js
const loaderUtils = require("loader-utils");
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  // 声明this.async()
  const callback = this.async();

  setTimeout(() => {
    const result = source.replace("world", options.name);
    // 使用this.async()，其实就是返回一个this.callback()
    callback(null, result);
  }, 1000);
};
```

### 多个 Loader 叠加使用

就和平时多个 Loader 一样叠加即可。

```js
// /webpack.config.js
const path = require("path");
module.exports = {
...
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: path.resolve(__dirname, "./loaders/replaceLoader.js"),
          },
          {
            loader: path.resolve(__dirname, "./loaders/replaceLoader-2.js"),
            options: {
              name: "Du"
            }
          }
        ]
      }
    ]
  },
...
};
```

通过`resolveLoader`，优化`loader`的引用路径。

```js
// /webpack.config.js
const path = require("path");
module.exports = {
...
  resolveLoader: {
    modules: ["node_modules", "./loaders"]
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: "replaceLoader"
          },
          {
            loader: "replaceLoaderAsync",
            options: {
              name: "lee"
            }
          }
        ]
      }
    ]
  },
...
};
```

## 编写一个 Plugin

Plugin 和 Loader 的区别个人理解：Loader 用来处理类似于 js/css/font/svg/img 等等等文件，而 Plugin 是在打包的某一个时刻（打包前、打包时、打包后）来额外做某些事情。

webpack Plugin 设计模式：发布订阅，事件驱动模式。

我们下面编写的这个 Plugin 要做的事情：**打包结束后在 dist 目录添加一个版权信息的 txt 文件。**

插件的本质是一个 Class。

第一步，声明一个插件文件：

```js
// /plugins/copyright-webpack-plugin.js
class CopyrightWebpackPlugin {
  // 使用插件的时候，会去调用apply方法，其中的compiler是webpack的实例对象。
  apply(compiler) {
    // compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
    // 	console.log('compiler');
    // })
    // compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
    // 	debugger;
    // 	compilation.assets['copyright.txt']= {
    // 		source: function() {
    // 			return 'copyright by dell lee'
    // 		},
    // 		size: function() {
    // 			return 21;
    // 		}
    // 	};
    // 	cb();
    // })
  }
}
module.exports = CopyrightWebpackPlugin;
```

第二步，在`webpack.config.js`中使用它：

```js
// /webpack.config.js
const path = require("path");
const CopyRightWebpackPlugin = require("./plugins/copyright-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  plugins: [new CopyRightWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  }
};
```

这一下明白了为什么在使用 Plugins 时，总是要 new 一个实例，因为 Plugin 导出的就是一个 Class。

想接收参数，那就在`constructor`中接收`options`来使用：

```js
module.exports = {
	...
	plugins: [
		new CopyRightWebpackPlugin({
			name: 'du'
		})
	],
	...
}
```

```js
// /plugins/copyright-webpack-plugin.js
class CopyrightWebpackPlugin {
  constructor(options) {
    console.log(options); // {name:'du'}
  }
  apply(compiler) {
    // do something
  }
}
module.exports = CopyrightWebpackPlugin;
```

钩子执行的时刻说明：[compiler-hooks](https://webpack.js.org/api/compiler-hooks)

例如`emit`：Executed right before emitting assets to output dir.(打包好准备把文件放到输出目录的时刻)
它是一个 AsyncSeriesHook（异步钩子），所以要使用`tapAsync`。

`compilation`里存储着这次打包的所有内容。可以打印输出`compilation.assets`，是一个对象。

```js
class CopyrightWebpackPlugin {
  apply(compiler) {
		// 同步的时刻
    compiler.hooks.compile.tap("CopyrightWebpackPlugin", compilation => {
      console.log("compiler");
		});

		// 异步的时刻
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
				// 在compilation中新增一个txt文件
        compilation.assets["copyright.txt"] = {
					// 文件的内容
          source: function() {
            return "copyright by dell lee";
					},
					// 这个文件的大小长度是21个字节
          size: function() {
            return 21;
          }
				};
				// 用了异步的tapAsync，最后一定要执行一下cb()
        cb();
      }
    );
  }
}
module.exports = CopyrightWebpackPlugin;
```

这样就完成了我们要往打包文件中添加一个txt文件的需求。

## 编写一个 Bundle
