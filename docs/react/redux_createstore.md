# 讲讲 Redux createStore 的实现原理

![createStore](./images/redux_createstore/createStore.jpg)

createStore 创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。其中暴露 dispatch, subscribe, getState, replaceReducer 方法。

## 基本用法

先看看 createStore 是怎么个用法：

`createStore(reducer, [preloadedState], enhancer)`

**参数**

`reducer (Function)`: A reducing function that returns the next state tree, given the current state tree and an action to handle.(reducer 接收两个参数，分别是当前的 state 树和要处理的 action，返回新的 state 树。)

`[preloadedState] (any)`: The initial state. You may optionally specify it to hydrate the state from the server in universal apps, or to restore a previously serialized user session. If you produced reducer with combineReducers, this must be a plain object with the same shape as the keys passed to it. Otherwise, you are free to pass anything that your reducer can understand.(初始时的 state。在同构应用中，你可以决定是否把服务端传来的 state hydrate 后传给它，或者从之前保存的用户会话中恢复一个传给它。如果你使用 combineReducers 创建 reducer，它必须是一个普通对象，与传入的 keys 保持同样的结构。否则，你可以自由传入任何 reducer 可理解的内容。)

`[enhancer] (Function)`: The store enhancer. You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc. The only store enhancer that ships with Redux is applyMiddleware().(store 的增强器函数，可以指定为第三方的中间件，时间旅行，持久化 等等，但是这个函数只能用 Redux 提供的 applyMiddleware 函数来生成；)

**返回值**

(Store): An object that holds the complete state of your app. The only way to change its state is by dispatching actions. You may also subscribe to the changes to its state to update the UI.(保存了所有 state 的对象。改变 state 的唯一方法是 dispatch action。你也可以 subscribe 监听 state 的变化，然后更新 UI。)

**示例**

```js
import { createStore } from "redux";

// 声明一个reducer
function todos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.text]);
    default:
      return state;
  }
}

let store = createStore(todos, ["Use Redux"]);

store.dispatch({
  type: "ADD_TODO",
  text: "Read the docs"
});

console.log(store.getState());
// [ 'Use Redux', 'Read the docs' ]
```

## 源码及分析

```js
// 大体框架
export const ActionTypes = {
  INIT: "@@redux/INIT"
};
export default function createStore(reducer, preloadedState, enhancer) {
  //...初始条件的判断和设定
  function getState() {
    // getState方法的实现
  }
  function subscribe() {
    // subscribe方法的实现
  }
  function dispatch() {
    // dispatch方法的实现
  }
  function replaceReducer() {
    // replaceReducer方法的实现
  }
  function observable() {
    // observable方法的实现
    // (源码中关于observable的部分可以忽略，这个是redux内部使用的。我们在开发中几乎几乎用不到)
  }
  // store被创建后，自动分发一个'INIT' action。渲染出初始化的state树。
  dispatch({ type: ActionTypes.INIT });
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  };
}
```

**完整源码**

