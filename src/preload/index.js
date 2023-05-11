const { ipcRenderer } = require('electron');
const { app, getGlobal } = require('@electron/remote');
import * as Event from '@/render/libs/js/event.js';
import './update.preload.js';
window.isElectron = true;