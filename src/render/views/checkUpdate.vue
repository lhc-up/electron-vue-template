<template>
    <div class="content">
        <div class="titleBar">
            <h2>当前版本：<strong>{{ version.join('.') }}</strong></h2>
            <Button :loading="loading" @click="checkUpdate">检查更新</Button>
            <span>仅模拟简单的更新流程</span>
        </div>
        <div class="versionWrap onlineVersion">
            <span>线上版本信息：</span>
            <Button v-if="Object.keys(versionInfo).length > 0" @click="download">下载更新包</Button>
            <span v-if="downloading">{{ `${percent}%` }}</span>
            <markdown :md="versionInfo"></markdown>
        </div>
        <div class="versionWrap localVersion">
            <span>本地更新包：</span>
            <Button @click="getLocalPkgList">刷新</Button>
            <div v-if="pkgList.length" class="pkgList">
                <div v-for="(item, index) in pkgList" :key="index" class="pkg">
                    <span>{{ item.dir }}</span>
                    <Button @click="loadPkg(item)" size="small">打开</Button>
                </div>
            </div>
            <div v-else class="none">暂无数据</div>
        </div>
    </div>
</template>

<script>
const { version } = require('@config/index.js');
import axios from 'axios';
import markdown from './modules/markdown.vue';
import * as Event from '@/render/libs/js/event.js';
export default {
    data() {
        return {
            version,
            loading: false,
            downloading: false,
            versionInfo: {},
            percent: 0,
            pkgList: [],
            isElectron: window.isElectron
        }
    },
    components: { markdown },
    methods: {
        checkUpdate() {
            this.loading = true;
            axios.get('http://127.0.0.1:8889/update.json').then(res => {
                const data = res.data;
                Object.keys(data).forEach(k => {
                    this.$set(this.versionInfo, k, data[k]);
                });
            }).catch(() => {
                alert('检测更新失败，请检查本地更新服务是否启动');
            }).finally(() => {
                this.loading = false;
            });
        },
        download() {
            // 这里的url需要从版本配置中获取
            const url = this.versionInfo.zipUrl;
            if (!url) {
                alert('更新包不存在');
                return;
            }
            this.downloading = true;
            axios.get(url, {
                responseType: 'arraybuffer',
                onDownloadProgress: ({ loaded, total }) => {
                    this.percent =((loaded / total) * 100).toFixed(0) || 0;
                }
            }).then(res => {
                this.versionInfo.zipUrl = url;
                Event.dispatchEvent('preload-update-save-zip-pkg', {
                    arraybuffer: res.data,
                    versionInfo: this.versionInfo
                });
            }).catch(err => {
                alert(err.message);
            }).finally(() => {
                this.downloading = false;
            });
        },
        getLocalPkgList() {
            const pkgList = [];
            Event.dispatchEvent('preload-update-pkg-list', {
                pkgList
            });
            this.pkgList.slice(0);
            this.pkgList.push(...pkgList);
        },
        loadPkg(pkg) {
            Event.dispatchEvent('preload-update-load-pkg', { pkg })
        },
        // 执行安装文件
        install() {
            Event.dispatchEvent('preload-update-install-exe', {
                versionInfo: this.versionInfo
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import "~@/render/libs/css/theme.less";
.content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .titleBar {
        display: flex;
        align-items: center;
        .ivu-btn {
            margin: 0 10px;
        }
    }
    .versionWrap {
        margin: 20px 0;
        padding: 20px 30px;
        border: 1px solid @borderColor;
        .pkgList {
            padding-top: 10px;
        }
    }
}
</style>