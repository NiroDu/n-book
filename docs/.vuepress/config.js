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
        lastUpdated: '上次更新',
        algolia: {
            apiKey: '9df1720435cee96eb096180af7efb399',
            indexName: 'n-book'
        },
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
                    '/javascript/about_js_this',
                    '/javascript/closure',
                    '/javascript/prototypes_and_prototype_chains',
                    '/javascript/inheritance_and_prototype_chain1',
                    '/javascript/inheritance_and_prototype_chain2',
                    '/javascript/event_loop',
                    '/javascript/es6_classes',
                    '/javascript/iife',
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