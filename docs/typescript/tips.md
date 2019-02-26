# 小技巧

## 懒

用第三方插件，tslint要求要.d.ts声明，有没有什么办法快速解决这个声明，而不用一个个去看这个插件export出的东西：
写到一个 shim.d.ts 放到tsconfig.json的同级目录/子目录下（它会自动遍历寻找所有的 *.d.ts）
```js
declare module 'xxx' {
  const content: any;
  export default content;
}
```