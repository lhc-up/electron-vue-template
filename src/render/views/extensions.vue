<template>
    <div class="extensions" v-html="text"></div>
</template>

<script>
import * as Event from '@/render/libs/js/event.js';
export default {
    name: 'extensions',
    data() {
        return {
            text: ''
        }
    },
    mounted() {
        const md = require('./markdown/extensions.md');
        this.text = md.default;
    }
};
</script>

<style>
</style>