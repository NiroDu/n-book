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

[好文 - 一张图理解 prototype、proto 和 constructor 的三角关系](https://www.cnblogs.com/xiaohuochai/p/5721552.html)

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
obj3.sayName.call(obj2); 箭头函数没有自身的 this，会直接忽略掉 call 的第一个参数，所以没法改掉 this 的指向。

obj4.sayName.call(obj2); 自执行函数也没法通过 call 来改变（不确定正误）

## 第 7 题

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});

promise.then(() => {
  console.log(3);
});

console.log(4);
```

```js
输出答案：
1
2
4
3
```

## 第 8 题 讲讲 Vue 和 React 的异同

讲讲 Vue 和 React 的不同处和相同处。

### 1. Virtual DOM
Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。

而对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

### 2. 组件化
在Vue中，如果你遵守一定的规则，你可以使用单文件组件，HTML, JavaScript和CSS都写在一个文件之中。你不再需要在.vue组件文件中引入CSS，虽然这也是可以的。

React也是非常相似的，JavaScript与JSX被写入同一个组件文件中。

### 3. Props
React和Vue都有'props'的概念，这是properties的简写。props在组件中是一个特殊的属性，允许父组件往子组件传送数据。

### 4. 模板 vs JSX
React与Vue最大的不同是模板的编写。Vue鼓励你去写近似常规HTML的模板。写起来很接近标准HTML元素，只是多了一些属性。

React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。
React/JSX乍看之下，觉得非常啰嗦，但使用JavaScript而不是模板来开发，赋予了开发者许多编程能力。

Vue鼓励你去使用HTML模板去进行渲染，Vue的模板语法去除了往视图/组件中添加逻辑的诱惑，保持了关注点分离。

### 5. 状态管理 vs 对象属性
在React中你需要使用setState()方法去更新状态。

在Vue中，state对象并不是必须的，数据由data属性在Vue对象中进行管理。

而在Vue中，则不需要使用如setState()之类的方法去改变它的状态，在Vue对象中，data参数就是应用中数据的保存者。

对于管理大型应用中的状态这一话题而言，Vue.js的作者尤雨溪曾说过，（Vue的）解决方案适用于小型应用，但对于对于大型应用而言不太适合。

[Vue与React两个框架的区别和优势对比](http://caibaojian.com/vue-vs-react.html)

## 第 9 题 讲讲 Redux 的工作机制

## 第 10 题 讲讲 Redux createStore 的实现原理

[createStore 原理及作用](https://www.jianshu.com/p/670817164b91)

[redux 源码解读－－createStore 源码解析](https://segmentfault.com/a/1190000011835213)

## 第 11 题

有一个商品 id 数组 `['1','2','3','4','5','6','7','8'];`，遍历该数组取得每个商品的 id，并且用该 id 去请求商品详情数据 `{name:'a',...}`，并把每条详情数据都存到一个新的数组 resultArray 中。

做法一

```js
async function getDetailInfo() {
  const array = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const resultArray = [];

  for (let item of array) {
    const response = await axios.get(".../detail", {
      params: { id: item }
    });
    resultArray.push(response.data);
    console.log("resultArray:", resultArray);
  }
}
```

做法二

```js
function getDetailInfo() {
  // 创建一个resolve状态的变量，以便可以直接执行then()
  const sequence = Promise.resolve();
  // array.forEach(function(item) {
  for (let item of array) {
    function axioss() {
      return new Promise(function(resolve, reject) {
        axios
          .get(".../detail", {
            params: { id: item }
          })
          .then(function(response) {
            resultArray.push(response.data.data);
            console.log("resultArray:", resultArray);
            resolve();
          });
      });
    }
    // 第一次执行了上方声明的resolve状态后，遍历数组中会返回新的resolve状态，把resolve状态再重新赋给sequence，以便下一次Promise的继续执行
    sequence = sequence.then(axioss);
  }
  // );
}
```

## 第 12 题 讲讲 Vue 的双向绑定

实现简单的双向绑定

```html
<body>
  <div id="app">
    <input type="text" id="txt" />
    <p id="show"></p>
  </div>
