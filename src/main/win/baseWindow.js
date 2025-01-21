const { BrowserWindow } = require('electron');
const process = require('process');
const url = require('url');
const path = require('path');
const EventEmitter = require('events');
const libCookie = require('cookie');
const { devServer, context, hostMap } = require('@config/index.js');
const remote = require('@electron/remote/main');

const devMode = process.env.NODE_ENV === 'development';

class BaseWindow extends EventEmitter {
    window = null;
    wwwroot = '';
    urlFilter = {
        urls: Object.values(hostMap).map(v => `${v}/*`)
    };
    partition = '';
    preloadJsPath = '';
    constructor(options={}) {
        super();
        this.partition = options.partition;
        this.wwwroot = options.wwwroot || __dirname;
        this.preloadJsPath = path.join(this.wwwroot, 'preload.js');
    }

    create() {
        this.window = this._createWindow();
        this.addEventListenerToWin();
        this.addDevToolToWebcontent();
        this.addFiltersToWebRequest();
        return this.window;
    }

    // 创建窗口
    _createWindow() {
        const config = {
            title: 'electron-vue-template',
            width: 1240,
            height: 720,
            minWidth: 1240,
            minHeight: 720,
            offscreen: true,
            resizable: false,
            show: true,
            center: true,
            frame: true,
            hasShadow: true,
            fullscreen: false,
            simpleFullscreen: true,
            thickFrame: true,
            autoHideMenuBar: false, //隐藏菜单栏
            movable: true, //可否移动
            minimizable: true, //可否最小化
            maximizable: true, //可否最大化
            skipTaskbar: false, //在任务栏中显示窗口
            acceptFirstMouse: true, //是否允许单击页面来激活窗口
            opacity: 1, //设置窗口初始的不透明度
            closable: true,
            backgroundColor: '#ffffff',
            allowRunningInsecureContent: true, //允许一个 https 页面运行 http url 里的资源
            webPreferences: {
                devTools: true, //是否打开调试模式
                webSecurity: false, //禁用安全策略
                disablewebsecurity: true,
                nodeIntegrationInWorker: true,
                worldSafeExecuteJavaScript:false,
                partition: this.partition,
                webviewTag: true,
                safeDialogs: true,
                safeDialogsMessage: '是否继续显示弹窗提示？',
                nodeIntegrationInSubFrames: true,
                allowDisplayingInsecureContent: true, //允许一个使用 https的界面来展示由 http URLs 传过来的资源
                allowRunningInsecureContent: true, //允许一个 https 页面运行 http url 里的资源
                preload: this.preloadJsPath, //预加载客户端js
                nodeIntegration: true, //5.x以上版本，默认无法在渲染进程引入node模块，需要这里设置为true
                contextIsolation: false, //11.x以上版本，需要把此项设置为false，才可以在渲染进程使用node模块
                enableRemoteModule: true
            }
        };
        const window = new BrowserWindow(config);
        window.loadURL(this.getPageUrl());
        remote.enable(window.webContents);
        window.webContents.session.setCertificateVerifyProc((req, cb) => {
            // 不验证服务器证书
            cb(0);
        });
        return window;
    }

    // 本地调试时，从devServer加载页面。打包后从本地文件加载页面。
    getPageUrl() {
        const fileUrl = url.pathToFileURL(path.join(this.wwwroot, 'index.html')).href;
        const { host, port } = devServer;
        const indexUrl = `http://${host}:${port}${context.page}/index.html`;
        return devMode ? encodeURI(indexUrl) : fileUrl;
    }

    // 给窗口添加事件监听
    addEventListenerToWin() {
        // 监听关闭
        this.window.on('closed', () => {
            this.window = null;
        });
    }

    // 给webContent添加调试器，之后可以使用webContents.openDevTools打开调试工具
    addDevToolToWebcontent() {
        const __debugger = this.window.webContents.debugger;
        try {
            if (__debugger.isAttached()) {
                __debugger.detach('1.1');
            }
            __debugger.attach('1.1');
            __debugger.sendCommand('Network.enable');
        } catch (err) {
            console.log('无法启动调试', err);
        }
    }

    // 拦截页面请求，处理cookie，解决渲染进程的跨域问题
    addFiltersToWebRequest() {
        const req = this.window.webContents.session.webRequest;
        req.onBeforeSendHeaders(this.urlFilter, this.onBeforeSendHeaders.bind(this));
        req.onHeadersReceived(this.urlFilter, this.onHeadersReceived.bind(this));
    }

    onBeforeSendHeaders(details, callback) {
        const { url: reqUrl, requestHeaders: reqHeaders } = details;
        const hostname = this.getUrlHost(reqUrl);
        reqHeaders['Origin'] = reqUrl;
        reqHeaders['Referer'] = reqUrl;
        const cookieObj = global.cookie[hostname];
        const cookieStr = Object.keys(cookieObj).map(k => {
            return `${k}=${cookieObj[k]}`;
        }).join(';');
        reqHeaders['Cookie'] = cookieStr || '';
        callback({ requestHeaders: reqHeaders });
    }

    onHeadersReceived(details, callback) {
        const hostname = this.getUrlHost(details.url);
        const resHeaders = details.responseHeaders;
        // {
        //     'access-control-allow-origin': [ '*' ],
        //     'cache-control': [ 'no-store, no-cache' ],
        //     'content-type': [ 'image/jpeg' ],
        //     date: [ 'Mon, 08 May 2023 05:22:57 GMT' ],
        //     'set-cookie': [
        //       'SESSION=ZTBmMDAwM2ItMGM1MS00Mzk0LWI2YWUtZDI1M2E1M2RlMDdj; Path=/api/; Secure; HttpOnly; SameSite=Lax',
        //       'JSESSION_ID=ZTBmMDAwM2ItMGM1MS00Mzk0LWI2YWUtZDI1M2E1M2RlMDdj; Path=/api/; Secure; HttpOnly; SameSite=Lax',
        //     ],
        //     'strict-transport-security': [ 'max-age=15724800; includeSubDomains' ],
        //     vary: [
        //       'Origin',
        //       'Access-Control-Request-Method',
        //       'Access-Control-Request-Headers'
        //     ]
        // }
        const incomingCookie = {};
        (resHeaders['set-cookie'] || []).forEach(k => {
            // {
            //     SESSION: 'ZTBmMDAwM2ItMGM1MS00Mzk0LWI2YWUtZDI1M2E1M2RlMDdj',
            //     Path: '/api/',
            //     SameSite: 'Lax'
            // }
            // 只取cookie值（SESSION），其他限制字段不要
            const o = libCookie.parse(k.split(';')[0]);
            Object.assign(incomingCookie, o);
        });
        Object.assign(global.cookie[hostname], incomingCookie);
        callback({ response: responseHeaders, statusLine: details.statusLine });
    }

    getUrlHost(requestUrl){
        return url.parse(requestUrl).hostname;
    }
}

module.exports = BaseWindow;