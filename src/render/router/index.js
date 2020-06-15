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
                path: '/home.html',
                name: 'home',
                meta: {
                    title: 'home页',
                    author: '--',
                    parentRouter: '--'
                },
                component: () => import('../views/home.vue'),
                children: []
            },
            {
                path: '/order.html',
                name: 'order',
                meta: {
                    title: '订单页',
                    author: '--',
                    parentRouter: '--'
                },
                component: () => import('../views/order.vue'),
                children: []
            }
        ]
    }
];
