<template>
    <div class="frame">
        <div class="menuContent">
            <div class="logo">
                <img src="@images/logo.png" alt="">
            </div>
            <div class="menuList">
                <div
                    :class="['menu', { current: menu.id == currentMenuId }]"
                    @click="gotoMenu(menu)"
                    v-for="menu in menuList"
                    :key="menu.id">{{menu.name}}</div>
            </div>
        </div>
        <div class="mainContent">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuList: [
                {
                    id: 1,
                    name: '检查更新'
                },
                {
                    id: 2,
                    name: 'chrome插件'
                },
                {
                    id: 3,
                    name: '数据库'
                },
                {
                    id: 4,
                    name: '区分web端和客户端'
                },
                {
                    id: 5,
                    name: '多窗口'
                }
            ],
            currentMenuId: 1
        }
    },
    methods: {
        gotoMenu(menu) {
            this.currentMenuId = menu.id;
        }
    },
    mounted() {
        this.$router.push({
            name: 'checkUpdate'
        });
    }
}
</script>
<style lang="less" scoped>
@import "~@/render/libs/css/theme.less";
.frame {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    .menuContent {
        width: 200px;
        border-right: 1px solid @borderColor;
        .logo {
            padding: 10px 0;
            display: flex;
            justify-content: center;
            border-bottom: 1px solid @borderColor;
            img {
                display: block;
                width: 60px;
                height: 60px;
            }
        }
        .menuList {
            .menu {
                width: 100%;
                height: 50px;
                font-size: 16px;
                text-align: center;
                line-height: 50px;
                color: @fontColor;
                cursor: pointer;
                &.current {
                    background-color: @themeColor;
                    color: #fff;
                }
                &:hover {
                    background-color: @themeColor;
                    color: #fff;
                }
            }
        }
    }
    .mainContent {
        flex: 1;
        padding: 16px;
    }
}
</style>