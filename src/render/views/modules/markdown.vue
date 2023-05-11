<template>
    <div class="markdown" v-html="text"></div>
</template>

<script>
import { marked } from 'marked';
export default {
    name: 'markdown',
    props: ['md'],
    data() {
        return {
            text: ''
        }
    },
    watch: {
        md: {
            deep: true,
            handler(n) {
                this.render(n);
            }
        }
    },
    methods: {
        render(md) {
            md = md || this.md;
            if (typeof md === 'string') {
                this.text = marked.parse(md);
                return;
            }
            let text ='```javascript\n';
            text += JSON.stringify(md, null, 4);
            this.text = marked.parse(text);
            console.log(this.text)
        }
    }
};
</script>