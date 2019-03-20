# MDN笔记

## call
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}
function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}
function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}
var cheese = new Food('feta', 5);
// Food {name: "feta", price: 5, category: "food"}
var fun = new Toy('robot', 40);
// Toy {name: "robot", price: 40, category: "toy"}
```

使用call方法调用函数并且没有确定第一个参数，如果没有传递第一个参数，this的值将会被绑定为全局对象。
```js
var sData = 'Wisen';
function display() {
  console.log('sData value is %s ', this.sData);
}
display.call();  // sData value is Wisen
```

## bind
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

## Object.defineProperty()
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

## e.target与e.currentTarget的区别
e.target 指向触发事件监听的对象。

e.currentTarget 指向添加监听事件的对象（addEventListener监听的那个对象）。

[解析](https://www.jianshu.com/p/1dd668ccc97a)

网址
https://segmentfault.com/a/1190000013396601
https://juejin.im/post/5aa3f7b9f265da23766ae5ae
https://zhuanlan.zhihu.com/p/25855075
https://zhuanlan.zhihu.com/p/32911022
https://juejin.im/post/5b44a485e51d4519945fb6b7#heading-1

https://github.com/yygmind/blog