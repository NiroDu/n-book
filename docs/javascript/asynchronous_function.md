# asynchronous function（异步函数）

async  function 是 Promise 用法的优化。

The purpose of `async/await` functions is to simplify the behavior of using promises synchronously and to perform some behavior on a group of `Promises`. 

## 定义
> An `async` function can contain an `await` expression that pauses the execution of the async function and waits for the passed `Promise`'s resolution, and then resumes the `async` function's execution and returns the resolved value.

Remember, the `await` keyword is only valid inside `async` functions. If you use it outside of an `async` function's body, you will get a `SyntaxError`.

async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。

## 用法
### 例子 1
先看一个用 Promise 写的例子，我们再用 async 函数重写它：

```js
// An API that returns a Promise will result in a promise chain, and it splits the function into many parts.
function getProcessedData(url) {
  return downloadData(url) // returns a promise
    .then(v => {
      return processDataInWorker(v); // returns a promise
    })
    .catch(e => {
      return downloadFallbackData(url)  // returns a promise
    });
}

// ...这里省略then做的事...
```

it can be rewritten with a single async function as follows:
```js
async function getProcessedData(url) {
  let v;
  try {
    v = await downloadData(url); 
  } catch(e) {
    v = await downloadFallbackData(url);
  }
  return processDataInWorker(v);
}

getProcessedData("http://www.balabala.com/getdata/").then(function (result){
	// 返回 v 的值
  console.log(result);
})
```

:::warning Note
上个例子中，return 语句中没有 await 操作符，因为 async function 的返回值将隐式传递给 Promise.resolve。（别忘了async函数的返回值是一个 Promise 对象）
:::

### 例子 2
再看一个例子：

```js
// 2秒后执行
var resolveAfter2Seconds = function() {
  console.log("starting slow promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(20);
      console.log("slow promise is done");
    }, 2000);
  });
};

// 1秒后执行
var resolveAfter1Second = function() {
  console.log("starting fast promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(10);
      console.log("fast promise is done");
    }, 1000);
  });
};

// 按顺序执行
var sequentialStart = async function() {
  console.log('==SEQUENTIAL START==');
  // 如果 await 操作符后的表达式不是一个 Promise 对象, 则它会被转换成一个 resolved 状态的 Promise 对象
  const slow = await resolveAfter2Seconds();
  const fast = await resolveAfter1Second();
  console.log(slow);
  console.log(fast);
}

// 同时执行
var concurrentStart = async function() {
  console.log('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds(); // 立即启动计时器
  const fast = resolveAfter1Second();
  console.log(await slow);
  console.log(await fast); // 等待 slow 完成, fast 也已经完成。
}

// 按顺序执行（串行）
var stillSerial = function() {
  console.log('==CONCURRENT START with Promise.all==');
  Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(([slow, fast]) => {
    console.log(slow);
    console.log(fast);
  });
}

// 并行
var parallel = function() {
  console.log('==PARALLEL with Promise.then==');
  // in this case could be simply written as console.log(resolveAfter2Seconds());
  resolveAfter2Seconds().then((message)=>console.log(message)); 
  resolveAfter1Second().then((message)=>console.log(message));
}

sequentialStart(); // sequentialStart 总共花了 2+1 秒
setTimeout(concurrentStart, 4000); // concurrentStart 总共花了 2 秒
setTimeout(stillSerial, 7000); // stillSerial 总共花了 2 秒
setTimeout(parallel, 10000); // 真正的并行运行
```

:::warning Note
在 sequentialStart 中，程序为第一个await停留了 2 秒，然后又为第二个await停留了 1 秒。直到第一个计时器结束后，第二个计时器才被创建。
在 concurrentStart 中，两个计时器均被创建，然后一起被await。这两个计时器同时运行的，但await的调用仍然是按顺序运行的，这意味着第二个await会等到第一个await运行结束。这使得代码完成运行只需要 2 秒，而不是 3 秒。这 2 秒是由最慢的计时器决定的。

使用了`Promise.all`的 stillSerial 的例子中也存在同样的情况。

如果希望同时await两个或者是更多的Promise对象，必须使用`Promise.then`，正如例子中parallel所做的那样。
:::

### 例子 3

`await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在 `try...catch` 代码块中。

```js
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
        console.log('calling2');
        resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  try {
    var result = await resolveAfter2Seconds();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法
async function asyncCall() {
  await resolveAfter2Seconds().catch(function (err){
    console.log(err);
  });
}

asyncCall();

// > "calling"
// 两秒后...
// > "calling2"
// > "resolved"
```

### 例子 4
`await`命令只能用在`async`函数之中，如果用在普通函数，就会报错。

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 报错，因为await用在普通函数中了
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}

/* 
应该改成
docs.forEach(async function (doc) {
*/
```

假如`db.post`要求是继发执行， 而不是并发执行（同时执行），那么正确的写法是采用`for`循环，而不 `forEach` ：

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  for (let doc of docs) {
    await db.post(doc);
  }
}
```

如果确实希望多个请求并发执行，可以使用`Promise.all`方法。

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));

  let results = [];
  for (let promise of promises) {
    results.push(await promise);
  }
  console.log(results);
}
```

## 参考资料
[async function - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[async 函数的含义和用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/05/async.html)