<template>
    <div class="content" v-html="text"></div>
</template>

<script>
export default {
    data() {
        return {
            text: ''
        }
    },
    mounted() {
        const readme = require('../../../README.md');
        this.text = readme.default;
    }
};
</script>
<style lang="less" scoped>
.content {
    padding: 40px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
</style>