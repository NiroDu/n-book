# Redux 中级部分

## UI 组件和容器组件拆分

UI 组件负责页面的渲染，容器组件负责页面逻辑。

## 无状态组件

一个组件，只有一个 render 函数，没有 state，那我们可以将其改写成 **无状态组件**。
无状态组件优点：性能好。一个无状态组件会比普通组件(class)少了生命周期等等状态。

原先的 UI 组件，可以改写成无状态组件。
![图片](https://images-cdn.shimo.im/8zxIjC5aqlojxSEW/image.png!thumbnail)

改写为无状态组件

1. 无状态组件实质就是一个函数，直接把类改成函数。
2. this.props 直接改为入参 props。

![图片](https://images-cdn.shimo.im/j84SkPrkhak4jHdN/image.png!thumbnail)

## 6-3 Redux 中发送异步请求获取数据

actionCreators.js
![图片](https://images-cdn.shimo.im/y4gwxErHqlwc323u/image.png!thumbnail)
TodoList.js
![图片](https://images-cdn.shimo.im/Q6FJFUqK5HY4Zdjc/image.png!thumbnail)
reducer.js![图片](https://images-cdn.shimo.im/yAThKtdaIP0VVjTu/image.png!thumbnail)

## 6-4 使用 Redux-thunk 中间件实现 ajax 数据请求

Redux 默认 action 只能是个对象。
Redux-thunk 使得 action 不仅仅是个对象，还可以是个函数。
Redux-thunk 建议的是把异步操作放到 action 里去操作，这样有助于自动化测试和代码的管理 。

redux-devtools 引用中间件指南：[https://github.com/zalmoxisus/redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
![图片](https://images-cdn.shimo.im/YfHp6WVXcwkB7oPd/image.png!thumbnail)

/store/index.js
![图片](https://images-cdn.shimo.im/6TV28Hh93wwK9bN0/image.png!thumbnail)

TodoList.js
![图片](https://images-cdn.shimo.im/DLEoQcOcBsYEk5kl/image.png!thumbnail)
actionCreators.js
![图片](https://images-cdn.shimo.im/vZwYRgp2Cp8MO0w3/image.png!thumbnail)
reducer.js
![图片](https://images-cdn.shimo.im/MDklL05vHJ0XH6GP/image.png!thumbnail)

流程：引入 redux-thunk ，组件创建完毕后，action 通过 store.dispatch(getTodoList()) 传给 store，store 发现是个函数，就执行了这个函数。当调用的是个函数的时候，这个函数能够接受到 dispatch 参数， 所以在 axios 请求到数据后，getTodoList() 直接 dispatch 数据到 store ，store 再自动传给 reducer 去执行。

这么做的目的还是，为了之后复杂的逻辑要单独拎到一个地方管理。

## 6-5 什么是 Redux 的中间件

![图片](https://images-cdn.shimo.im/Apih0T1CRkIvvZpE/image.png!thumbnail)

**Redux 中间件，指的是 Action 和 Store 中间。**
**中间件实际上是对 dispatch 方法的一个封装或者说是升级。**

原始流程：dispatch 方法它接收到 action 的一个对象后，会把这个对象传递给 Store，再由 Store 自动传给 Reducer 处理。

用了 Redux-thunk 做中间件后，假如 action 是一个对象，那和原来一样会直接传给 Store；但假如 action 是个函数，则不会直接传递给 Store，而是先去执行这个函数的内容（拓展了额外的操作），然后再在这个函数中去 dispatch 给 Store，再由 Store 自动传给 Reducer 去处理。

## 6-6/7 Redux-saga 中间件使用入门

redux-saga 将异步的过程集中到一个文件(sagas.js)中去管理。
即在 component 去 dispatch 一个 action 的时候，Store 接收到会自动转发给 Reducer (标准流程)，同时这个 action 也会被 saga 捕获到。**两边都会接收到！**

引入 redux-saga 指南： [https://github.com/redux-saga/redux-saga](https://github.com/redux-saga/redux-saga)

/store/index.js
![图片](https://images-cdn.shimo.im/Py0L8qNOz2UcYk73/image.png!thumbnail)

/sagas.js
把异步操作都放到这个文件中去做，这个文件必须返回一个 generator 函数，但里面其他的方法可以是普通函数。
takeEvery 用于捕获指定的 action，第一个参数是 action 的 Type，第二个参数是捕获到后执行的方法。 在下面的这个例子中意思就是 捕获 type 为 GET_INIT_LIST 的 action，捕获到后执行 getInitList 方法。
put 和 store.dispatch 一样的功能。
![图片](https://images-cdn.shimo.im/Mqtji1MEuYQVFLCZ/image.png!thumbnail)

## 6-8 如何使用 React-redux

React-redux 是 React 官方提供的 Redux 用法。

<Provider /> 它将 Store 提供给被它包裹的所有组件，这些组件就可以直接去调用 Store。但光提供还不够，还需要组件去连接，即结合 connect 一块使用。
使用 connect 去给组件 TodoList 和 Store 做连接，connect 有两个参数，声明两个连接的规则。

```
connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

/index.js
先引入 react-redux，并写好 <Provider /> 并且将 Store 传给<Provider />。
![图片](https://images-cdn.shimo.im/l2ScQavszWYHTha3/image.png!thumbnail)

/TodoList.js
![图片](https://images-cdn.shimo.im/8hgEpmjYYS864KDI/image.png!thumbnail)
mapStateToProps：把 Store 里的 state 映射成 组件里的 props。
mapDispatchToProps：使 store.dispatch 映射到 组件的 props 上，然后组件元素可直接调用 dispatch 方法。

**以及这里的 export 出去的 connect ()(TodoList)，本质是一个封装后的 TodoList 对象，它结合了 \*\***React-redux 赋予它的特性。\*\*

/TodoList.js
两个 map 映射 store 和 dispatch 给到了 props，所以这个组件里上部分的代码可以直接这么写：
![图片](https://images-cdn.shimo.im/5xCV5I3vpE0xeRzj/image.png!thumbnail)

/store/reducer.js
刚刚在组件 changeInputValue 方法里 dispatch 出的 action， reducer 和之前一样正常写。
![图片](https://images-cdn.shimo.im/nL9myWu710IiPh7I/image.png!thumbnail)

## 代码优化

上述的 action 需要从对象改成一个函数的模式（actionCreators）
要声明 action.type 为一个个变量而不是直接使用字符串（actionTypes）

待改进的：
![图片](https://images-cdn.shimo.im/u2Go6maSnyI5X5e8/image.png!thumbnail)

改进后：
![图片](https://images-cdn.shimo.im/JaySe6lJrBMkgV6G/image.png!thumbnail)
