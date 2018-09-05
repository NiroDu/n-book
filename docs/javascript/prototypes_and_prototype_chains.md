# Prototypes and prototype chains
#前端/文章

这篇文章主要解决两个问题：
1. how prototype chains work?
2. how the prototype property can be used to add methods to existing constructors?

## 定义
> JavaScript is often described as a prototype-based language — **each object has a prototype object**, which acts as a template object that it inherits methods and properties from. An object's prototype object may also have a prototype object, which it inherits methods and properties from, and so on. This is often referred to as a `prototype chain`, and explains why different objects have properties and methods defined on other objects available to them.

**To be exact, the properties and methods are defined on the prototype property on the Objects' constructor functions, not the object instances themselves.**

In JavaScript, a link is made between the object instance and its prototype (its `__proto__` property, which is derived from the prototype property on the constructor), and the properties and methods are found by walking up the chain of prototypes.

::: warning Note
It's important to understand that there is a distinction between an **object's prototype** (which is available via Object.getPrototypeOf(obj), or via the deprecated __proto__ property) and **the prototype property on constructor functions**. The former is the property on each instance, and the latter is the property on the constructor. That is, Object.getPrototypeOf(new Foobar()) refers to the same object as Foobar.prototype.
:::

## Understanding prototype objects
Let's look at an example to make this a bit clearer:
In this example, we have defined a constructor function, like so:
```js
function Person(first, last, age, gender, interests) {  
  // property and method definitions
  this.first = first;
  this.last = last;
}
```

We have then created an object instance like this:
```js
var person1 = new Person('Bob', 'Smith', 32, 'male', ['music', 'skiing']);
```

This demonstrates the prototype chain working.

So what happens if you call a method on person1, which is actually defined on Object?
 For example:
```js
person1.valueOf()
```

This method simply returns the value of the object it is called on — try it and see! In this case, what happens is:
1. The browser initially checks to see if the `person1` object has a `valueOf()` method available on it.
2. It doesn't, so the browser then checks to see if the `person1 object's prototype object` (Person() constructor's prototype) has a `valueOf()` method available on it.
3. It doesn't either, so the browser then checks to see if the `Person() constructor's prototype object's prototype object `(Object() constructor's prototype) has a `valueOf()` method available on it. It does, so it is called, and all is good!

::: warning Note
There isn't officially a way to access an object's prototype object directly — the "links" between the items in the chain are defined in an internal property, referred to as `[[prototype]]` in the specification for the JavaScript language. Most modern browsers however do have a property available on them called `__proto__ `, which contains the object's constructor's prototype object. For example, try `person1.__proto__` and `person1.__proto__.__proto__` to see what the chain looks like in code!
:::

This demonstrates `person1.__proto__` and `person1.__proto__.__proto__` structure:

Since ECMAScript 2015 we can access an object's prototype object indirectly via Object.getPrototypeOf(obj).

## The prototype property: Where inherited members are defined