```js
// 首先定义了一个 ActionTypes 对象，它是一个 action，是一个 Redux 的私有 action，不允许外界触发，用来初始化 Store 的状态树和改变 reducers 后初始化 Store 的状态树。
export const ActionTypes = {
  INIT: "@@redux/INIT"
};
/**
 * 创建 store, 参数 reducer, state 以及中间件
 */
export default function createStore(reducer, preloadedState, enhancer) {
  // 在平常的使用中，我们一般会省略第二个参数。比如，当我们需要使用redux中间件的时候，就会像第三个参数传递一个applyMiddleware()[返回值是一个function]。
  // 如果，我们没有初始状态，则会省略第二个参数。这个时候，我们的函数调用形式为：
  // const store = createStore(reducer, applyMiddleware(...))
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }


  // 如果我们指定了reducer增强器enhancer
  if (typeof enhancer !== "undefined") {
    // enhancer必须是一个函数
    if (typeof enhancer !== "function") {
      throw new Error("Expected the enhancer to be a function.");
    }
    // 这个函数接收createStore作为参数，并且返回一个函数，这个函数接收的参数是reducer,preloadedState
    // 直接返回经过enhancer包装的对象
    return enhancer(createStore)(reducer, preloadedState);
  }

  
  // 要求传递给createStore的第一个参数必须是一个函数
  if (typeof reducer !== "function") {
    throw new Error("Expected the reducer to be a function.");
  }


  // 保存初始的reducer
  let currentReducer = reducer
  // 保存初始的state
  let currentState = preloadedState
  // 保存所有的事件监听器
  let currentListeners = []
  // 获取当前监听器的一个副本(相同的引用)
  let nextListeners = currentListeners
  // 是否正在派发action
  let isDispatching = false

  // 这个函数可以根据当前监听函数的列表生成新的下一个监听函数列表引用
  // 如果nextListeners和currentListeners具有相同的引用，则获取一份当前事件监听器集合的一个副本保存到nextListeners中
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  // 为什么要维护两份事件监听器列表(nextListeners,currentListeners)??
  // 下面我们来解释

  // 直接返回当前store的state
  function getState() {
    return currentState;
  }

  // 订阅事件，返回移除订阅函数
  function subscribe(listener) {
    // 事件监听器必须是函数，否则会抛出异常
    if (typeof listener !== "function") {
      throw new Error("Expected listener to be a function.");
    }

    // 这个事件监听器是否已经被取消的标志
    let isSubscribed = true

    // 调用这个函数的结果就是生成一份当前事件监听器的一个副本保存到nextListeners中
    ensureCanMutateNextListeners()
    
    // 将新的事件监听器添加到nextListeners中
    nextListeners.push(listener)
    
    // 返回一个取消监听的函数
    return function unsubscribe() {
      // 如果这个监听器已经被取消了，则直接return
      if (!isSubscribed) {
        return;
      }
      // 将监听器是否取消的标志设置为false
      isSubscribed = false
      // 再次生成一份事件监听器集合的副本
      ensureCanMutateNextListeners()
      // 获取到需要取消的事件监听器的索引
      const index = nextListeners.indexOf(listener)
      // 从事件监听器集合中删除这个事件监听器
      nextListeners.splice(index, 1)
    };
  }

  // 从subscribe方法的源码中可以看出，每次在进行监听器的添加/删除之前，都会基于当前的监听器集合生成一个副本保存到nextListeners中。
  // 下面我们继续看dispatch的源码:

  // 执行 reducer，并触发订阅事件
  function dispatch(action) {
    // https://lodash.com/docs#isPlainObject
    // dispatch的参数就是我们需要派发的action，一定要保证这个action是一个纯粹的对象
    // 如果不是一个纯粹的对象，则会抛出异常。
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. " +
          "Use custom middleware for async actions."
      );
    }

    // 判断 action 是否有 type｛必须｝ 属性
    // 派发的action必须有一个type属性(我们可以将这个属性认为就是action的身份证，这样redux才知道你派发的是哪个action，你需要做什么，该怎么为你做)
    // 如果没有这个属性则会抛出异常
    if (typeof action.type === "undefined") {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          "Have you misspelled a constant?"
      );
    }

    // 如果正在 dispatch 则抛出错误
    if (isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }
    // 对抛出 error 的兼容，但无论如何都会继续执行 isDispatching = false 的操作
    try {
      isDispatching = true;
      // 派发action
      // 实质就是将当前的state和你需要派发的action传递给reducer函数并返回一个新的state
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    // 又多了一份事件监听器的列表，简单的说一下这三份列表的作用
    // nextListeners: 保存这次dispatch后，需要触发的所有事件监听器的列表
    // currentListeners: 保存一份nextListeners列表的副本
    // listeners: 需要执行的列表
    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      // 调用所有的事件监听器
      listener()
    }
    //  dispatch的返回值也是十分重要的，如果没有这个返回值，就不可能引入强大的中间件机制。
    return action;
  }
  /**
   * 动态替换 reducer
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error("Expected the nextReducer to be a function.");
    }
    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }
  dispatch({ type: ActionTypes.INIT });
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  };
}
```


## 参考资料

[redux 源码解读－－createStore 源码解析](https://segmentfault.com/a/1190000011835213)
