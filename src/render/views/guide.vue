<template>
    <div class="content">检查更新</div>
</template>

<script>
import marked from 'marked';
export default {
    data() {
        return {
            text: ''
        }
    },
    mounted() {
        const readme = require('../../../README.md');
        console.log(readme)
    }
};
</script>