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