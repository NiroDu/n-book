module.exports = {
  base: "/n-book/",
  title: "N-book",
  description: "记录一些技术方面的文章",
  markdown: {
    lineNumbers: true
  },
  port: 8084,
  head: [
    ["link", { rel: "icon", href: `/logo.png` }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    ["meta", { name: "msapplication-TileColor", content: "#000000" }]
  ],
  themeConfig: {
    repo: "NiroDu/N-book",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "编辑此页",
    activeHeaderLinks: false,
    sidebarDepth: 3,
    lastUpdated: "上次更新",
    algolia: {
      apiKey: "d08f9a5b1bc67cc33d3420f0e97c9c8c",
      indexName: "n_book"
    },
    nav: [
      {
        text: "Home",
        link: "/"
      },
      {
        text: "TypeScript",
        link: "/typescript/"
      },
      {
        text: "Python",
        link: "/python/"
      },
      { 
        text: "Blog", 
        link: "https://nirodu.com"
      },
    ],
    sidebar: {
      '/typescript/': [
        {
          title: '初识 TypeScript',
          collapsable: true,
          children: [
            ['/typescript/chapter1/', 'Introduction'],
            '/typescript/chapter1/install',
            '/typescript/chapter1/start'
          ]
        },
        {
          title: 'TypeScript 常用语法',
          collapsable: true,
          children: [
            '/typescript/chapter2/type',
            '/typescript/chapter2/declare',
            '/typescript/chapter2/interface',
            '/typescript/chapter2/class',
            '/typescript/chapter2/function',
            '/typescript/chapter2/generic',
            '/typescript/chapter2/inference',
            '/typescript/chapter2/advance'
          ]
        },
        {
          'title': 'ts-axios 项目初始化',
          collapsable: true,
          children: [
            'chapter3/require',
            'chapter3/init',
            'chapter3/base'
          ]
        },
        {
          'title': 'ts-axios 基础功能实现',
          collapsable: true,
          children: [
            'chapter4/url',
            'chapter4/data',
            'chapter4/header',
            'chapter4/response',
            'chapter4/response-header',
            'chapter4/response-data'
          ]
        },
        {
          'title': 'ts-axios 异常情况处理',
          collapsable: true,
          children: [
            'chapter5/error',
            'chapter5/enhance'
          ]
        },
        {
          'title': 'ts-axios 接口扩展',
          collapsable: true,
          children: [
            'chapter6/extend',
            'chapter6/overload',
            'chapter6/generic'
          ]
        },
        {
          'title': 'ts-axios 拦截器实现',
          collapsable: true,
          children: [
            'chapter7/interceptor'
          ]
        },
        {
          'title': 'ts-axios 配置化实现',
          collapsable: true,
          children: [
            'chapter8/merge',
            'chapter8/transform',
            'chapter8/create'
          ]
        },
        {
          'title': 'ts-axios 取消功能实现',
          collapsable: true,
          children: [
            'chapter9/cancel'
          ]
        },
        {
          'title': 'ts-axios 更多功能实现',
          collapsable: true,
          children: [
            'chapter10/withCredentials',
            'chapter10/xsrf',
            'chapter10/upload-download',
            'chapter10/auth',
            'chapter10/validateStatus',
            'chapter10/paramsSerializer',
            'chapter10/baseURL',
            'chapter10/static'
          ]
        },
        {
          title: "TS",
          collapsable: true,
          children: [
            "/typescript/basic_usage.md",
            "/typescript/intermediate_usage.md",
            "/typescript/tips.md"
          ]
        },
      ],
      '/python/': [
        {
          title: '语法速学',
          collapsable: true,
          children: [
            '/python/env',
            '/python/python3_grammer_wake_up',
          ]
        },
      ],
      '/': [
        {
          title: "写在前面",
          collapsable: false,
          children: ["/"]
        },
        {
          title: "JavaScripts专栏",
          collapsable: true,
          children: [
            "/javascript/this_in_js.md",
            "/javascript/about_js_this.md",
            "/javascript/closure.md",
            "/javascript/inheritance.md",
            "/javascript/prototypes_and_prototype_chains.md",
            "/javascript/inheritance_and_prototype_chain_1.md",
            "/javascript/inheritance_and_prototype_chain_2.md",
            "/javascript/event_loop.md",
            "/javascript/promise.md",
            "/javascript/asynchronous_function.md",
            "/javascript/es6_classes.md",
            "/javascript/iife.md"
          ]
        },
        {
          title: "React 专栏",
          collapsable: true,
          children: [
            "/react/react_basic.md",
            "/react/redux_basic.md",
            "/react/redux_intermediate.md",
            "/react/libs_with_react.md",
            "/react/react_ssr.md",
            "/react/redux_createstore.md",
            "/react/react_context.md"
          ]
        },
        {
          title: "Vue 专栏",
          collapsable: true,
          children: ["/vue/IIS.md"]
        },
        {
          title: "Webpack 专栏",
          collapsable: true,
          children: [
            "/webpack/webpack_basic.md",
            "/webpack/webpack_intermediate.md",
            "/webpack/webpack_advanced.md"
          ]
        },
        {
          title: "TypeScript 专栏",
          collapsable: true,
          children: [
            "/typescript/basic_usage.md",
            "/typescript/intermediate_usage.md",
            "/typescript/tips.md"
          ]
        },
        {
          title: "性能优化",
          collapsable: true,
          children: ["/performance/cache.md"]
        },
        {
          title: "Interview 专栏",
          collapsable: true,
          children: [
            "/interview/2018_basic.md",
            "/interview/js_question.md",
            "/interview/interview_error.md",
            "/interview/MDN_note.md"
          ]
        },
        {
          title: "其他",
          collapsable: true,
          children: [
            "/other/regular_expression.md",
            "/other/yarn_npm_resource_change.md",
            "/other/common_commands.md"
          ]
        }
      ]
    }
  }
};
