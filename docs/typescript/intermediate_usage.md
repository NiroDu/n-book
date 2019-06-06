# TypeScript 进阶部分

## 类型别名
类型别名用来给一个类型起个新名字。
```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
上例中，我们使用 `type` 创建类型别名。

类型别名常用于联合类型。

## 字符串字面量类型
**注意，类型别名与字符串字面量类型都是使用 type 进行定义。**

字符串字面量类型用来约束取值只能是某几个字符串中的一个。
```ts
// 我们使用 type 定了一个字符串字面量类型 EventNames，它只能取三种字符串中的一种。
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
// error TS2345: Argument of type '"dbclick"' is not assignable to parameter of type 'EventNames'.
```

## 元组
数组合并了相同类型的对象，而**元组（Tuple）合并了不同类型的对象**。

定义一对值分别为 `string` 和 `number` 的元组：
```ts
let xiaoming: [string, number] = ['Xiao Ming', 25];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：
```ts
let xiaoming: [string, number];
xiaoming[0] = 'Xiao Ming';
xiaoming[1] = 25;

xiaoming[0].slice(1);
xiaoming[1].toFixed(2);
```

当直接对元组类型的变量进行初始化或者赋值的时候，需要提供**所有**元组类型中指定的项。
```
let xiaoming: [string, number];
xiaoming = ['Xiao Ming', 25];
```

只赋值其中一项会报错：
```ts
let xiaoming: [string, number] = ['Xiao Ming'];
// error TS2322: Type '[string]' is not assignable to type '[string, number]'.
// Property '1' is missing in type '[string]'.

let xiaoming: [string, number];
xiaoming = ['Xiao Ming'];
xiaoming[1] = 25;
// error TS2322: Type '[string]' is not assignable to type '[string, number]'.
// Property '1' is missing in type '[string]'.
```

若想只赋值其中一项，可以这么做：
```ts
let xiaoming: [string, number];
xiaoming[0] = 'Xiao Ming';
```

## 类
TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

### ES7 中类的用法
ES7 中有一些关于类的提案，TypeScript 也实现了它们，这里做一个简单的介绍。
#### 实例属性
ES6 中实例的属性只能通过构造函数中的 `this.xxx` 来定义，ES7 提案中可以直接在类里面定义：
```ts
class Animal {
    name = 'Jack';
    constructor() {
        // ...
    }
}
let a = new Animal();
console.log(a.name); // Jack
```
#### 静态属性
ES7 提案中，可以使用 static 定义一个静态属性：
```ts
class Animal {
    static num = 42;
    constructor() {
        // ...
    }
}
console.log(Animal.num); // 42
```

### TypeScript中类的用法
#### public private 和 protected
TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`。
- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，**区别是它在子类中也是允许被访问的**

使用 private 修饰的属性或方法，在子类中也是不允许访问的：
```ts
class Animal {
    private name;
    public constructor(name) {
        this.name = name;
    }
}
class Cat extends Animal {
    constructor(name) {
        super(name);
        console.log(this.name);
    }
}

// error TS2341: Property 'name' is private and only accessible within class 'Animal'.
```

而如果是用 protected 修饰，则允许在子类中访问：
```ts
class Animal {
    protected name;
    public constructor(name) {
        this.name = name;
    }
}
class Cat extends Animal {
    constructor(name) {
        super(name);
        console.log(this.name);
    }
}
```

### 抽象类
`abstract` 用于定义抽象类和其中的抽象方法。
抽象类是供其他类继承的基类，抽象类不允许被实例化：
```ts
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

以及，抽象类中的抽象方法必须在子类中被实现。
```ts
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}
class Cat extends Animal {
// 这里必须要实现父类中的抽象类中的 abstract 方法
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}
let cat = new Cat('Tom');
```

### 类的类型
给类加上 TypeScript 的类型很简单，与接口类似：
```ts
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
      return `My name is ${this.name}`;
    }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

## 类与接口
之前学习过，接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。
现在介绍接口的另一个用途，对类的一部分行为进行抽象。

### 类实现接口
实现（implements）是面向对象中的一个重要概念。
一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：
```ts
interface Alarm {
    alert();
}
class Door {
}
class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

一个类可以实现多个接口：
```ts
// Car 实现了 Alarm 和 Light 接口，既能报警，也能开关车灯。
interface Alarm {
    alert();
}
interface Light {
    lightOn();
    lightOff();
}
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

### 接口继承类
接口也可以继承类：
```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

### 接口继承接口
接口与接口之间可以是继承关系：
```ts
// 使用 extends 使 LightableAlarm 继承 Alarm。
interface Alarm {
    alert();
}

interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}
```

### 混合类型
之前学习过，可以使用接口的方式来定义一个函数需要符合的形状：
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

有时候，一个函数还可以有自己的属性和方法：
```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
	  // 类型断言<Counter>
    let counter = <Counter>function (start: number) { };
	  // 自己的属性和方法
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

### 为什么要有泛型
首先，我们来实现一个函数 createArray，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值：
```ts
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x'); // ['x', 'x', 'x']
```
这段代码编译不会报错，但是一个显而易见的缺陷是，它并没有准确的定义返回值的类型：`Array<any>` 允许数组的每一项都为任意类型。但是我们预期的是，数组中每一项都应该是输入的 value 的类型。

这时候，泛型就派上用场了：
```ts
// 在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

// 接着在调用的时候，可以指定它具体的类型为 `string`。
createArray<string>(3, 'x'); // ['x', 'x', 'x']

// 当然，也可以不手动指定，而让类型推论自动推算出来：
createArray(3, 'x'); // ['x', 'x', 'x']
```

### 多个类型参数
定义泛型的时候，可以一次定义多个类型参数：
```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```
上例中，我们定义了一个 `swap` 函数，用来交换输入的元组。

### 泛型约束
在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：
```ts
// 泛型 T 不一定包含属性 length，所以编译的时候报错了。
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```

这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 `length` 属性的变量。这就是**泛型约束**：
```ts
interface Lengthwise {
    length: number;
}

// 使用了 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性。
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

多个类型参数之间也可以互相约束：
```ts
// 我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

### 泛型接口
之前学习过，可以使用接口的方式来定义一个函数需要符合的形状：
```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

也可以使用含有泛型的接口来定义函数的形状：
```ts
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

进一步，我们可以把泛型参数提前到接口名上：
```ts
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```
注意，此时在使用泛型接口的时候，需要定义泛型的类型。

### 泛型类
与泛型接口类似，泛型也可以用于类的类型定义中：
```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型参数的默认类型
我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```


## 声明合并
如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。

### 函数的合并
之前学习过，我们可以使用**重载**定义多个函数类型：
```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

### 接口的合并
接口中的属性在合并时会简单的合并到一个接口中：
```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}

// 相当于：
interface Alarm {
    price: number;
    weight: number;
}
```

注意，**合并的属性的类型必须是唯一的：**
```ts
interface Alarm {
    price: number;
}
interface Alarm {
    price: string;  // 类型不一致，会报错
    weight: number;
}
// index.ts(5,3): error TS2403: Subsequent variable declarations must have the same type.  Variable 'price' must be of type 'number', but here has type 'string'.
```

接口中方法的合并，与函数的合并一样：
```ts
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}
// 相当于：
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

### 类的合并
类的合并与接口的合并规则一致。