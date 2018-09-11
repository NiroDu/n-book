# Event Loop（事件循环）

## 总览
JS 里有两种任务类型：

macroTask（宏任务）: `setTimeout`, `setInterval`, `setImmediate`, `requestAnimationFrame`, `user Input/Output`, `UI rendering`

microTask（微任务）: `process.nextTick`, `Promise`, `Object.observe`, `MutaionObserver`

Event Loop的示意图：
![event_loop_0](http://pb0ug959r.bkt.clouddn.com/event_loop_0.jpg)

总的来说，执行顺序是

宏任务1，微任务1.1…

宏任务2，微任务2.1，微任务2.2…

宏任务3，微任务3.1，微任务3.2，微任务3.3…

…

宏任务X，微任务X.1，微任务X.2…

依次执行直至清空队列。

## 定义
> `Stack`: Function calls form a stack of frames.

> `Queue`: A JavaScript runtime uses a **message queue**, which is a list of messages to be processed. Each message has an associated function which gets called in order to handle the message.
> At some point during the event loop, the runtime starts handling the messages on the queue, **starting with the oldest one**. To do so, the message is removed from the queue and its corresponding function is called with the message as an input parameter. As always, calling a function creates a new stack frame for that function's use.
> The processing of functions continues until the stack is once again empty; then the event loop will process the next message in the queue (if there is one).

## 执行顺序
下文中的 `task` 统指 `macroTask`。

Event Loop 大概是这么个执行法（非官方）：
1. 遇上 timer 类型的 API（如setTimeout/setInterval/setImmediate）注册的函数，会等到指定时间后进入 task 队列。
2. 不同的 API 注册的异步任务会依次进入自身对应的 task/microtask 队列，然后等待 Event Loop 将它们依次压入执行栈中执行。
3. Event Loop 开始：从 `task` 队列中拉出一个 `task` 执行，当这个 `task` 执行结束，检查 `microtask` 队列是否为空，不为空则依次执行直至清空 `microtask` 队列。
4. 从 `task` 队列中拉出下一个 `task` 执行，反复循环。

看下面一个例子：
```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
    Promise.resolve().then(function() {
      console.log('promise11');
    }).then(function() {
      console.log('promise22');
    });
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');

/* 执行顺序
script start
script end
promise1
promise2
setTimeout
promise11
promise22
*/
```

看这篇文章中举出的两个例子，就能清楚 macroTask 和 microTask 执行的顺序：
[Tasks, microtasks, queues and schedules - JakeArchibald.com](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

## 参考资料
[Concurrency model and Event Loop - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)

[Tasks, microtasks, queues and schedules - JakeArchibald.com](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[Event Loop的规范和实现](https://zhuanlan.zhihu.com/p/33087629)