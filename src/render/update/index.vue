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
            <div v-if="isChecking" class="checking">
                <img :src="require('@images/loading.gif')" alt="">
                正在检测......
            </div>
            <p v-else>{{onlineVersionStr}}</p>
            <p v-if="isDownloading">正在下载：{{percent}}%</p>
            <p v-if="downloadResult">{{downloadResult}}</p>
        </div>
        <div class="btnWrap">
            <button v-if="hasNewVersion" @click="downloadResource">立即更新</button>
            <button @click="runMain('', '')">启动</button>
        </div>
    </div>
</template>
<script>
const { ipcRenderer, remote } = require('electron');
const { hasKey, getVal } = require('@/render/libs/js/settingsInfo.js');
const setup = require('@config/version.js');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
export default {
    data() {
        return {
            // 主版本信息
            setup,
            // 小版本信息
            smallVersion: null,
            // 在线版本信息
            onlineVersionInfo: {},
            // 本地版本
            localVersion: [],
            // 是否正在检测版本信息
            isChecking: false,
            // 是否正在下载资源
            isDownloading: false,
            // 下载结果
            downloadResult: '',
            // 下载进度
            percent: 0
        }
    },
    computed: {
        // 在线版本数组
        onlineVersion() {
            return this.onlineVersionInfo.version || [];
        },
        // 在线版本
        onlineVersionStr() {
            return this.onlineVersion.join('.') || '无';
        },
        // 是否强制更新
        isHardUpdate() {
            return !!this.onlineVersionInfo.hard;
        },
        // 是否有新版本
        hasNewVersion() {
            return this.onlineVersion.join('') > this.localVersion.join('');
        }
    },
    methods:{
        // 跳转到主窗口
        runMain(newVersionPath, version){
            if (!newVersionPath && !version) {
                if (this.localVersion.join('.') !== this.onlineVersion.join('.')) {
                    const userDataPath = remote.app.getPath('userData');
                    newVersionPath = path.join(userDataPath,`electron-vue-template-${this.setup.versionType}-v${this.localVersion.join('.')}`);
                    version = this.localVersion;
                }  
            }
            ipcRenderer.send('create-main', {
                newVersionPath,
                version
            });
        },
        
        // 获取在线版本信息
        getOnlineVersion() {
            this.isChecking = true;
            axios.get('https://raw.githubusercontent.com/luohao8023/electron-vue-template/master/update.json').then(res => {
                const data = res.data.data;
                this.onlineVersionInfo = data.update[0];
            }).catch(err => {
                console.error(err);
            }).finally(com=>{
                this.isChecking = false;
            });
        },
        // 获取本地版本，取当前代码版本和本地版本最大值
        getLocalVersion() {
            const setupVersion = this.setup.version;
            if (!hasKey('version', 'smallVersion')) {
                // 本地没有小版本记录
                this.localVersion = setupVersion;
                return false;
            }

            // 本地有小版本记录
            const localVersion = getVal('version', 'smallVersion');
            this.smallVersion = localVersion.join('.');
            if (localVersion.join('') > setupVersion.join('')) {
                this.localVersion = localVersion;
            } else {
                this.localVersion = setupVersion;
            }
        },
        // 下载更新资源
        downloadResource() {
            let url = '';
            const { exeUrl, zipUrl } = this.onlineVersionInfo;
            if (this.onlineVersion.join('') - this.localVersion.join('') >= 100) {
                url = exeUrl;
            } else {
                url = zipUrl;
            }

            this.percent = 0;
            this.isDownloading = true;
            const ext = path.extname(url);

            axios({
                methods: 'get',
                url,
                responseType: 'arraybuffer',
                onDownloadProgress: e => {
                    this.percent = (e.loaded / e.total * 100 | 0);
                }
            }).then(res => {
                this.downloadResult = '下载成功';
                // 存储的文件名称，自定义格式
                const fileName = `electron-vue-template-${this.setup.versionType}-v${this.onlineVersion.join('.')}${ext}`;
                // 系统临时文件夹
                const tempPath = remote.app.getPath('temp');
                const userDataPath = remote.app.getPath('userData');
                fs.writeFileSync(path.join(tempPath, fileName), Buffer.from(res.data));
                if (this.onlineVersion.join('') - this.localVersion.join('') >= 100) {
                    // 大版本更新，执行安装程序
                    // TODO:
                } else {
                    // 小版本更新，解压zip并修改引用页面路径
                    const fileNameWithOutExt = fileName.slice(0, -1 * ext.length);
                    ipcRenderer.sendSync('main-unzip-file', {
                        inPath: tempPath,
                        fileNameWithOutExt,
                        fileName,
                        outPath: userDataPath
                    });
                    const newVersionPath = path.join(userDataPath, fileNameWithOutExt);
                    // 启动主程序，页面路径指向刚更新的小版本文件
                    this.runMain(newVersionPath, this.onlineVersion);
                }
            }).catch(err => {
                this.downloadResult = '下载失败';
                console.error(err);
            }).finally(() => {
                this.isDownloading = false;
            });
        }
    },
    mounted(){
        this.getLocalVersion();
        this.getOnlineVersion();
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
