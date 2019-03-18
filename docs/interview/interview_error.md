# 面试中遇上的题

## 第 1 题

```js
console.log(typeof null); // object
```

[解析](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

[instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)

[Object.prototype.toString.call()](https://www.jianshu.com/p/585926ae62cc)

## 第 2 题

```js
var i, j, k;
for (i = 0, j = 0; i < 8, j < 5; i++, j++) {
  k = i + j;
}
console.log(i, j, k); // 5,5,8
```

```js
var i, j, k;
for (i = 0, j = 0; i < 8, j < 5; i++, j++) {
  console.log("i:", i);
  console.log("j:", j);
  console.log("k-before:", k);
  k = i + j;
  console.log("k-after:", k);
}
console.log(i, j, k);
```

## 第 3 题

```js
var foo = "Hello";
(function() {
  var bar = "World";
  console.log("1:", foo + bar);
})();
console.log("2:", foo + bar);
```

```js
输出答案：
1: HelloWorld
Uncaught ReferenceError: bar is not defined
```

自执行函数把变量 bar 限定在其中了。

## 第 4 题

```js
for (var i = 0; i < 4; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
Promise.resolve().then(() => {
  console.log(2);
});
(() => console.log(3))();
```

```js
输出答案：
3
2
4
4
4
4
```

解析：关键处是输出了 4 次 4。

settimeout 是异步执行，0ms 后往任务队列里面添加一个任务，只有主线上的全部执行完，才会执行任务队列里的任务，当主线执行完成后，i 是 4，所以此时再去执行任务队列里的任务时，i 全部是 4 了。对于打印 4 次是：每一次 for 循环的时候，settimeout 都执行一次，但是里面的函数没有被执行，而是被放到了任务队列里面，等待执行，for 循环了 4 次，就放了 4 次，当主线程执行完成后，才进入任务队列里面执行。

想要它按着 0,1,2,3 的顺序输出，有两种办法，一个是使用 let，另外一个方式是自执行函数限定。

```js
方式一：let
for(let i = 0; i < 4; i++) {
  setTimeout(()=>{
    console.log(i);
  },0)
}
方式二：自执行函数
for(var i = 0; i < 4; i++) {
  setTimeout((()=>{
    console.log(i);
  })(),0)
}
```

## 第 5 题

```js
var F = function() {};
Object.prototype.a = function() {
  console.log("Object");
};
Function.prototype.b = function() {
  console.log("Function");
};
var f = new F();
try {
  f.a();
} catch (e) {
  console.log("fa-error");
}
try {
  f.b();
} catch (e) {
  console.log("fb-error");
}
try {
  F.a();
} catch (e) {
  console.log("Fa-error");
}
try {
  F.b();
} catch (e) {
  console.log("Fb-error");
}
```
```js
输出答案：
Object
fb-error
Object
Function
```

解析：
f 的原型链：

```bash
f -----> F.prototype -----> Object.prototype -----> null
```

F 的原型链：

```bash
F -----> Function.prototype -----> Object.prototype -----> null
```

所以当 f.b()时，因为 f 的原型链上找不到 b 方法，所以报错。

```js
f.__proto__ === F.prototype; // true
F.__proto__ === Function.prototype; // true

f.__proto__.__proto__ === Object.prototype; // true
F.__proto__.__proto__ === Object.prototype; // true

f.constructor === F; // true
```

[好文 - 一张图理解prototype、proto和constructor的三角关系](https://www.cnblogs.com/xiaohuochai/p/5721552.html)

## 第 6 题

```js
var obj1 = {
  name: "obj1",
  sayName: function() {
    console.log(this.name);
  }
};

name = "name";

var obj2 = { name: "obj2" };

var obj3 = {
  name: "obj3",
  sayName: function() {
    (function() {
      console.log(this.name);
    })(this);
  }
};

var obj4 = {
  name: "obj4",
  sayName: () => {
    console.log(this.name);
  }
};

obj1.sayName();
obj3.sayName();
obj4.sayName();

obj1.sayName.call(obj2);
obj3.sayName.call(obj2);
obj4.sayName.call(obj2);
```

```js
输出答案：
obj1
name
name

obj2
name
name
```

解析：
obj3.sayName.call(obj2); 箭头函数没有自身的this，会直接忽略掉call的第一个参数，所以没法改掉this的指向。

obj4.sayName.call(obj2); 自执行函数也没法通过call来改变（不确定正误）

## 第 7 题
```js
const promise = new Promise((resolve,reject)=>{
	console.log(1);
	resolve();
	console.log(2);
})

promise.then(()=>{
	console.log(3);
})

console.log(4);
```
```js
输出答案：
1
2
4
3
```

## 第 8 题 讲讲Vue和React的异同
讲讲 Vue 和 React 的不同处和相同处。


## 第 9 题 讲讲Redux的工作机制
讲讲 Vue 和 React 的不同处和相同处。

## 第 10 题 讲讲Redux createStore的实现原理
[createStore原理及作用](https://www.jianshu.com/p/670817164b91)
[redux源码解读－－createStore源码解析](https://segmentfault.com/a/1190000011835213)
