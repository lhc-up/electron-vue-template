module.exports = [
    {
        path: '/index.html',
        name: 'index',
        meta: {
            title: '首页',
            author: '--',
            parentRouter: '--'
        },
        component: (resolve) => {
            require.ensure([], () => {
                return resolve(require('../views/index.vue'))
            }, "index")
        },
        children: [
            {
                path: '/home.html',
                name: 'home',
                meta: {
                    title: 'home页',
                    author: '--',
                    parentRouter: '--'
                },
                component: (resolve) => {
                    require.ensure([], () => {
                        return resolve(require('../views/home.vue'))
                    }, "home")
                },
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
                component: (resolve) => {
                    require.ensure([], () => {
                        return resolve(require('../views/order.vue'))
                    }, "order")
                },
                children: []
            }
        ]
    }
];
