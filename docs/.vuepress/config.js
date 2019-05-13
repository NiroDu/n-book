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
    nav: [{ text: "Blog", link: "http://nirodu.com" }],
    sidebar: [
      {
        title: "写在前面",
        collapsable: false,
        children: ["/"]
      },
      {
        title: "Interview 专栏",
        collapsable: false,
        children: [
          "/interview/2018_basic.md",
          "/interview/js_question.md",
          "/interview/interview_error.md",
          "/interview/MDN_note.md"
        ]
      },
      {
        title: "JavaScript 专栏",
        collapsable: false,
        children: [
          "/javascript/this_in_js",
          "/javascript/about_js_this",
          "/javascript/closure",
          "/javascript/inheritance",
          "/javascript/prototypes_and_prototype_chains",
          "/javascript/inheritance_and_prototype_chain_1",
          "/javascript/inheritance_and_prototype_chain_2",
          "/javascript/event_loop",
          "/javascript/promise",
          "/javascript/asynchronous_function",
          "/javascript/es6_classes",
          "/javascript/iife"
        ]
      },
      {
        title: "React 专栏",
        collapsable: false,
        children: [
          "/react/react_basic",
          "/react/redux_basic",
          "/react/redux_intermediate",
          "/react/libs_with_react",
          "/react/react_ssr",
          "/react/redux_createstore",
          "/react/react_context"
        ]
      },
      {
        title: "Vue 专栏",
        collapsable: false,
        children: ["/vue/IIS"]
      },
      {
        title: "Webpack 专栏",
        collapsable: false,
        children: [
          "/webpack/webpack_1.md",
        ]
      },
      {
        title: "TypeScript 专栏",
        collapsable: false,
        children: [
          "/typescript/basic_usage.md",
          "/typescript/advanced_usage.md"
        ]
      },
      {
        title: "性能优化",
        collapsable: false,
        children: [
          "/performance/cache.md",
       ]
      },
      {
        title: "其他",
        collapsable: false,
        children: [
          "/other/yarn_npm_resource_change.md",
          "/other/common_commands.md"
        ]
      }
    ]
  }
};
