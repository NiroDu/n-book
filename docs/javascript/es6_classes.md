# ES6 Classes
## 声明一个类
Classes are in fact "special functions", and just as you can define function expressions and function declarations, the class syntax has two components:  **class declarations** and **class expressions**

### Class declarations
```js
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}
```

### Class expressions
```js
// unnamed
let Rectangle = class {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};
console.log(Rectangle.name);
// output: "Rectangle"

// named
let Rectangle = class Rectangle2 {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
};
console.log(Rectangle.name);
// output: "Rectangle2"
```

## 声明类的成员
### Constructor
The `constructor` method is a special method for creating and initializing an object created with a `class`.
There can **only** be one special method with the name `"constructor"` in a `class`.

### Static methods
The static keyword defines a static method for a class. Static methods are called without instantiating their class and cannot be called through a class instance. Static methods are often used to create utility functions for an application.
（调用静态方法不需要实例化类，也不能通过类的实例去调用。）
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2)); // 7.0710678118654755
```

### Autoboxing in Class （自动装箱）
When a static or prototype method is called without a value for `this`, the this value will be `undefined` inside the method.
because code within the `class` body's syntactic boundary is always executed **in strict mode**.
Autoboxing will not happen in strict mode.
（因为类body的执行环境总是严格模式，不会`Autoboxing`，所以`this`值保持不变，即还是`undefined`）
```js
class Animal { 
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

let obj = new Animal();
obj.speak(); // Animal {}
let speak = obj.speak;
speak(); // undefined

Animal.eat() // Class Animal
let eat = Animal.eat;
eat(); // undefined
```

而用传统的函数语法实现上面的代码。则会`Autoboxing`，So, If the initial value is `undefined`, this will be set to the `global object`.
```js
function Animal() { }

Animal.prototype.speak = function() {
  return this;
}

Animal.eat = function() {
  return this;
}

let obj = new Animal();
let speak = obj.speak;
speak(); // global object

let eat = Animal.eat;
eat(); // global object
```

## Sub classing with `extends`
The `extends` keyword is used in `class declarations` or `class expressions` to **create a class as a child of another class.**

先看第一种 `extend` 的例子（类与类之间）：
```js
class Animal { 
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // call the super class constructor and pass in the name parameter
  }
  speak() {
    console.log(this.name + ' barks.');
  }
}

let d = new Dog('Mitzie');
d.speak(); // Mitzie barks.
```

再看第二种 `extend` 的例子（类与传统函数之间）：
```js
function Animal (name) {
  this.name = name;  
}

Animal.prototype.speak = function () {
  console.log(this.name + ' makes a noise.');
}

class Dog extends Animal {
  speak() {
    console.log(this.name + ' barks.');
  }
}

let d = new Dog('Mitzie');
d.speak(); // Mitzie barks.
```

再看第三种 `extend` 的例子（类与常规变量之间，不可以直接 `extend`）：
::: warning
需要注意的是：Classes cannot `extend` regular objects. If you want to inherit from a regular object, you can instead use `Object.setPrototypeOf()`
:::
```js
const Animal = {
  speak() {
    console.log(this.name + ' makes a noise.');
  }
};

class Dog {
  constructor(name) {
    this.name = name;
  }
}

// If you do not do this you will get a TypeError when you invoke speak
Object.setPrototypeOf(Dog.prototype, Animal);

let d = new Dog('Mitzie');
d.speak(); // Mitzie makes a noise.
```

## Super class calls with super
The `super` keyword is used to call corresponding methods of super class. This is one advantage over prototype-based inheritance.

e.g. A constructor can use the `super` keyword to call the constructor of the super class.

```js
class Cat { 
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Lion extends Cat {
  speak() {
    super.speak();// 假若去掉了这一句，则调用speak()时，只会输出 `${this.name} roars.`
    console.log(`${this.name} roars.`);
  }
}

let l = new Lion('Fuzzy');
l.speak();
// Fuzzy makes a noise.
// Fuzzy roars.
```

## Mix-ins
`mix-ins` is template for classes.
An ECMAScript `class` can only have a single `superclass`，`Mix-ins` 使得一个类实现多重继承（同时继承多个父类）

```js
let MyMixin = (superclass) => class extends superclass {  
  foo() {
    console.log('foo from MyMixin');
  }
};
class MyClass extends MyMixin(MyBaseClass) {  
  /* ... */
}
let c = new MyClass();  
c.foo(); // prints "foo from MyMixin"  
```

当需要多个 Mixin 继承时，Mixin1, Mixin2, Mixin3…
```js
class MyClass extends Mixin1(Mixin2(MyBaseClass)) {  
  /* ... */
}
```
关于 Mix-ins 想了解更多可以访问 [“Real” Mixins with JavaScript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)

## 参考资料
[Classes - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Defining_classes)