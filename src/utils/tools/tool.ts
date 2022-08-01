// 加载单个脚本
export const loadSingleScript = (loadUrl: string) => {
  const scriptCollection = document.getElementsByTagName('script');
  const scriptArr = Array.from(scriptCollection);
  const hasUrlList = (scriptArr as any).filter(
    (item: any) => item.getAttribute('src') === loadUrl
  );
  // console.log("hasUrlList", hasUrlList);
  if (hasUrlList.length > 0) return;
  const s = document.createElement('script');
  s.async = false;
  s.src = loadUrl;
  s.charset = 'utf-8';
  document.body.appendChild(s);
  return new Promise((resolve) => {
    // document.addEventListener('deviceReady', () => {
    //   resolve(true)
    s.addEventListener(
      'load',
      function handleScriptLoad() {
        s.removeEventListener('load', handleScriptLoad, false);
        resolve(true);
      },
      false
    );
  });
};

/** 是否安卓 */
export const isAndroid = () => {
  let result = false;
  if ((window as any).isAndroid) {
    result = true;
  }
  return result;
};
/** 是否安卓 */
export const isIOS = () => {
  let result = false;
  if ((window as any).iOSLoadJSSuccess) {
    result = true;
  }
  return result;
};

/** 是否安卓手机web浏览器 */
export const isWebAndroid = () => {
  const u = navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // 安卓
};
/** 是否ios手机web浏览器 */
export const isWebIOS = () => {
  const u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios;
};
/** 加载iosBridge */
export const loadBridge = (callback: any) => {
  const win = window as any;
  if ((window as any).isAndroid) {
    return callback(win.Android);
  }
  if (win.WebViewJavascriptBridge) {
    return callback(win.WebViewJavascriptBridge);
  }
};

/**
 * 睡眠多少秒
 * @param timeout 单位毫秒
 * @param returnVal 返回值
 */

export const sleep = (timeout: number, returnVal: any = true): Promise<any> => {
  return new Promise((resolve) =>
    /* eslint no-promise-executor-return: "off" */
    setTimeout(() => resolve(returnVal), timeout || 1000)
  );
};

/**
 * 循环睡眠
 * @param pollTimes 循环睡眠次数
 * @param options 配置 默认：{maxPollTimes: 100, stepSleepTime: 1000, maxSleepTime: 1000 * 10 }
 * @param options.maxPollTimes 循环睡眠次数
 * @param options.stepSleepTime 每次休眠时间
 * @param options.maxSleepTime 每次最大休眠时间，负数不限制
 * @return 超过报错
 */
export const sleepLoop = (
  pollTimes: number,
  options: {
    maxPollTimes?: number;
    stepSleepTime?: number;
    maxSleepTime?: number;
    promise?: boolean;
  } = {}
) => {
  const maxPollTimes = options.maxPollTimes || 100;
  const stepSleepTime = options.stepSleepTime || 1000;
  const maxSleepTime = options.maxSleepTime || 10 * 1000;
  if (pollTimes > maxPollTimes) {
    if (options.promise === true) return Promise.resolve(false);
    const message = `loop times more than ${maxPollTimes}.`;
    throw new Error(message);
  }
  if (maxSleepTime > 0)
    return sleep(
      Math.min(maxSleepTime, Math.ceil(pollTimes / 10) * stepSleepTime)
    );
  return sleep(Math.ceil(pollTimes / 10) * stepSleepTime, options.promise);
};

/**
 * 时间倒计时数字
 * @param times 单位秒
 * @param defaultStr
 * @return 格式化结果Day:HH:mm:ss
 */
export const countDownFormatStr = (times: number, defaultStr = '00:00') => {
  const seconds = +times;
  if (!seconds || seconds <= 0) return defaultStr;
  const array = [];

  let s: number;

  // 秒
  s = seconds % 60;
  array.unshift(s < 10 ? `0${s}` : `${s}`);

  // 分钟
  const mins = Math.floor(seconds / 60);
  if (!mins) {
    array.unshift('00');
    return array.join(':');
  }
  s = mins % 60;
  array.unshift(s < 10 ? `0${s}` : `${s}`);

  // 小时
  const hours = Math.floor(mins / 60);
  if (!hours) return array.join(':');
  // s = hours % 24;
  s = hours;
  array.unshift(s < 10 ? `0${s}` : `${s}`);
  return array.join(':');
};
// 获取光标位置
export const getPosition = (element: any) => {
  const docu: any = window.document;
  // const { target } = element;
  element.target.type = 'text';
  let cursorPos = 0;
  if (docu.selection) {
    // IE
    const selectRange = docu.selection.createRange();
    selectRange.moveStart('character', -element.value.length);
    cursorPos = selectRange.text.length;
  } else if (
    element.target.selectionStart ||
    +element.target.selectionStart === 0
  ) {
    // 获取光标结束的位置
    const len = element.target.value.length;
    if (element.target.selectionStart > len - 3) {
      element.target.selectionStart = len - 3;
      element.target.selectionEnd = len - 3;
    }
    cursorPos = element.target.selectionStart;
    // element.target.setSelectionRange(0, len - 3);
  }
  return cursorPos;
};

export default {
  loadSingleScript,
  isAndroid,
  isIOS,
  isWebAndroid,
  isWebIOS,
  loadBridge,
  sleep,
  sleepLoop,
  countDownFormatStr,
  getPosition,
};
