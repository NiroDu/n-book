# TypeScript 基础部分

> 这篇文章的记录目的是为了自己快速查询语法，如需详细版请访问：[TypeScript 入门教程](https://ts.xcatliu.com/)

## 原始数据类型
### 布尔值
```ts
let isDone: boolean = false;
```

注意，使用构造函数 Boolean 创造的对象不是布尔值：
```ts
let createdByNewBoolean: boolean = new Boolean(1);
// error TS2322: Type 'Boolean' is not assignable to type 'boolean'.
```

事实上 new Boolean() 返回的是一个 Boolean 对象：
```ts
let createdByNewBoolean: Boolean = new Boolean(1);
```

直接调用 Boolean 也可以返回一个 boolean 类型：
```ts
let createdByBoolean: boolean = Boolean(1);
```

### 数值
```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

### 字符串
```ts
let myName: string = 'Tom';
let myAge: number = 25;
// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```

编译结果：
```js
var myName = 'Tom';
var myAge = 25;
// 模板字符串
var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next month.";
```

### 空值
JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 void 表示没有任何返回值的函数：
```ts
function alertName(): void {
    alert('My name is Tom');
}
```

声明一个 void 类型的变量没有什么用，因为你**只能**将它赋值为 `undefined` 和 `null`：
```ts
let unusable: void = undefined;
```

### Null 和 Undefined
```ts
let u: undefined = undefined;
let n: null = null;
// undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null。
```

与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量：
```ts
// 这样不会报错
let num: number = undefined;
// 这样也不会报错
let u: undefined;
let num: number = u;
```

而 void 类型的变量不能赋值给 number 类型的变量：
```ts
let u: void;
let num: number = u;
// error TS2322: Type 'void' is not assignable to type 'number'.
```

## 任意值
### 什么是任意值类型
任意值（Any）用来表示允许赋值为任意类型。

如果是一个普通类型，在赋值过程中改变类型是不被允许的。但如果是 `any` 类型，则允许被赋值为任意类型。
```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;
// error TS2322: Type 'number' is not assignable to type 'string'.

let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

### 任意值的属性和方法
在任意值上访问任何属性都是允许的，也允许调用任何方法：
```ts
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);

let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
```

**声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。**

### 未声明类型的变量
**变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：**
```ts
// 只声明，未赋值
// 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：
let something;
// 等价于
let something: any;
```

## 类型推论
如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。
```ts
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
// error TS2322: Type 'number' is not assignable to type 'string'.

// 事实上，它等价于:
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;
// TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。
```

## 联合类型
联合类型（Union Types）表示取值可以为多种类型中的一种。
联合类型使用 `|` 分隔每个类型。
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

let myFavoriteNumber: string | number;
myFavoriteNumber = true;
// error TS2322: Type 'boolean' is not assignable to type 'string | number'.
// Type 'boolean' is not assignable to type 'number'.
```

### 访问联合类型的属性或方法
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法。

访问 string 和 number 的共有属性是没问题的：
```ts
function getString(something: string | number): string {
    return something.toString();
}
```

但不能访问非共有属性：
```ts
function getLength(something: string | number): number {
    return something.length;
}
// error TS2339: Property 'length' does not exist on type 'string | number'.
// Property 'length' does not exist on type 'number'.
// length 不是 string 和 number 的共有属性，所以会报错。
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：
```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错
// error TS2339: Property 'length' does not exist on type 'number'.

// 上例中，第二行的 myFavoriteNumber 被推断成了 string，访问它的 length 属性不会报错。
// 而第四行的 myFavoriteNumber 被推断成了 number，访问它的 length 属性时就报错了。
```

## 接口
### 什么是接口
在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

在面向对象语言中，接口（Interfaces）是对行为的抽象，而具体如何行动需要由类（classes）去实现（implements）。
TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。
```ts
// 接口一般首字母大写。有的编程语言中会建议接口的名称加上 I 前缀。
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25
};
// 约束了 tom 的形状必须和接口 Person 一致。
```

**赋值的时候，变量的形状必须和接口的形状保持一致。**
定义的变量比接口少了一些属性是不允许的，多一些属性也是不允许的：
```ts
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom'
};
// error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
// Property 'age' is missing in type '{ name: string; }'.

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
// error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
// Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

