# Inheritance and the prototype chain 1 (继承与原型链 - 上)

## 写在前面
(the `class` keyword is introduced in ES2015, but is syntactical sugar, JavaScript remains prototype-based).

When it comes to inheritance, JavaScript only has one construct: `objects`. 
Each object has a private property which holds a link to another object called its **prototype**. That prototype object has a prototype of its own, and so on until an object is reached with `null` as its prototype. By definition, `null` has no prototype, and acts as **the final link in this prototype chain.**

**Nearly all objects in JavaScript are instances of `Object` which sits on the top of a prototype chain.**

For example：
```js
function Foo(){};
var foo = new Foo();
console.log(foo.__proto__ === Foo.prototype); // ture
console.log(Foo.prototype.__proto__ === Object.prototype); // true
```

![inheritance_and_the_prototype_chain_1](./images/inheritance_and_the_prototype_chain_1/inheritance_and_the_prototype_chain_1.png)

## Inheritance with the prototype chain
### Inheriting properties
When trying to access a property of an object, the property will not only be sought on the object but on the prototype of the object, the prototype of the prototype, and so on until either a property with a matching name is found or the end of the prototype chain is reached.

Here is what happens when trying to access a property:
```js
// Let's create an object o from function f with its own properties a and b:
let f = function () {
   this.a = 1;
   this.b = 2;
}
let o = new f(); // {a: 1, b: 2}

// add properties in f function's prototype
f.prototype.b = 3;
f.prototype.c = 4;

// do not set the prototype f.prototype = {b:3,c:4}; this will break the prototype chain
// o.[[Prototype]] has properties b and c.
// o.[[Prototype]].[[Prototype]] is Object.prototype.
// Finally, o.[[Prototype]].[[Prototype]].[[Prototype]] is null.
// This is the end of the prototype chain, as null,
// by definition, has no [[Prototype]].
// Thus, the full prototype chain looks like:
// {a: 1, b: 2} ---> {b: 3, c: 4} ---> Object.prototype ---> null

console.log(o.a); // 1
// Is there an 'a' own property on o? Yes, and its value is 1.

console.log(o.b); // 2
// Is there a 'b' own property on o? Yes, and its value is 2.
// The prototype also has a 'b' property, but it's not visited. 
// This is called "property shadowing."

console.log(o.c); // 4
// Is there a 'c' own property on o? No, check its prototype.
// Is there a 'c' own property on o.[[Prototype]]? Yes, its value is 4.

console.log(o.d); // undefined
// Is there a 'd' own property on o? No, check its prototype.
// Is there a 'd' own property on o.[[Prototype]]? No, check its prototype.
// o.[[Prototype]].[[Prototype]] is null, stop searching,
// no property found, return undefined.
```

Setting a property to an object creates an own property. The only exception to the getting and setting behavior rules is when there is an inherited property with a [getter or a setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters).

### Inheriting “methods”
JavaScript does not have "methods" in the form that class-based languages define them. In JavaScript, any function can be added to an object in the form of a property. 

::: warning
When an inherited function is executed, the value of `this` points to **the inheriting object**, not to the prototype object where the function is an own property.
:::
for example:
```js
var o = {
  a: 2,
  m: function() {
    return this.a + 1;
  }
};

console.log(o.m()); // 3
// When calling o.m in this case, 'this' refers to o

var p = Object.create(o);
// p is an object that inherits from o

p.a = 4; // creates a property 'a' on p
console.log(p.m()); // 5
// when p.m is called, 'this' refers to p.
// So when p inherits the function m of o, 
// 'this.a' means p.a, the property 'a' of p
```

## Different ways to create objects and the resulting prototype chain
### Objects created with syntax constructs
```js
var o = {a: 1};

// The newly created object o has Object.prototype as its [[Prototype]]
// o has no own property named 'hasOwnProperty'
// hasOwnProperty is an own property of Object.prototype. 
// So o inherits hasOwnProperty from Object.prototype
// Object.prototype has null as its prototype.
// o ---> Object.prototype ---> null

var b = ['yo', 'whadup', '?'];

// Arrays inherit from Array.prototype 
// (which has methods indexOf, forEach, etc.)
// The prototype chain looks like:
// b ---> Array.prototype ---> Object.prototype ---> null

function f() {
  return 2;
}

// Functions inherit from Function.prototype 
// (which has methods call, bind, etc.)
// f ---> Function.prototype ---> Object.prototype ---> null
```

### With a constructor
A **"constructor"** in JavaScript is just a function that happens to be called with the `new` operator.
```js
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v) {
    this.vertices.push(v);
  }
};

var g = new Graph();
// g is an object with own properties 'vertices' and 'edges'.
// g.[[Prototype]] is the value of Graph.prototype when new Graph() is executed.
```

### With `Object.create`
```js
var a = {a: 1}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (inherited)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); 
// undefined, because d doesn't inherit from Object.prototype
```

### With the `class` keyword
The new keywords include [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class),  [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor),  [static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static),  [extends](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends), and [super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).
```js
'use strict';

class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}
var square = new Square(2);
```

## Performance
The lookup time for properties that are high up on the prototype chain can have a negative impact on the performance, and this may be significant in the code where performance is critical. 

Additionally, trying to access nonexistent properties will always traverse the full prototype chain.

To check whether an object has a property defined on itself and not somehere on its prototype chain, it is necessary to use the `hasOwnProperty` method which all objects inherit from `Object.prototype`. 

`hasOwnProperty` is the **only** thing in JavaScript which deals with properties and does not traverse the prototype chain.

 let's take the above graph example code to illustrate it:
```js
console.log(g.hasOwnProperty('vertices'));
// true

console.log(g.hasOwnProperty('nope'));
// false

console.log(g.hasOwnProperty('addVertex'));
// false

console.log(g.__proto__.hasOwnProperty('addVertex'));
// true
```

Note: It is not enough to check whether a property is `undefined`. The property might very well exist, but its value just happens to be set to `undefined`.

## Summary of methods for extending the protoype chain
[Look here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#Summary_of_methods_for_extending_the_protoype_chain)

## 参考资料
[Inheritance and the prototype chain - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#Summary_of_methods_for_extending_the_protoype_chain)