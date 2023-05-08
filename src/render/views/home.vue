<template>
    <div class="content">
        <img @click="changeSrc" style="width:200px;height:80px;" :src="src" alt="">
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
            version,
            src: 'https://eachina.changyan.cn/wj/admin/api/sys/captcha.jpg?rnd=0.0683086533845274'
        }
    },
    computed: {
        ...mapState(["userInfo"])
    },
    methods: {
        ...mapActions(['getUserInfo']),
        ...mapMutations(['setUserInfo']),
        changeSrc() {
            this.src = `https://eachina.changyan.cn/wj/admin/api/sys/captcha.jpg?rnd=${Date.now()}`;
        },
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