### 可选属性
有时我们希望不要完全匹配一个形状，那么可以用可选属性`?`。
这时仍然不允许添加未定义的属性：
```ts
// 选属性的含义是该属性可以不存在。
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
// 上面都是 OK 的，但是不能声明接口中没有的属性
```

### 任意属性
有时候我们希望一个接口允许有任意的属性，可以使用如下方式：
```ts
// 使用 [propName: string] 定义了任意属性取 string 类型的值。
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}
// 可以使用接口中没有定义的属性了
let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

**需要注意的是，一旦定义了任意属性，那么`确定属性`和`可选属性`都必须是它的子属性：**
```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}
// age是可选属性，在这里必须得是string类型了
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
// error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
// Index signatures are incompatible.
// Type 'string | number' is not assignable to type 'string'.
// Type 'number' is not assignable to type 'string'.

// 在报错信息中可以看出，此时 { name: 'Tom', age: 25, gender: 'male' } 的类型被推断成了 { [x: string]: string | number; name: string; age: number; gender: string; }，这是联合类型和接口的结合。
```

### 只读属性
有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 `readonly` 定义只读属性。

**只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候：**
```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757

// error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
// Property 'id' is missing in type '{ name: string; gender: string; }'.
// error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
// 上例中，报错信息有两处，第一处是在对 tom 进行赋值的时候，没有给 id 赋值。
// 第二处是在给 tom.id 赋值的时候，由于它是只读属性，所以报错了。
```

### 用接口定义函数的形状
我们也可以使用接口的方式来定义一个函数需要符合的形状：
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

## 数组的类型
### 「类型 + 方括号」表示法
```ts
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

数组的项中不允许出现其他的类型：
```ts
let fibonacci: number[] = [1, '1', 2, 3, 5];
// error TS2322: Type '(number | string)[]' is not assignable to type 'number[]'.
// Type 'number | string' is not assignable to type 'number'.
// Type 'string' is not assignable to type 'number'.
```

### 数组泛型
```ts
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

### 用接口表示数组
```ts
// NumberArray 表示：只要 index 的类型是 number，那么值的类型必须是 number。
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

### any 在数组中的应用
一个比较常见的做法是，用 any 表示数组中允许出现任意类型：
```ts
let list: any[] = ['Xcat Liu', 25, { website: 'http://xcatliu.com' }];
```

## 函数的类型
### 函数声明
```js
// 函数声明（Function Declaration）
function sum(x: number, y: number): number {
    return x + y;
}

// 输入多余的（或者少于要求的）参数，是不被允许的：
sum(1, 2, 3);
sum(1);
// error TS2346: Supplied parameters do not match any signature of call target.
```

### 函数表达式
```ts
// 函数表达式（Function Expression）
let mySum = function (x: number, y: number): number {
    return x + y;
};
```
这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 mySum 添加类型，则应该是这样：
```ts
// 在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

### 可选参数
输入多余的（或者少于要求的）参数，是不允许的，但可以我们用 `?` 表示可选的参数。
```ts
// 需要注意的是，可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必须参数了：
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

### 参数默认值
在 ES6 中，我们允许给函数的参数添加默认值，TypeScript 会将添加了默认值的参数识别为可选参数。
此时就不受「可选参数必须接在必需参数后面」的限制了：
```ts
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');
```

### 剩余参数
ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数（rest 参数）。
事实上，下例的 items 是一个数组。所以我们可以用数组的类型来定义它：
```ts
// 注意，rest 参数只能是最后一个参数(ES6用法)
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

### 重载
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：
```ts
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
但上例有一个缺点，就是不能够精确的表达。
我们希望输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。

那可以使用**重载**定义多个 reverse 的函数类型：
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

//注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
```

## 类型断言
类型断言（Type Assertion）可以用来手动指定一个值的类型。

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法。而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法，此时可以使用**类型断言**。

### 语法
```js
// <类型>值
// 或
// 值 as 类型
// 在 tsx 语法（React 的 jsx 语法的 ts 版）中必须用后一种。
```

### 例子
下例中，获取 `something.length` 的时候会报错。
```ts
function getLength(something: string | number): number {
    if (something.length) {
        return something.length;
    } else {
        return something.toString().length;
    }
}
// error TS2339: Property 'length' does not exist on type 'string | number'.
// Property 'length' does not exist on type 'number'.
```

此时可以使用类型断言，将 something 断言成 string：
```ts
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```
**类型断言的用法如上，在需要断言的变量前加上 `<Type>` 即可。**

类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的：
```ts
function toBoolean(something: string | number): boolean {
    return <boolean>something;
}

