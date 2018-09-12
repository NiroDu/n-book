# Promise

## 定义
> A `Promise` is an object representing the eventual completion or failure of an asynchronous operation, and its resulting value.

Promise Constructor:
```js
new Promise(function(resolve, reject) { ... });
```

A **Promise** is a proxy for a value not necessarily known when the promise is created.
instead of immediately returning the final value, the asynchronous method returns a `promise` to supply the value at some point in the future.

A **Promise** is in one of these states:
1. `pending（进行中）`: initial state, neither fulfilled nor rejected.
2. `fulfilled（已成功）`: meaning that the operation completed successfully.
3. `rejected（已失败）`: meaning that the operation failed.


A `pending` promise can either be `fulfilled` with a value, or `rejected` with a reason (error). When either of these options happens, the associated handlers queued up by a promise's `then` method are called.

（`then` 方法包含两个参数：`onfulfilled` 和 `onrejected`，它们都是 Function 类型。当 Promise 状态为 fulfilled 时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法， 在异步操作的完成和绑定处理方法之间不存在竞争）

![promises](http://pb0ug959r.bkt.clouddn.com/promises.png)

:::warning Note
Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。
:::

## Methods
### Promise.resolve(value)
Returns a Promise object that is resolved with the given value.

通常而言，如果你不知道一个值是否是 Promise 对象，使用 `Promise.resolve(value)` 来返回一个 Promise 对象, 这样就能将该 value 以 Promise 对象形式使用。
```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

Promise.resolve方法的参数分成四种情况。

**（1）如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 Promise 对象，状态为`resolved`。**
```js
const p = Promise.resolve('Hello');
// 由于字符串 Hello 不属于异步操作，字符串对象不具有 then 方法，返回 Promise 实例的状态从一生成就是 resolved，所以回调函数会立即执行。
p.then(function (s){
  console.log(s)
});
// Hello
```

**（2）参数是一个 `thenable` 对象**

`thenable`对象指的是具有`then`方法的对象，如下例：
```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
// Promise.resolve 法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 then 方法。
let p1 = Promise.resolve(thenable);
// thenable 对象的 then 方法执行后，对象 p1 的状态就变为 resolved
p1.then(function(value) {
  console.log(value);  // 42
});
```

**（3）参数是一个 Promise 实例**

如果参数是 Promise 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例。

**（4）不带有任何参数**

直接返回一个`resolved`状态的 Promise 对象。
```js
const p = Promise.resolve();
// 变量p就是一个 Promise 对象。
p.then(function () {
  // ...
});
```

另外要注意，立即`resolve`的 Promise 对象，是在本轮 “事件循环”（event loop）的结束时，而不是在下一轮 “事件循环” 的开始时。
```js
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// setTimeout(fn, 0)在下一轮 “事件循环” 开始时执行，
// Promise.resolve()在本轮 “事件循环” 结束时执行，
// console.log('one')则是立即执行，因此最先输出。

// one
// two
// three
```

### Promise.reject(reason)
Returns a Promise object that is rejected with the given reason.

（返回一个新的 Promise 实例，该实例的状态为rejected。
并且`Promise.reject()`方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。）

例子1：
```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

// then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

例子2：
```js
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
	// Promise.reject方法的参数是一个thenable对象，执行以后，后面catch方法的参数不是reject抛出的 “出错了” 这个字符串，而是thenable对象。
  console.log(e === thenable)
})
```

### Promise.all(iterable)
`Promise.all`方法将多个 Promise 实例，包装成一个新的 Promise 实例。接受一个数组作为参数。

Returns a promise that either fulfills when all of the promises in the iterable argument have fulfilled or rejects as soon as one of the promises in the iterable argument rejects. 

（返回一个 promise 对象。当参数里的所有 promise 对象都为 `fulfilled` 时，返回的 promise 对象的值才为 `fulfills`；只要参数里其中一个 promise 对象为 `rejected`，那返回的 promise 对象的值为 `rejects`）

If the returned promise fulfills, it is fulfilled with an array of the values from the fulfilled promises in the same order as defined in the iterable.

（返回的 promise 对象会把参数里所有 promise 返回值作为数组返回（作为成功回调的返回值），顺序跟参数里的顺序保持一致）

If the returned promise rejects, it is rejected with the reason from the first promise in the iterable that rejected. 

（如果这个返回的 promise 对象触发了 `rejects` 状态，它会把参数里第一个触发 `rejects` 的 promise 对象的错误信息作为它的失败错误信息。）

This method can be useful for aggregating results of multiple promises.

（`Promise.all()` 方法常被用于处理多个 promise 对象的状态集合。）

下面是个好例子：
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```

p1 会 resolved，p2 会 rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。

该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。

::: warning
如果`p2`没有自己的
`catch`方法，就会调用`Promise.all()`的`catch`方法。
:::

### Promise.race(iterable)
`Promise.race()`方法也是将多个 Promise 实例，包装成一个新的 Promise 实例。接受一个数组作为参数。

Returns a promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects, with the value or reason from that promise.
```js
const p = Promise.race([p1, p2, p3]);
```
上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 `Promise` 实例的返回值，就传递给`p`的回调函数。

应用：下例中 如果指定时间内没有获得结果，就将 `Promise` 的状态变为`reject`，否则变为`resolve`。
```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
// 如果 5 秒之内fetch方法无法返回结果，变量p的状态就会变为rejected，从而触发catch方法指定的回调函数。
```

## Promise prototype methods
### Promise.prototype.then(onFulfilled, onRejected)
then方法的第一个参数是`resolved`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数。

`then`方法返回的是一个新的Promise实例，因此可以采用链式写法。

### Promise.prototype.catch(onRejected)
**Promise.prototype.catch方法是.then(null, rejection)的别名**

如果异步操作抛出错误，状态就会变为`rejected`，就会调用`catch`方法指定的回调函数，处理这个错误。

另外，`then`方法指定的回调函数，如果运行中抛出错误，也会被`catch`方法捕获。
```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```

Promise 在resolve语句后面，再抛出错误，不会被捕获，等于没有抛出。因为Promise 的状态一旦改变，就永久保持该状态，不会再变了。


### Promise.prototype.finally(onFinally)
finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。

finally方法的回调函数不接受任何参数。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。

finally本质上是then方法的特例。
```js
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

`finally` 方法的实现：
```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

## Chaining after a catch
It's possible to chain after a failure, i.e. a catch, which is useful to accomplish new actions even after an action failed in the chain.
（在 Promise 链式调用中，其中一节抛出错误(throw new Error)，后面的`catch`就能捕捉到，并且不会阻塞下一个`then`的调用，如下例：）

```js
new Promise((resolve, reject) => {
    console.log('Initial');
    resolve();
})
.then(() => {
    throw new Error('Something failed');
    console.log('Do this');
})
.catch(() => {
    console.log('Do that');
})
.then(() => {
    console.log('Do this, no matter what happened before');
});
/*
the text “Do this” is not output because the “Something failed“ error caused a rejection.
This will output the following text:

Initial
Do that
Do this, no matter what happened before
*/
```

## Creating a Promise around an old callback API
some APIs still expect success and/or failure callbacks to be passed in the old way:
```js
setTimeout(() => saySomething("3 seconds passed"), 3000);
```
Mixing old-style callbacks and promises is problematic. If `saySomething()` fails or contains a programming error, nothing catches it.
（上例中，假如 saySomething 函数出现了报错，我们没法在 setTimeout 中捕获这个错误。）

Luckily we can wrap it in a **promise**. 
Best practice is to wrap problematic functions at the lowest possible level, and then never call them directly again:
（那我们可以使用 Promise 来封装一下：）
```js
const saySomething = text => { console.log(text); }

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait(3000).then(text => saySomething("3 seconds")).catch(failureCallback); // failureCallback 在这里还没定义
```

## Timing（时序）
为了防止意外，即使是一个已经变成`resolve`状态的`promise`，传给`then`的函数也不会被同步执行。
```js
Promise.resolve().then(() => console.log(2)); // 并不会以同步的顺序先输出 2
console.log(1);
// 1, 2
```

Instead of running immediately, the passed-in function is put on a `microtask queue`, which means it runs later **when the queue is emptied** at the end of the current run of the JavaScript event loop:
```js
const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); // setTimeout 是 macrotask, 所以会最后输出 4
wait().then(() => console.log(4));

Promise.resolve().then(() => console.log(2)).then(() => console.log(3)); // Promise 是 microtask
console.log(1);
// 1, 2, 3, 4
```


## 参考资料
[Promise - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[ECMAScript 6入门 - Pormise](http://es6.ruanyifeng.com/#docs/promise)
[Using promises - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)