// 访问electron对象
const {
    remote,
    ipcRenderer
} = require('electron');
// 访问node模块
const fs = require('fs');
const path = require('path');
import {testLoad} from './other.load.js';
// 访问window对象
window.isClient = true;
window.sayHello = function() {
    console.log('hello');
};
// 操作dom
const div = document.createElement('div');
div.innerText = 'I am a div';


const btn1 = document.createElement('button');
btn1.innerHTML = '打印window.isClient';
btn1.onclick = function() {
    console.log(window.isClient);
}

const btn2 = document.createElement('button');
btn2.innerHTML = '调用sayHello';
btn2.onclick = function() {
    sayHello();
}

const p = document.createElement('p');
p.innerText = '注意打开控制台';

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(div);
    document.body.appendChild(btn1);
    document.body.appendChild(btn2);
    document.body.appendChild(p);
    testLoad();
});