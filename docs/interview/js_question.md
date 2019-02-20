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