// error TS2352: Type 'string | number' cannot be converted to type 'boolean'.
// Type 'number' is not comparable to type 'boolean'.
```

## 声明文件
当使用第三方库时，我们需要引用它的声明文件。

### 声明语句
假如我们想使用第三方库，比如 jQuery，但是在 TypeScript 中，我们并不知道 `$` 或 `jQuery` 是什么东西：
```js
jQuery('#foo');
// error TS2304: Cannot find name 'jQuery'.
```

这时，我们需要使用 declare 关键字来定义它的类型，帮助 TypeScript 判断我们传入的参数类型对不对：
```ts
declare var jQuery: (selector: string) => any;
jQuery('#foo');
// declare 定义的类型只会用于编译时的检查，编译结果中会被删除。
```

### 声明文件
通常我们会把类型声明放到一个单独的文件中，这就是声明文件：
```ts
// jQuery.d.ts
declare var jQuery: (string) => any;
```

> **我们约定声明文件以 `.d.ts` 为后缀。**

然后在使用到的文件的开头，用「三斜线指令」表示引用了声明文件：
```ts
/// <reference path="./jQuery.d.ts" />
jQuery('#foo');
```

### 第三方声明文件
当然，jQuery 的声明文件不需要我们定义了，已经有人帮我们定义好了：[jQuery in DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/jquery/index.d.ts)。

我们可以直接下载下来使用，但是更推荐的是使用工具统一管理第三方库的声明文件。

社区已经有多种方式引入声明文件，不过 TypeScript 2.0 推荐使用 @types 来管理。

@types 的使用方式很简单，直接用 npm 安装对应的声明模块即可，以 jQuery 举例：
```js
npm install @types/jquery --save-dev
```

可以在[TypeScript Types Search](http://microsoft.github.io/TypeSearch/)搜索你需要的声明文件。

## 内置对象
JavaScript 中有很多[内置对象](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)，它们可以直接在 TypeScript 中当做定义好了的类型。
内置对象是指根据标准*（ECMAScript 和其他环境（比如 DOM）的标准）*在全局作用域（Global）上存在的对象。

### ECMAScript 的内置对象
我们可以在 TypeScript 中将ECMAScript 标准提供的内置对象定义为这些类型：
```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

而他们的定义文件，则在 [TypeScript 核心库](https://github.com/Microsoft/TypeScript/tree/master/src/lib) 定义的文件中。

### DOM 和 BOM 的内置对象
DOM 和 BOM 提供的内置对象有：`Document`、`HTMLElement`、`Event`、`NodeList` 等。
TypeScript 中会经常用到这些类型：
```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

而他们的定义文件，同样在 [TypeScript 核心库](https://github.com/Microsoft/TypeScript/tree/master/src/lib) 定义的文件中。

### TypeScript 核心库的定义文件
TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。
当你在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作了。
比如：
```js
Math.pow(10, '2');
// error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```
上面的例子中，`Math.pow` 必须接受两个 number 类型的参数。事实上 `Math.pow` 的类型定义如下：
```ts
interface Math {
    /**
     * Returns the value of a base expression taken to a specified power.
     * @param x The base value of the expression.
     * @param y The exponent value of the expression.
     */
    pow(x: number, y: number): number;
}
```

再举一个 DOM 中的例子：
```js
document.addEventListener('click', function(e) {
    console.log(e.targetCurrent);
});
// error TS2339: Property 'targetCurrent' does not exist on type 'MouseEvent'.
```

上面的例子中，`addEventListener` 方法是在 TypeScript 核心库中定义的：
```ts
interface Document extends Node, GlobalEventHandlers, NodeSelector, DocumentEvent {
    addEventListener(type: string, listener: (ev: MouseEvent) => any, useCapture?: boolean): void;
}
```
所以 `e` 被推断成了 `MouseEvent`，而 `MouseEvent` 是没有 `targetCurrent` 属性的，所以报错了。

### Node
Node.js 不是内置对象的一部分，如果想用 TypeScript 写 Node.js，则需要引入第三方声明文件：
```js
npm install @types/node --save-dev
```
