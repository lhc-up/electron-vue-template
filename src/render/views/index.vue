<!-- render>views>index.vue -->
<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    methods: {},
    mounted() {
        if (this.$route.path === '/' || this.$route.name === 'index') {
            this.$router.push({
                name: 'home'
            });
        }
    }
}
</script>
<style></style>