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

## transform
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

skew,translate,rotate,scale,matrix,perspective

```css
/* Function values */
transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
transform: translate(12px, 50%);
transform: translateX(2em);
transform: translateY(3in);
transform: scale(2, 0.5);
transform: scaleX(2);
transform: scaleY(0.5);
transform: rotate(0.5turn);
transform: skew(30deg, 20deg);
transform: skewX(30deg);
transform: skewY(1.07rad);
transform: matrix3d(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0);
transform: translate3d(12px, 50%, 3em);
transform: translateZ(2px);
transform: scale3d(2.5, 1.2, 0.3);
transform: scaleZ(0.3);
transform: rotate3d(1, 2.0, 3.0, 10deg);
transform: rotateX(10deg);
transform: rotateY(10deg);
transform: rotateZ(10deg);
transform: perspective(17px);
transform: translateX(10px) rotate(10deg) translateY(5px);
```

## transition
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

transition-property，transition-duration，transition-timing-function 和 transition-delay。
```css
/* Apply to 2 properties */
transition: margin-right 4s, color 1s;
/* Apply to all changed properties */
transition: all 0.5s ease-out;
```

## animation
[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction 和 animation-fill-mode.

```css
/* @keyframes duration | timing-function | delay |
   iteration-count | direction | fill-mode | play-state | name */
  animation: 3s ease-in 1s 2 reverse both paused slidein;

/* @keyframes duration | timing-function | delay | name */
  animation: 3s linear 1s slidein;

/* @keyframes duration | name */
  animation: 3s slidein;
```

## String.prototype.split()
split() 方法使用指定的分隔符字符串将一个String对象分割成字符串数组，以将字符串分隔为子字符串，以确定每个拆分的位置。返回原字符串以分隔符出现位置分隔而成的一个Array。**不会改变原字符串。**

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)

```js
var myString = "Hello World. How are you doing?";
var splits = myString.split(" ");  // ["Hello", "World.", "How", "are", "you", "doing?"]
var splits = myString.split(" ", 3); // ["Hello", "World.", "How"]
```

## String.prototype.slice()
slice() 方法提取一个字符串的一部分，并返回一个从原字符串中提取出来的新字符串。**不会改变原字符串。**

```js
var str1 = 'The morning is upon us.';
var str2 = str1.slice(4, -2); // morning is upon u
```

## String.prototype.concat()
concat 方法将一个或多个字符串与原字符串连接合并，形成一个新的字符串并返回。concat 方法并不影响原字符串。
```js
var hello = "Hello, ";
console.log(hello.concat("Kevin", " have a nice day."));  // Hello, Kevin have a nice day.
```

##

## Array.prototype.concat()
concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
```js
var array1 = ['a', 'b', 'c'];
var array2 = ['d', 'e', 'f'];
array1.concat(array2); // ["a", "b", "c", "d", "e", "f"]
```



网址
https://segmentfault.com/a/1190000013396601
https://juejin.im/post/5aa3f7b9f265da23766ae5ae
https://zhuanlan.zhihu.com/p/25855075
https://zhuanlan.zhihu.com/p/32911022
https://juejin.im/post/5b44a485e51d4519945fb6b7#heading-1

https://github.com/yygmind/blog