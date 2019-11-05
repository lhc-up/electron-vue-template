import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions.js';
import mutations from './mutations.js';
Vue.use(Vuex);
// 这里为全局的，模块内的请在模块内动态注册
const store = new Vuex.Store({
    strict: true,
    state: {
        userInfo: {
            name: 'haoluo',
            address: 'beijing'
        }
    },
    getters: {},
    mutations,
    actions
});
export default store;
