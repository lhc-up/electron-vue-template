<!--  by: hlwang 2018年11月08日
    name: 入口路由
    notes: 登录后根据路由进行分发
-->
<template>
    <div>
        <div id="app">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
        this.$router.push({
            name: 'index'
        });
    }
}
</script>