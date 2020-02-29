import Vue from 'vue';
import index from "./index.vue";
new Vue({
    el: '#app',
    render: h=>{
        return h(index)
    }
});
