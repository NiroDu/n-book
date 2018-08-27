module.exports = {
    base: '/n-book/',
    title: 'N-book',
    description: '记录一些技术方面的文章',
    markdown: {
        lineNumbers: true
    },
    port: 8084,
    head: [
        ['link', { rel: 'icon', href: `/logo.png` }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
    ],
    themeConfig: {
        repo: 'NiroDu/N-book',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '编辑此页',
        activeHeaderLinks: false,
        sidebarDepth: 3,
        lastUpdated: 'Last Updated',
        algolia: {
        },
        // serviceWorker: true,
        //   serviceWorker: {
        //     updatePopup: true, // Boolean | Object, 默认值是 undefined.
        //     // 如果设置为 true, 默认的文本配置将是: 
        //     // updatePopup: { 
        //     //    message: "New content is available.", 
        //     //    buttonText: "Refresh" 
        //     // }
        //   },
        nav: [
            { text: 'Blog', link: 'http://nirodu.com' }
        ],
        sidebar: [
            {
                title: '写在前面',
                collapsable: false,
                children: [
                    '/'
                ]
            },
            {
                title: 'JavaScript 专栏',
                collapsable: false,
                children: [
                    '/javascript/IIFE'
                ]
            },
            {
                title: 'Vue 专栏',
                collapsable: false,
                children: [
                    '/vue/IIS',
                ]
            },
            {
                title: 'TypeScript 专栏',
                collapsable: false,
                children: []
            },
        ]
    }
}