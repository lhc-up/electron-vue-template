<template>
    <div class="upDateBox">
        <p>检查更新中...</p>
        <p>{{countDown}}s</p>
    </div>
</template>
<script>
const { ipcRenderer } = require('electron');
export default {
    data() {
        return {
            countDown: 5
        }
    },
    methods:{
        // 跳转到主窗口
        runMain(newVersionPath, version){
            let timer = setInterval(() => {
                if (this.countDown <= 0) {
                    timer = clearInterval(timer);
                    ipcRenderer.send('create-main', {
                        newVersionPath,
                        version
                    });
                }
                this.countDown--;
            }, 1000);
        }
    },
    mounted(){
        // 更新逻辑看下面伪代码
        // const v1 = getOnlineVersion();
        // const v2 = getLocalVersion();
        // const needUpdate = checkVersion(v1, v2);
        // if (needUpdate) {
        //     downloadVersion();
        // }
        
        this.runMain();
    }
}
</script>
<style lang="less" scoped>
.upDateBox{
    position: absolute;
    width: 100%;
    height: 100%;
    background:lightblue;
    p {
        text-align: center;
        line-height: 50px;
    }
}
</style>
