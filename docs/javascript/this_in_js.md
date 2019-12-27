# “This” in JS

> A function's this keyword behaves a little differently in JavaScript compared to other languages. It also has some differences between **strict mode** and **non-strict mode**.  

## This‘s Value？
**it’s the JavaScript context object in which the current code is executing.**

In most cases, the value of this is determined by how a function is called. It can't be set by assignment during execution, and it may be different each time the function is called. ES5 introduced the `bind()` method to set the value of a function's this regardless of how it's called, and ES2015 introduced arrow functions which don't provide their own this binding (it retains the this value of the enclosing lexical context).

## Case 1 - Global context
> In the global execution context (outside of any function), this refers to the global object whether in strict mode or not.  

## Case 2 - Function context
> Inside a function, the value of this depends on how the function is called.  

### Simple call
Since the following code is not in strict mode, and because the value of this is not set by the call, this will default to the global object, which is window in a browser. 
（非严格模式下，this 默认指向 window）
```js
function f1() {
  return this;
}
// In a browser:
f1() === window; // true 
// In Node:
f1() === global; // true
```

**In strict mode**, however, the value of this remains at whatever it was set to when entering the execution context, so, in the following case, this will default to **undefined**:
```js
function f2() {
  'use strict'; // see strict mode
  return this;
}
f2() === undefined; // true
```

### call() and apply()
To pass the value of this from one context to another, use `call()`, or `apply()`:
```js
// An object can be passed as the first argument to call or apply and this will be bound to it.
var obj = {a: 'Custom'};
// This property is set on the global object
var a = 'Global';
function whatsThis() {
  return this.a;  // The value of this is dependent on how the function is called
}
whatsThis();          // 'Global'
whatsThis.call(obj);  // 'Custom'
whatsThis.apply(obj); // 'Custom'

function add(c, d) {
  return this.a + this.b + c + d;
}
var o = {a: 1, b: 2};
add.call(o, 3, 4); //10
add.apply(o, [10, 20]); //33
```

### bind()
`Function.prototype.bind()`, Calling f.bind(someObject) creates a new function with the same body and scope as f, but where `this` occurs in the original function, in the new function it is permanently bound to the first argument of bind, regardless of how the function is being used.
```js
function f() {
  return this.a;
}
var g = f.bind({a: 'azerty'});
console.log(g()); // azerty
var h = g.bind({a: 'yoo'}); // bind only works once!
console.log(h()); // azerty
var o = {a: 37, f: f, g: g, h: h};
console.log(o.a, o.f(), o.g(), o.h()); // 37,37, azerty, azerty
```

### Arrow functions
In arrow functions, `this` retains the value of the enclosing lexical context's `this`.
（不会创建自己的this,它只会从自己的作用域链的上一层继承this）
```js
function myFunc() {
  this.myVar = 0;
  setTimeout(() => {
    this.myVar++;
    console.log(this.myVar) // 1
  }, 0);
}
```

### As an object method
```js
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};
function independent() {
  return this.prop;
}
o.f = independent;
console.log(o.f()); // 37
```
Similarly, the this binding is **only** affected by the most immediate member reference.
```js
o.b = {g: independent, prop: 42};
console.log(o.b.g()); // 42
// we call it as a method g of the object o.b. This time during execution, this inside the function will refer to o.b
```

### As a constructor
When a function is used as a constructor (with the new keyword), its `this` is bound to the new object being constructed.
```js
function C() {
  this.a = 37;
}
var o = new C();
console.log(o.a); // 37

function C2() {
  this.a = 37;
  return {a: 38};
}
o = new C2();
console.log(o.a); // 38
```

### In an inline event handlerSection
When the code is called from an inline on-event handler, its `this` is set to the DOM element on which the listener is placed:
```html
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```
alert shows `button`.

```html
<button onclick="alert((function() { return this; })());">
  Show inner this
</button>
```
In this case, the inner function's `this` isn't set so it returns the global/window object.

