<template>
    <div class="content">
        <h3>当前渲染进程版本号：{{version.version.join('.')}}</h3>
        <h1>Welcome to electron-vue-template!111</h1>
        <h2>name:{{userInfo.name}}</h2>
        <h2>address:{{userInfo.address}}</h2>
        <button @click="changeAddress">设置address为tianjin</button>
        <!-- <button @click="toOrderPage">去订单页</button> -->
        <router-link :to="{name: 'order'}" tag="button">去订单页</router-link>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import version from '@config/version.js';
export default {
    data() {
        return {
            version
        }
    },
    computed: {
        ...mapState(["userInfo"])
    },
    methods: {
        ...mapActions(['getUserInfo']),
        ...mapMutations(['setUserInfo']),
        changeAddress() {
            this.setUserInfo({
                address: "tianjin"
            });
        },
        toOrderPage() {
            this.$router.push({
                name: "order"
            });
        }
    }
};
</script>
<style></style>