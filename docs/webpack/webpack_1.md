# Webpack Basic

推荐在项目中安装 webpack，而不是全局安装 webpack，这样才可以在不同的项目中使用不同版本的 webpack 进行打包。

npx 想要解决的主要问题，就是调用项目内部安装的模块。原理很简单，就是运行的时候，会到`node_modules/.bin`路径和环境变量`$PATH`里面，检查命令是否存在。
[npx - 阮一峰](http://www.ruanyifeng.com/blog/2019/02/npx.html)

webpack-cli 使得可以在命令行里使用 webpack 指令。

将 index.js 作为 webpack 的入口文件进行打包：

```bash
npx webpack index.js
```

指定 webpack 执行的配置文件

```bash
npx webpack --config xxx.js
```

下面来解释一下最基础的 webpack 配置：

```js
const path = require('path');
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
