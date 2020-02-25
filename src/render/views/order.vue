<!-- render>views>index.vue -->
<template>
    <div class="content">
        <h1>order page！！！！</h1>
        <button @click="goHome">go home</button>
    </div>
</template>

<script>
export default {
    methods: {
        goHome() {
            this.$router.push({
                name: 'home'
            });
        }
    }
}
</script>
<style></style>