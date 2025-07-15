import { defineConfig } from "vitepress";

export default defineConfig({
  // 基础配置
  title: "N-Book",
  description: "记录一些技术方面的文章",
  base: "/n-book/",
  srcDir: "docs",
  // 指定 public 目录
  vite: {
    publicDir: "../public", // 相对于 srcDir 的路径
  },
  markdown: {
    lineNumbers: true,
    theme: "everforest-dark",
  },
  // head 标签配置
  head: [
    ["link", { rel: "icon", href: `/n-book/favicon.ico` }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }],
  ],
  // 主题配置
  themeConfig: {
    logo: "/wing.png",

    // 目录配置 - 显示到三级标题
    outline: {
      level: [1, 4], // TOC 层级 （h1-h4）
      label: "页面导航",
    },

    // 导航栏配置
    nav: [
      { text: "Home", link: "/" },
      { text: "TypeScript", link: "/typescript/chapter1/README" },
      { text: "Python", link: "/python/env" },
    ],

    // 侧边栏配置
    sidebar: {
      "/": [
        {
          text: "JavaScript 专栏",
          collapsed: true,
          items: [
            { text: "This in JS", link: "/javascript/this_in_js" },
            { text: "JS 中对 this 的理解", link: "/javascript/about_js_this" },
            { text: "闭包", link: "/javascript/closure" },
            { text: "继承", link: "/javascript/inheritance" },
            {
              text: "原型与原型链",
              link: "/javascript/prototypes_and_prototype_chains",
            },
            {
              text: "继承与原型链(1)",
              link: "/javascript/inheritance_and_prototype_chain_1",
            },
            {
              text: "继承与原型链(2)",
              link: "/javascript/inheritance_and_prototype_chain_2",
            },
            { text: "事件循环", link: "/javascript/event_loop" },
            { text: "Promise", link: "/javascript/promise" },
            { text: "异步函数", link: "/javascript/asynchronous_function" },
            { text: "ES6 类", link: "/javascript/es6_classes" },
            { text: "IIFE", link: "/javascript/IIFE" },
          ],
        },
        {
          text: "React 专栏",
          collapsed: true,
          items: [
            { text: "React 基础", link: "/react/react_basic" },
            { text: "Redux 基础", link: "/react/redux_basic" },
            { text: "Redux 进阶", link: "/react/redux_intermediate" },
            { text: "Libs with React", link: "/react/libs_with_react" },
            { text: "从 0 实现 React SSR", link: "/react/react_ssr" },
            { text: "Redux createStore 的实现原理", link: "/react/redux_createstore" },
            { text: "React Context 怎么用", link: "/react/react_context" },
          ],
        },
        {
          text: "Vue 专栏",
          collapsed: true,
          items: [{ text: "IIS 配置", link: "/vue/IIS" }],
        },
        {
          text: "Webpack 专栏",
          collapsed: true,
          items: [
            { text: "Webpack 基础", link: "/webpack/webpack_basic" },
            { text: "Webpack 进阶", link: "/webpack/webpack_intermediate" },
            { text: "Webpack 高级", link: "/webpack/webpack_advanced" },
          ],
        },
        {
          text: "自动化测试",
          collapsed: true,
          items: [
            { text: "基本原理", link: "/testing/basic_principle" },
            { text: "Jest 基础", link: "/testing/jest_basic" },
            { text: "Jest 进阶", link: "/testing/jest_advanced" },
          ],
        },
        {
          text: "性能优化",
          collapsed: true,
          items: [{ text: "浏览器缓存", link: "/performance/cache" }],
        },
        {
          text: "CSS",
          collapsed: true,
          items: [{ text: "Flexbox", link: "/css/2020-05-14-flexbox" }],
        },
        {
          text: "Interview 专栏",
          collapsed: true,
          items: [
            { text: "基础题 2018", link: "/interview/basic_2018" },
            { text: "JS 问题", link: "/interview/js_question" },
            { text: "面试中遇上的题", link: "/interview/interview_error" },
            { text: "MDN 笔记", link: "/interview/mdn_note" },
          ],
        },
        {
          text: "其他",
          collapsed: true,
          items: [
            { text: "正则表达式", link: "/other/regular_expression" },
            { text: "包管理器配置", link: "/other/yarn_npm_resource_change" },
            { text: "OS常用命令", link: "/other/common_commands" },
          ],
        },
      ],
      "/typescript/": [
        {
          text: "Once",
          collapsed: true,
          items: [
            { text: "基础用法", link: "/typescript/basic_usage" },
            { text: "中级用法", link: "/typescript/intermediate_usage" },
            { text: "技巧总结", link: "/typescript/tips" },
          ],
        },
        {
          text: "初识 TypeScript",
          collapsed: true,
          items: [
            { text: "Introduction", link: "/typescript/chapter1/README" },
            { text: "安装", link: "/typescript/chapter1/install" },
            { text: "开始", link: "/typescript/chapter1/start" },
          ],
        },
        {
          text: "TypeScript 常用语法",
          collapsed: true,
          items: [
            { text: "类型", link: "/typescript/chapter2/type" },
            { text: "声明", link: "/typescript/chapter2/declare" },
            { text: "接口", link: "/typescript/chapter2/interface" },
            { text: "类", link: "/typescript/chapter2/class" },
            { text: "函数", link: "/typescript/chapter2/function" },
            { text: "泛型", link: "/typescript/chapter2/generic" },
            { text: "类型推断", link: "/typescript/chapter2/inference" },
            { text: "高级用法", link: "/typescript/chapter2/advance" },
          ],
        },
        {
          text: "ts-axios 项目初始化",
          collapsed: true,
          items: [
            { text: "需求分析", link: "/typescript/chapter3/require" },
            { text: "初始化", link: "/typescript/chapter3/init" },
            { text: "基础配置", link: "/typescript/chapter3/base" },
          ],
        },
        {
          text: "ts-axios 基础功能实现",
          collapsed: true,
          items: [
            { text: "URL 处理", link: "/typescript/chapter4/url" },
            { text: "数据处理", link: "/typescript/chapter4/data" },
            { text: "请求头处理", link: "/typescript/chapter4/header" },
            { text: "响应处理", link: "/typescript/chapter4/response" },
            {
              text: "响应头处理",
              link: "/typescript/chapter4/response-header",
            },
            {
              text: "响应数据处理",
              link: "/typescript/chapter4/response-data",
            },
          ],
        },
        {
          text: "ts-axios 异常情况处理",
          collapsed: true,
          items: [
            { text: "错误处理", link: "/typescript/chapter5/error" },
            { text: "功能增强", link: "/typescript/chapter5/enhance" },
          ],
        },
        {
          text: "ts-axios 接口扩展",
          collapsed: true,
          items: [
            { text: "接口扩展", link: "/typescript/chapter6/extend" },
            { text: "函数重载", link: "/typescript/chapter6/overload" },
            { text: "泛型接口", link: "/typescript/chapter6/generic" },
          ],
        },
        {
          text: "ts-axios 拦截器实现",
          collapsed: true,
          items: [{ text: "拦截器", link: "/typescript/chapter7/interceptor" }],
        },
        {
          text: "ts-axios 配置化实现",
          collapsed: true,
          items: [
            { text: "配置合并", link: "/typescript/chapter8/merge" },
            { text: "数据转换", link: "/typescript/chapter8/transform" },
            { text: "实例创建", link: "/typescript/chapter8/create" },
          ],
        },
        {
          text: "ts-axios 取消功能实现",
          collapsed: true,
          items: [{ text: "取消功能", link: "/typescript/chapter9/cancel" }],
        },
        {
          text: "ts-axios 更多功能实现",
          collapsed: true,
          items: [
            { text: "凭证配置", link: "/typescript/chapter10/withCredentials" },
            { text: "XSRF 防护", link: "/typescript/chapter10/xsrf" },
            { text: "上传下载", link: "/typescript/chapter10/upload-download" },
            { text: "身份认证", link: "/typescript/chapter10/auth" },
            { text: "状态验证", link: "/typescript/chapter10/validateStatus" },
            {
              text: "参数序列化",
              link: "/typescript/chapter10/paramsSerializer",
            },
            { text: "基础 URL", link: "/typescript/chapter10/baseURL" },
            { text: "静态方法", link: "/typescript/chapter10/static" },
          ],
        },
        {
          text: "ts-axios 单元测试",
          collapsed: true,
          items: [
            { text: "前言", link: "/typescript/chapter11/preface" },
            { text: "Jest 配置", link: "/typescript/chapter11/jest" },
            { text: "辅助函数测试", link: "/typescript/chapter11/helpers" },
            { text: "请求测试", link: "/typescript/chapter11/requests" },
            { text: "请求头测试", link: "/typescript/chapter11/headers" },
            { text: "实例测试", link: "/typescript/chapter11/instance" },
            { text: "拦截器测试", link: "/typescript/chapter11/interceptor" },
            { text: "配置合并测试", link: "/typescript/chapter11/mergeConfig" },
            { text: "取消功能测试", link: "/typescript/chapter11/cancel" },
            { text: "更多功能测试", link: "/typescript/chapter11/more" },
          ],
        },
        {
          text: "ts-axios 部署与发布",
          collapsed: true,
          items: [
            { text: "构建部署", link: "/typescript/chapter12/build-deploy" },
            { text: "示例演示", link: "/typescript/chapter12/demo" },
          ],
        },
      ],
      "/python/": [
        {
          text: "语法速学",
          collapsed: false,
          items: [
            { text: "环境配置", link: "/python/env" },
            {
              text: "Python3 语法速成",
              link: "/python/python3_grammer_wake_up",
            },
          ],
        },
      ],
    },

    // 其他配置
    socialLinks: [{ icon: "github", link: "https://github.com/NiroDu/n-book" }],

    // 编辑链接
    editLink: {
      pattern: "https://github.com/NiroDu/n-book/edit/main/:path",
      text: "编辑此页",
    },

    // 最后更新时间
    lastUpdated: {
      text: "上次更新",
    },

    // 搜索配置（如果需要 Algolia 搜索）
    search: {
      provider: "local",
      // provider: 'algolia',
      // options: {
      //   appId: 'your-app-id',
      //   apiKey: 'd08f9a5b1bc67cc33d3420f0e97c9c8c',
      //   indexName: 'n_book'
      // }
    },
  },
});
