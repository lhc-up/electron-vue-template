module.exports = [
    {
        path: '/index.html',
        name: 'index',
        meta: {
            title: '首页',
            author: '--',
            parentRouter: '--'
        },
        component: () => import('../views/index.vue'),
        children: [
            {
                path: '/checkUpdate.html',
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
