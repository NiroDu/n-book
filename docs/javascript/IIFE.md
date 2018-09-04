# IIFE (Immediately Invoked Function Expressions)
在这里简单的说一说 IIFE (Immediately Invoked Function Expressions)，立即调用函数表达式。
立即调用函数表达式，也称自执行函数。


## 定义
> An IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined.

> It is a design pattern which is also known as a Self-Executing Anonymous Function and contains two major parts. The first is the anonymous function with lexical scope enclosed within the Grouping Operator (). This prevents accessing variables within the IIFE idiom as well as polluting the global scope.
> The second part creates the immediately executing function expression () through which the JavaScript engine will directly interpret the function.

## IIFE 参数问题
先看下面一个例子：
```js{2,6}
import jQuery from 'jquery';
((global, $) => {
    $(function () {
		// ...
    })
})(window, jQuery);
```

这个例子引发了我的一点疑问：1、为什么要把`window`和`jQuery`分别作为对象`global`和`$`传入到自执行函数里呢，作用是什么？

查了查资料，解了疑惑。
把`window`作为对象`global`传入的目的是将本是全局对象的`window`，注入IIFE中，便成了IIFE的局部变量`global`。
在有需要调用`window`对象的属性时，直接从局部变量`global`调用，不需要沿着scope chain（作用域链）一级级返回到顶层作用域`window`去，这样可以更快的访问`window`。
而将`jQuery`作为对象`$`传入，则是可以保证在这个IIFE内`$`就是`jquery`而不是其他类似使用`$`符号的库，避免冲突。

## 正确的IIFE写法
再看一个例子：
请解释下面代码为什么不能用作 IIFE：`function foo(){ }();` ，需要作出哪些修改才能使其成为 IIFE？

JavaScript 解析器将 `function foo(){ }();` 解析成 `function foo(){ }` 和 `();` 。
其中，前者是函数声明；后者（一对括号）是试图调用一个函数，却没有指定名称，因此它会抛出 Uncaught SyntaxError: Unexpected token ) 的错误。
应做如下修改：
```js
// 修改1：
(function foo(){ })();
// 修改2：
(function foo(){ }());
// 修改3 ES6：
(foo() => { })(); // With ES6 arrow functions (though parentheses only allowed on outside)
```

## 参考资料：
[IIFE - MDN Web Docs Glossary: Definitions of Web-related terms | MDN](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

[Lucy | JS Immediately Invoked Function Expressions](http://lucybain.com/blog/2014/immediately-invoked-function-expression/)