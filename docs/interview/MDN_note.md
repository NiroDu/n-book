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

## JS浮点数运算的精度问题
```js
console.log(0.1+0.2==0.3) // false
```
[解答](https://www.html.cn/archives/7340)

## ES6的const并非一定为常量
```js
const foo = {};
foo.name = "a";
console.log(foo.name); // 打印 "a"
```
const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
但**对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了**。因此，将一个对象声明为常量必须非常小心。

[解答](https://blog.fundebug.com/2018/07/25/es6-const/)


网址
https://segmentfault.com/a/1190000013396601
https://juejin.im/post/5aa3f7b9f265da23766ae5ae
https://zhuanlan.zhihu.com/p/25855075
https://zhuanlan.zhihu.com/p/32911022
https://juejin.im/post/5b44a485e51d4519945fb6b7#heading-1

https://github.com/yygmind/blog