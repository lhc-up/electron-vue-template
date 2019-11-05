<template>
    <div class="content">
        <h1>Welcome to electron-vue-template!</h1>
        <h2>name:{{userInfo.name}}</h2>
        <h2>address:{{userInfo.address}}</h2>
        <button @click="changeAddress">设置address为tianjin</button>
        <button @click="toOrderPage">去订单页</button>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        ...mapMutations(['setUserInfo']),
        changeAddress() {
            this.setUserInfo({
                address: 'tianjin'
            });
        },
        toOrderPage() {
            this.$router.push({
                name: 'order'
            });
        }
    }
}
</script>
<style></style>