</body>
```

```js
var obj = {};
Object.defineProperty(obj, "txt", {
  get: function() {
    return obj;
  },
  set: function(newValue) {
    document.getElementById("txt").value = newValue;
    document.getElementById("show").innerHTML = newValue;
  }
});
document.addEventListener("keyup", function(e) {
  obj.txt = e.target.value;
});
```

假如要遍历去劫持对象：

下例中希望是内部变量，所以才弄了newKey，用户通过访问`data.a`访问，而不是`data._a`，所以分别对key和newKey设置了不同的enumerable。
```js
const data = {
  _a: 1,
  _b: 2
};
Object.keys(data).forEach(key => {
  console.log("data:", data); // {_a: 1, _b: 2}
  console.log("key:", key); // _a, _b
  const newKey = key.slice(1);
  console.log("newKey:", newKey); // a, b
  Object.defineProperty(data, newKey, {
    get() {
      console.log(`get: ${newKey}`);
      return data[key];
    },
    set(newValue) {
      console.log(`set: newKey:${newKey}, newValue:${newValue}`);
      this[key] = newValue;
    },
    enumerable: true
  });
  // 内部的key，不可枚举
  Object.defineProperty(data, key, {
    enumerable: false
  });
});
```

## JS 浮点数运算的精度问题

```js
console.log(0.1 + 0.2 == 0.3); // false
```

[解答](https://www.html.cn/archives/7340)

## ES6 的 const 并非一定为常量

```js
const foo = {};
foo.name = "a";
console.log(foo.name); // 打印 "a"
```

const 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
但**对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const 只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了**。因此，将一个对象声明为常量必须非常小心。

[解答](https://blog.fundebug.com/2018/07/25/es6-const/)

## Vue 组件 data 为什么必须是函数？
[Vue 组件 data 为什么必须是函数？](https://juejin.im/entry/59225ff8a22b9d005885cb15)

## 用关键字new创建对象都做了什么？
```js
function Person () {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        return this.name;
    };
}
var person = new Person("tom", 21, "WEB");
```
使用关键字new创建新实例对象经过了以下几步：

1、创建一个新对象，如：var person = {};

2、新对象的_proto_属性指向构造函数的原型对象。

3、将构造函数的作用域赋值给新对象。（也所以this对象指向新对象）

4、执行构造函数内部的代码，将属性添加给person中的this对象。

5、返回新对象person。

```js
var person = {};
person.__proto__ = Person.prototype; //引用构造函数的原型对象
Person.call(person); //将构造函数的作用域给person,即：this值指向person
return person;
```

```js
function newFunc (name) {
  var o = {};
  o.__proto__ = Person.prototype;//绑定Person的原型
  Person.call(o, name);
  return o;
}
```
更抽象通用的写法：
```js
function newFunc (constructor){
  var o = {};
  o.__proto__ = constructor.prototype;
  constructor.apply(o, Array.prototype.slice.call(arguments, 1));
  return o;
}
var person1 = newFunc(Person, 'MeloGuo', 21);
```

## 手写实现bind
bind的作用与call和apply相同，区别是call和apply是立即调用函数，而bind是返回了一个函数，需要调用的时候再执行。 一个简单的bind函数实现如下：
```js
Function.prototype.bind = function(ctx) {
    var fn = this;
    return function() {
        fn.apply(ctx, arguments);
    };
};
```

第二种

不传入第一个参数，那么默认为 window。
改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？
```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```

## 第 18 题：React 中 setState 什么时候是同步的，什么时候是异步的？
在 React 中，如果是由 React 引发的事件处理（比如通过 onClick 引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步执行 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。

**原因：** 在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中回头再说，而 isBatchingUpdates 默认是 false，也就表示 setState 会同步更新 this.state，但是，有一个函数 batchedUpdates，这个函数会把 isBatchingUpdates 修改为t rue，而当 React 在调用事件处理函数之前就会调用这个 batchedUpdates，造成的后果就是由 React 控制的事件处理过程 setState 不会同步更新 this.state。

[更多解析](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/17)

## 第 19 题：React setState 笔试题，下面的代码输出什么？
```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }
  render() {
    return null;
  }
};
```
解析：

1、第一次和第二次都是在 react 自身生命周期内，触发时 isBatchingUpdates 为 true，所以并不会直接执行更新 state，而是加入了 dirtyComponents，所以打印时获取的都是更新前的状态 0。

2、两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3、setTimeout 中的代码，触发时 isBatchingUpdates 为 false，所以能够直接进行更新，所以连着输出 2，3。

输出： 0 0 2 3

[更多解析](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/18)
