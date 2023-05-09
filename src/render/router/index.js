const { context } = require('../../../config/index.js');
module.exports = [
    {
        path: context.page + '/index.html',
        name: 'index',
        meta: {
            title: '首页',
            author: '--',
            parentRouter: '--'
        },
        component: () => import('../views/index.vue'),
        children: [
            {
                path: context.page + '/guide.html',
                name: 'guide',
                meta: {
                    title: 'guide',
                    author: '--',
                    parentRouter: '--'
                },
                component: () => import('../views/guide.vue')
            },
            {
                path: context.page + '/checkUpdate.html',
                name: 'checkUpdate',
                meta: {
                    title: 'checkUpdate',
                    author: '--',
                    parentRouter: '--'
                },
                component: () => import('../views/checkUpdate.vue')
            }
        ]
    }
];
