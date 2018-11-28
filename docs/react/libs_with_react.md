# Libs with React
# 使用 styled-components
使用这个第三方工具来写 css，好处是可以组件化。
文档：[https://github.com/styled-components/styled-components](https://github.com/styled-components/styled-components)

```jsx
import { injectGlobal } from 'styled-components';
import styled from 'styled-components';
import logoPic from '../../statics/logo.png';

// 注入全局样式
injectGlobal`
    body {
        ...
    }
`
// div标签
export const HeaderWrapper = styled.div`
    height: 56px;
    .topic-pic {
        display: block;
    }
    &.same-level-HeaderWrapper {
      ...
    }
`;
// a 标签上的属性，及引用图片
export const Logo = styled.a.attrs({
    href: '/'
})`
    background: url(${logoPic});
    background-size: contain;
`;
```

```jsx
// JSX 中直接使用，也可以额外增加类名
<HeaderWrapper>
  <Logo className="" />
</HeaderWrapper>
```
## 怎样接收外部变量？
因为它的本质是一个StyledComponent对象组件，从组件外部接收变量，就和正常的React一样传递，在 style.js 里用 props 接收：
![图片](https://images-cdn.shimo.im/gSOYYUBZZIIyZ9Ne/image.png!thumbnail)![图片](https://images-cdn.shimo.im/CRGFqTqr4pwiMOAd/image.png!thumbnail)
## StyledComponent 对象
一个元素是 styled-components 渲染出来的话，那它是 StyledComponent 对象。
用 ref 去获取只能获取到 StyledComponent 对象而不是 DOM。
![图片](https://images-cdn.shimo.im/epJ71s8ABCkobO0d/image.png!thumbnail)
![图片](https://images-cdn.shimo.im/oeeB62EkKxAW6ugW/image.png!thumbnail)

这时候可以使用 styled-components 提供的 innerRef ，就可以获取到真实 DOM。
![图片](https://images-cdn.shimo.im/oGCynIY78sA8o4Ff/image.png!thumbnail)

/src/common/header/index.js
![图片](https://images-cdn.shimo.im/hqQcUkv0Mp4Vp1OO/image.png!thumbnail)
# API - combineReducers
当 reducer 的数量越来越多时，逻辑全放在一个 /src/store/reducer.js 里去操作显然不合理，于是要继续拆分：将属于某个组件相关的 reducer 操作，放在这个组件相关的 reducer.js 里去做，全局的 /src/store/reducer.js 只负责组织和管理各个组件的 reducer 操作。

**combineReducers 便提供了合并各个组件 reducer 的功能。**

/src/store/reducer.js
![图片](https://images-cdn.shimo.im/iUJYVXjBqM4IKLla/image.png!thumbnail)
引入了和 header 组件相关的 reducer 操作。

/src/common/header/store/index.js
![图片](https://images-cdn.shimo.im/sYYQk2biUE8ndK4G/image.png!thumbnail)
index 做一个出口文件。

/src/common/header/store/reducer.js
![图片](https://images-cdn.shimo.im/gRvo7TrGN2siJ9dL/image.png!thumbnail)
对于跟 header 组件相关的 reducer 操作，放到这里来做（但这个代码有问题，它直接去修改了state 的值）

/src/common/header/index.js

在组件里引用 Store 里的 state 值，便要改成 state.header 。
## 关于 **combineReducers **合并多个小的 reducer 后 dispatch 的接收问题？
dispatch的时候，不仅是全局大的reducer可以接收到dispatch，小的reducer也可以接收到dispatch，所以可以直接在小的reducer里去匹配action.type，再做逻辑处理。
# Immutable
## 使用 Immutable.js 来管理store中的数据
为了避免 state 被外部直接更改，facebook 出了这个库，将 JS 转变成 Immutable 对象，以确保没有错误更改了 Store 里的 state 值，如：上面提到的header 组件 reducer 代码问题。

文档：[https://github.com/facebook/immutable-js](https://github.com/facebook/immutable-js)

API：**fromJS** 将 JS 对象转化成一个 Immutable 对象。
**toJS()** 将 Immutable 对象转化成一个JS 对象。

/src/common/header/store/reducer.js
![图片](https://images-cdn.shimo.im/iNSlVQ20dtMWjZRZ/image.png!thumbnail)
用 fromJS 方法将原来只是一个 JS 对象的 defaultState 转变成一个 Immutable 对象，然后下面的 state 因为被转变成 Immutable 对象了，所以取值的时候不能再像取 JS 的对象的值一样用 点(.) 去取值，改成 Immutable 中的 set() 方法去设置。
这个方法实质上也没有直接修改state的值，而是结合设置的值后，返回一个新的对象给 Store。

/src/common/header/index.js
![图片](https://images-cdn.shimo.im/hvokaX5ZdWkE1ZCY/image.png!thumbnail)
因为 state.header 已经转变成 Immutable 对象，所以不能用点(.)取值，使用 get() 方法。

但是这种写法很奇怪，全局的 state 还是 JS 对象，但是 state.header 是 Immutable 对象，所以我们需要将它们统一，即用 **redux-immutable **将全局的 state 也变成 Immutable 对象。
## 使用 redux-immutable 统一数据格式
文档：[https://github.com/gajus/redux-immutable](https://github.com/gajus/redux-immutable)

安装好redux-immutable后，将/src/store/reducer.js原来的：
```
import { combineReducers } from 'redux';
```
改成：
![图片](https://images-cdn.shimo.im/hfUFDuPEsbsKNcxg/image.png!thumbnail)
即引入完成。

这时候全局的 state 也是 Immutable 对象了，所以可以直接取值。
![图片](https://images-cdn.shimo.im/HuSZdUA33YILFTul/image.png!thumbnail)
Immutable 对象执行多个 get() 时，可以用 getIn() 来简化代码，性能也更好。

Immutable 对象执行多个 set() 时，可以用 merge() 来简化代码，性能也更好。
下面两句是等价的：
![图片](https://images-cdn.shimo.im/7WuHNfUPvdQO9g2U/image.png!thumbnail)
## immutable对象的循环展示
## ![图片](https://images-cdn.shimo.im/ypMq2W3lGEw9dK9z/image.png!thumbnail)
![图片](https://images-cdn.shimo.im/X9ps6P8fMKAza5RH/image.png!thumbnail)
## immutable对象和数组对象
axios接收到的数据里的数组不是immutable对象，但是state里的数组对象都已经变成了immutable对象，若是需要把数据给state里的数组对象，把数组对象转化为 immutable 对象。

/src/pages/home/store/actionCreators.js
![图片](https://images-cdn.shimo.im/Z9BPXdXGNvkk0As8/image.png!thumbnail)

/src/pages/home/store/reducer.js
![图片](https://images-cdn.shimo.im/afDI38aUro0n3mxR/image.png!thumbnail)
在merge的时候，使用fromJS将它们转化为immutable对象。

# redux-thunk 应用
作为中间件，可以先dispatch出一个函数去做axios请求数据处理，得到数据后再去dispatch。

像这样的形式：
```jsx
dispatch(Function() {
  dispatch()
})
```

/src/pages/home/index.js
![图片](https://images-cdn.shimo.im/xm5dD6MyskwkbSeC/image.png!thumbnail)

/src/pages/home/store/actionCreators.js
![图片](https://images-cdn.shimo.im/V7XhEL693ukru84E/image.png!thumbnail)

/src/pages/home/store/reducer.js
![图片](https://images-cdn.shimo.im/ERu0KmgxX4MQhMmP/image.png!thumbnail)
# PureComponent
当组件都 connect 之后，一旦 state 发生了变化，所有 connect 的组件都会重新渲染，性能低。
react fiber 中提供了一个 PureComponent ，它在底层实现了自动比对虚拟DOM功能，使用它可以让我们不用一个个组件的去写**shouldComponentUpdate**去对比内容的变化，再决定是否更新。用法只需要将 PureComponent 去替换 Component 即可。但是使用这个 PureComponent 最好结合着 Immutable.js 一块使用，不然容易有坑。
# 组件分包加载
文档：[https://github.com/jamiebuilds/react-loadable](https://github.com/jamiebuilds/react-loadable)

在要分包加载的组件Detail组件文件夹里创建 loadable.js
![图片](https://images-cdn.shimo.im/JDTMrBNazR8sXNOk/image.png!thumbnail)

然后在路由的地方引入
![图片](https://images-cdn.shimo.im/zKZsfLiMtDAXZqgL/image.png!thumbnail)

分包加载的结构（只加载了 Detail）：
![图片](https://images-cdn.shimo.im/TSEwbOPXnQsS7gxe/image.png!thumbnail)
