<template>
    <div class="content">
        <div class="versionInfo">
            <h5>当前主版本信息（当前主进程版本）：</h5>
            <p>版本号：{{setup.version.join('.')}}</p>
            <p>版本类型：{{setup.versionType}}</p>
            <p>发布时间：{{new Date(setup.publishTime)}}</p>
        </div>
        <div class="versionInfo">
            <h5>当前小版本信息（基于当前主版本进行的小版本更新）：</h5>
            <p>{{smallVersion || '无'}}</p>
        </div>
        <div class="versionInfo">
            <h5>线上最新版本：</h5>
            <!-- <p>1.0.0.1</p> -->
            <div class="checking">
                <img :src="require('@images/loading.gif')" alt="">
                正在检测......
            </div>
        </div>
        <div class="btnWrap">
            <!-- <button>立即更新</button> -->
            <button @click="runMain">启动</button>
        </div>
    </div>
</template>
<script>
const { ipcRenderer } = require('electron');
const setup = require('@config/version.js');
export default {
    data() {
        return {
            // 主版本信息
            setup,
            // 小版本信息
            smallVersion: null
        }
    },
    methods:{
        // 跳转到主窗口
        runMain(newVersionPath, version){
            ipcRenderer.send('create-main', {
                newVersionPath,
                version
            });
        },
        // 获取在线版本信息
        getOnlineVersion() {

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
        
        // this.runMain();
        console.log(setup)
    }
}
</script>
<style lang="less">
* {
    margin: 0;
    padding: 0;
}
.content{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    .versionInfo {
        padding: 20px 20px 0 20px;
        h5 {
            margin-bottom: 10px;
        }
        p {
            padding-left: 10px;
            font-size: 12px;
            color: #595959;
        }
        .checking {
            display: flex;
            align-items: center;
            padding-left: 10px;
            font-size: 12px;
            color: #595959;
            img {
                display: block;
                width: 16px;
                height: 16px;
                margin-right: 6px;
            }
        }
    }
    .btnWrap {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
        button {
            width: 100px;
            line-height: 32px;
            font-size: 14px;
            cursor: pointer;
        }
    }
}
</style>
