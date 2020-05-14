# 自动化测试基本原理

例如想测试下面这两个函数：
```js
// 可先打开控制台全局注入这两个函数
function add(a, b) {
  return a + b;
}

function minus(a, b) {
  // 错误的，需要被测出来
  return a * b;
}
```

## 做法一
最直白的做法可将下面这段测试代码直接运行：
```js{17}
// 运算的结果
var result = add(3, 7);
// 期望的值
var expect = 10;

if (result !== 10) {
  throw Error(`3 + 7 应该等于 ${expect}，但结果却是 ${result}`);
}

// 再一次运算
// 运算的结果
var result = minus(3, 3);
// 期望的值
var expect = 0;

if (result !== 0) {
  throw Error(` 3 - 3 应该等于 ${expect}，但结果却是 ${result}`);
}
```
运行后可见，在运行`minus(3, 3)`时，会在控制台输出：`3 - 3 应该等于 0，但结果却是 9`，这就是最基础的测试代码。

## 做法二
我们来改进上诉的做法，期望写这样的函数去调用：

```js
expect(add(3,3)).toBe(6);
expect(minus(6,3)).toBe(3);
```

```js
// 同样在浏览器控制台中运行即可
function expect(result) {
  return {
    toBe: function (actual) {
      if (result !== actual) {
        throw new Error(`预期值和实际值不相等，预期${actual}，结果却是 ${result}`);
      }
    },
  };
}
expect(add(3, 7)).toBe(10);
expect(minus(3, 3)).toBe(0);
```

## 做法三
但是报错我们不知道是哪个有问题，所以继续改进函数调用做法。

期望写成这样的函数去调用：

```js
test('测试加法', () => {
  expect(add(3,7)).toBe(10);
})
test('测试减法', () => {
  expect(minus(3,3)).toBe(0);
})
```

在外面封装一层：
```js
function test(desc, fn) {
  try {
    fn();
    console.log(`${desc} 通过测试`);
  } catch (e) {
    console.error(`${desc} 没有通过测试 ${e}`);
  }
}
// 上一段一样的代码
function expect(result) {
  return {
    toBe: function (actual) {
      if (result !== actual) {
        throw new Error(`预期值和实际值不相等，预期${actual}，结果却是 ${result}`);
      }
    },
  };
}

// 运行函数
test('测试加法', () => {
  expect(add(3,7)).toBe(10);
})
test('测试减法', () => {
  expect(minus(3,3)).toBe(0);
})
```

打开控制台运行，即可看见测试结果中的报错信息。