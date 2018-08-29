# JS中对 `this` 的理解

## 总结
可以归纳为：**this所指的就是直至包含this指针的上层对象**

**调用形式**
1. 普通函数：this指向 ~全局对象window~
2. 对象的方法：this指向 ~该对象~
3. 构造函数：this指向  ~新构造的对象~

## 1. 一般用处
对于this变量最要的是能够理清this所引用的对象到底是哪一个，首先分析this所在的函数是当做哪个对象的方法调用的，则该对象就是this所引用的对象。

**示例一**
```js
var obj = {};
obj.x = 100;
obj.y = function() { alert( this.x ); };
obj.y();    //弹出 100
```

这段代码非常容易理解，当执行 obj.y() 时，函数是作为对象obj的方法调用的，因此函数体内的this指向的是obj对象，所以会弹出100。

**示例二**
```js
var checkThis = function() {
    alert( this.x); 
};
var x = 'this is a property of window';

var obj = {};
obj.x = 100;
obj.y = function(){ alert( this.x ); };

var obj2 = obj.y;

obj.y();   //弹出 100
checkThis();    //弹出 'this is a property of window'
obj2();    //弹出 'this is a property of window'
```

这里为什么会弹出 'this is a property of window'，可能有些让人迷惑。在JavaScript的变量作用域里有一条规则 **“全局变量都是window对象的属性”**。
当执行 checkThis() 时相当于 window.checkThis()，因此，此时checkThis函数体内的this关键字的指向变成了window对象，而又因为window对象obj2有一个x属性（ 'this is a property of window’），所以会弹出 'this is a property of window'。

只要判断出当前函数是被哪个对象调用的，就可以判断出当前this变量的指向。

---

## 2. this.x 与 apply()、call()
通过call和apply可以重新定义函数的执行环境，即this的指向。

**示例三：call()**
```js
function changeStyle( type , value ){
    this.style[ type ] = value;
}

var one = document.getElementById( 'one' ); 

changeStyle.call( one , 'fontSize' , '100px' );

changeStyle('fontSize' , '300px');  //出现错误，因为此时changeStyle中this引用的是window对象，而window并无style属性。
```

注意changeStyle.call() 中有三个参数，第一个参数用于指定该函数将被哪个对象所调用。这里指定了one，也就意味着，changeStyle函数将被one调用，因此函数体内this指向是one对象。
而第二个和第三个参数对应的是changeStyle函数里的type和value两个形参。

**示例四：apply()**
```js
function changeStyle( type , value ){
    this.style[ type ] = value;
}

var one = document.getElementById( 'one' ); 

changeStyle.apply( one , ['fontSize' , '100px' ]);

changeStyle('fontSize' , '300px');  //出现错误，原因同示例三
```

apply的用法和call大致相同，只有一点区别，apply只接受两个参数，第一个参数和call相同，第二个参数必须是一个数组，数组中的元素对应的就是函数的形参。

---

## 3. 无意义（诡异）的this用处
**示例五**
```js
var obj = {
    x : 100,
    y : function(){
        setTimeout(
            function(){ alert(this.x); }    //这里的this指向的是window对象，并不是我们期待的obj,所以会弹出undefined
         , 2000);
    }
};

obj.y();
```

如何达到预期的效果：
```js
var obj = {
    x : 100,
    y : function(){
        var that = this;
        setTimeout(
            function(){ alert(that.x); }
         , 2000);
    }
};

obj.y(); //弹出100
```

---

## 4. 事件监听函数中的this
**示例六**
```js
var one = document.getElementById( 'one' );
one.onclick = function(){
    alert( this.innerHTML );    //this指向的是one元素
};
```

---

## 补充一句：
箭头函数，是不会创建自己的this,它只会从自己的作用域链的上一层继承this。
[箭头函数 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

```js
function myFunc() {
  this.myVar = 0;
  setTimeout(() => {
    this.myVar++;
    console.log(this.myVar) // 1
  }, 0);
}
```


[深入理解JavaScript中的this关键字](http://www.cnblogs.com/rainman/archive/2009/05/03/1448392.html#1523756)
