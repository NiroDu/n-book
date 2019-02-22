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
  return await res
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

## 3. 如何渲染几万条数据并不卡住界面
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

## 4. 数组去重方法十一法
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


## 5. 写一段JS程序提取URL中的各个GET参数
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