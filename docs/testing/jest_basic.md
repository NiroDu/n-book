# Jest 基础
[Jest Docs](https://jestjs.io/docs/en/getting-started)

下面开始使用Jest来对代码进行测试。

先是项目中安装Jest：
```bash
yarn add --dev jest
// or
npm install --save-dev jest
```

## 项目一
我们延续加法减法的测试，来引入Jest，简单的使用下它的基础API。

Jest提供了单元测试（模块测试）和集成测试（多个模块测试）两种方式，依照它的要求，我们先将需要测试的函数以模块的形式导出：
```js
// math.js
function add(a, b) {
  return a + b;
}

function minus(a, b) {
  return a - b;
}

function multi(a, b) {
  return a * b;
}

module.exports = {
  add,
  minus,
  multi
};
```

在同级目录下，创建`math.test.js`，作为测试文件。
```js
const math = require("./math.js");
const { add, minus, multi } = math;

// test() 就是 Jest 提供的API，没想到吧哈哈哈
test('测试加法', () => {
  expect(add(3,7)).toBe(10);
})
test('测试减法', () => {
  expect(minus(3,3)).toBe(0);
})
test('测试乘法', () => {
  expect(multi(3,3)).toBe(9);
})
```

> jest命令会自动运行以`.test.js`结尾的文件。

然后我们就可以通过`jest`命令来进行自动化测试了，我们可以在`package.json`中添加脚本命令：
```json
{
  // ...
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
    "jest": "^24.8.0"
  }
  // ...
}
```

运行`npm run test`：
输出结果：
![](./_image/2020-04-28/2020-04-28-18-11-13.png)

[参考地址：项目一](https://github.com/NiroDu/React-Analysis/tree/master/automatic-testing/2-3%20%E4%BD%BF%E7%94%A8%20Jest%20%E4%BF%AE%E6%94%B9%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)

## 项目二
下面我们进行Jest的配置：

暴露Jest配置文件：
```bash
npx jest --init
```
这会在根目录生成`jest.config.js`文件。

列出测试覆盖率
```bash
npx jest --coverage
```

也可以直接将这两个命令配置在`package.json`中：
```json
{
    // ...
  "scripts": {
    "test": "jest",
    "eject": "jest --init",
    "coverage": "jest --coverage"
  },
    // ...
}
```

在`jest.config.js`文件中可以修改很多配置项，例如：
```js
module.exports = {
  // ...
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
}
```


```bash
npm i @babel/core@7.4.5 @babel/preset-env@7.4.5 -D
```
