<template>
    <div>
        <Button>sdfsd</Button>fsdfs
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    methods: {},
    mounted() {
        this.$router.push({
            name: 'home'
        });
    }
}
</script>
<style></style>