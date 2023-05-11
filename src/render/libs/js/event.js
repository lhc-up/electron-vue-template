export const dispatchEvent = function (name, args, isBubbling, isBroadcast) {
    const event = document.createEvent('HTMLEvents');
    // name:事件类型，isBubbling:是否冒泡，isBroadcast:是否阻止浏览器的默认行为
    event.initEvent(name, isBubbling, isBroadcast);
    Object.assign(event, args);
    document.dispatchEvent(event);
    return event.result;
}
export const addEventListener = function (name, cb) {
    document.addEventListener(name, cb);
}
export const removeEventListener = function (name, cb) {
    document.removeEventListener(name, cb);
}