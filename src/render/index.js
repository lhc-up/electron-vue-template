import Vue from 'vue';
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import store from './store/index.js';
import routers from './router/index.js';
import index from './views/index.vue';
import '@/render/libs/css/public.less';

Vue.use(VueRouter);
Vue.use(ViewUI);

const router = new VueRouter({
    mode: 'history',
    routes: routers
});

//取消 Vue 所有的日志与警告
Vue.config.silent = true;
const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(index)
});

window.myApp = app;