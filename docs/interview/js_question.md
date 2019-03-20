# 值得做一做的JS问题
## 1.promise数组顺序输出
问题：让这个array数组里的promise按顺序输出：
```js
// 异步函数a
var a = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
    console.log('a');
      resolve('a')
    }, 1000)
  })
}

// 异步函数b
var b = function (data) {
  return new Promise(function (resolve, reject) {
    console.log(data + 'b');
    resolve(data + 'b')
  })
}

// 异步函数c
var c = function (data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
    console.log(data + 'c');
      resolve(data + 'c')
    }, 500)
  })
}

var array = [];
array.push(a,b,c);
```

按照顺序执行，大概跟在做求和运算时候的思想一样：
```js
//求和的时候通常这么做，先定义一个sum，然后依次往里做加法
var sum = 0;
array.forEach(function(item) {
  sum = sum + item;
});
```

回答一：
```js
function queue(arr) {
  // 要得到一个then then then的promise链，先定义一个已经resolve了的promise
  var sequence = Promise.resolve()
  arr.forEach(function (item) {
    sequence = sequence.then(item)
  })
  return sequence
}

// 执行队列
queue([a, b, c])
```

回答二：
```js
async function queue(arr) {
  let res = null
  for (let promise of arr) {
    res = await promise(res)
  }
  return res
}
queue([a, b, c])
```

## 2. 快速的让一个数组乱序
```js
var arr = [1,2,3,4,5,6,7,8,9,10];
arr.sort(function(){
    return Math.random() - 0.5;
})
console.log(arr);
```

## 3. 拍平二/多维数组
方法一：
实验性API
[Array.prototype.flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

方法二：
```js
var arr = [1, 2, 3, [3, 3, 3, [5, 4, 5, 6, 6, 7, 8]],[333, 4444]];
function product() {
 // 1、创建一个空数组,
 var newarr = [];
 ///2、并且返回一个函数,函数参数为要拍平的数组
 return function flatten(arr) {
  // 3、循环数组，判断每一项,不为数组的话将其塞入newarr
  // 若为数组,递归调用 faltten,并将结果与newarr合并
  for (var t of arr) {
   if (!Array.isArray(t)) {
    newarr.push(t);
   } else {
    newarr.concat(flatten(t))
   }
  }
  return newarr
 }
}
var flatten = product();
flatten(arr);
```

方法三：
和上例一样的原理。
```js
var arr = [1, 2, 3, [3, 3, 3, [5, 4, 5, 6, 6, 7, 8]],[333, 4444]];
function flatten(arr){
 return arr.reduce(function(pre,cur){
  if(!Array.isArray(cur)){
   return [...pre, cur];
  }else{
   return [...pre, ...flatten(cur)]
  }
 },[])
}
flatten(arr);
```
## 4. 如何渲染几万条数据并不卡住界面
这道题考察了如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 DOM，那么就可以通过 `requestAnimationFrame` 来每 16 ms 刷新一次
```js
<ul>控件</ul>

setTimeout(() => {
  // 插入十万条数据
  const total = 100000
  // 一次插入 20 条，如果觉得性能不好就减少
  const once = 20
  // 渲染数据总共需要几次
  const loopCount = total / once
  let countOfRender = 0
  let ul = document.querySelector("ul");
  function add() {
    // 优化性能，插入不会造成回流
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < once; i++) {
      const li = document.createElement("li");
      li.innerText = Math.floor(Math.random() * total);
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    countOfRender += 1;
    loop();
  }
  function loop() {
    if (countOfRender < loopCount) {
      window.requestAnimationFrame(add);
    }
  }
  loop();
}, 0);
```

## 5. 数组去重方法十一法
**方法一、利用ES6 Set去重**
```js
function unique (arr) {
  return Array.from(new Set(arr))
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
 //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```

**方法二、利用for嵌套for，然后splice去重**
```js
function unique(arr){            
  for(var i=0; i<arr.length; i++) {
    for(var j=i+1; j<arr.length; j++) {
      if(arr[i]==arr[j]){
        //第一个等同于第二个，splice方法删除第二个
        arr.splice(j,1);
        j--;
      }
    }
  }
  return arr;
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
```
**方法三、利用includes**
```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    return
  }
  var array =[];
  for(var i = 0; i < arr.length; i++) {
    if(!array.includes( arr[i])) {
      //includes 检测数组是否有某个值
      array.push(arr[i]);
    }
  }
  return array
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
unique(arr)
```
**最简短方法**
```js
 var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];

[...new Set(arr)]
```
[参考](http://blog.poetries.top/FE-Interview-Questions/base/#_74-%E6%95%B0%E7%BB%84%E5%8E%BB%E9%87%8D%E6%96%B9%E6%B3%95%E6%80%BB%E7%BB%93)


## 6. 写一段JS程序提取URL中的各个GET参数
有这样一个URL：http://item.taobao.com/item.htm?a=1&b=2&c=&d=xxx&e，请写一段JS程序提取URL中的各个GET参数(参数名和参数个数不确定)，将其按key-value形式返回到一个json结构中，如{a:’1′, b:’2′, c:”, d:’xxx’, e:undefined}
```js
function serilizeUrl(url) {
  var result = {};
  url = url.split("?")[1];
  var map = url.split("&");
  for(var i = 0, len = map.length; i < len; i++) {
    result[map[i].split("=")[0]] = map[i].split("=")[1];
  }
  return result;
}
```

## 7. 在一个对象数组中查找一个指定的对象是否存在
存在返回其index，不存在返回 -1
```js
var cities = [{a:2},{c:3},{d:4}]
var city = {c:3}

function find(list, elem) {
  for (let i = 0; i < list.length; i++) {
    let current = list[i];
    for (key in current) {
      if (elem[key] === current[key]) {
        return i;
      }
    }
  }
  return -1;
}

find(cities, city);
```

## 8. 计算数组中每个元素出现的次数
```js
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

## 9. 按属性对object分类
```js
var people = [
  { name: 'Alice', age: 21 },
  { name: 'Max', age: 20 },
  { name: 'Jane', age: 20 }
];

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    // 为什么用中括号取对象值，而不用点(.)?
    // https://blog.csdn.net/qq_35772366/article/details/79270468
    // .是直接.属性的名字，[]里的索引存放的与属性名字相同的 字符串 
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

var groupedPeople = groupBy(people, 'age');
// groupedPeople is:
// { 
//   20: [
//     { name: 'Max', age: 20 }, 
//     { name: 'Jane', age: 20 }
//   ], 
//   21: [{ name: 'Alice', age: 21 }] 
// }
```

## 10. 使用 Promise 完成图片的加载。
```js
var preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};

preloadImage('https://xxx/xx.jpg')
  .then(function (e) { document.body.append(e.target) })
  .then(function () { console.log('加载成功') })
```

## duplicate([1,2,3,4,5]);
输出 [1,2,3,4,5,1,2,3,4,5]
```js
function duplicate(arr){
  // 一定要把初始的数组长度先保存再遍历，不然数组长度会一直增加
  var length = arr.length;
  for(var i=0; i<length; i++) {
    arr.push(arr[i]);
  }
  return arr;
}
```

## 叠加
输出

add(2, 5); // 7 

add(2)(5); // 7

```js
function add(x,y) {
  if(arguments.length == 1){
    return function(y) { return x + y; };
  } else{
    return x+y;
  }
};
console.log(add(2)(5));
console.log(add(2,5));
```