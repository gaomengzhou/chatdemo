/** socket 客户端配置信息 */
interface SocketOptions {
  /** 配置：请求地址 */
  brokerUrl?: string;
  /** 配置：路径 */
  path?: string;
  /** 配置：用户名 */
  username?: string;
  /** 配置：密码 */
  password?: string;
  /** 配置：请求等待时间, 单位毫秒 */
  timeout?: number;
  /** 配置：命名空间 */
  namespace?: string;
  /** 配置：客户端编号 */
  clientId?: string;
  /** 是否开启调试 */
  debug?: boolean;
}

export class SocketService implements Partial<WebSocket> {
  /**
   * 单例
   */
  public static instance = null as any;

  public static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  // 和服务端连接的socket对象
  public ws: WebSocket | null = null;

  // 存储回调函数
  public callBackMapping = {} as any;

  // 标识是否连接成功
  public connected = false;

  // 记录重试的次数
  public sendRetryCount = 0;

  // 重新连接尝试的次数
  public connectRetryCount = 0;

  // 30s发一次心跳
  public timeout = 30000; // 30s发一次心跳

  public timeoutObj: any = null;

  public serverTimeoutObj: any = null;

  /** 参数配置 */
  protected options: SocketOptions = {
    /** 参数配置：路径
     * 开发环境 wss://hashchatdev.one2.cc/websocket/getMessage
     * 预生产环境 wss://hashchatpre.one2.cc/websocket/getMessage
     */
    // path: `wss://hashchatdev.one2.cc/websocket/getMessage/${1}`,
    /** 参数配置：全局请求等待时间，单位毫秒 */
    timeout: 1000 * 15,
    /** 参数配置：命名空间 */
    namespace: 'sockets',
    /** 参数配置：是否开启调试模式 */
    debug: process.env.NODE_ENV === 'development',
  };

  public async reset(): Promise<void> {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
  }

  public start(): void {
    this.timeoutObj = setTimeout(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      this.send('ping');
      this.serverTimeoutObj = setTimeout(() => {
        // 如果超过一定时间还没重置，说明后端主动断开了
        // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.ws?.close();
      }, this.timeout);
    }, this.timeout);
  }

  //  定义连接服务器的方法
  public connect(): void {
    // 1:单双 | 2:牛牛 找不到默认牛牛
    const params = window.location.href.split('?id=')[1] || 1;
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket');
    }
    let brokerUrl = '';
    const url = window.location.href.slice(0, 5);
    if (url === 'https') {
      brokerUrl =
        +window.location.port.length > 0
          ? `wss://${window.location.hostname}:${window.location.port}/websocket/getMessage`
          : `wss://${window.location.hostname}/websocket/getMessage`;
    } else {
      brokerUrl =
        +window.location.port.length > 0
          ? `ws://${window.location.hostname}:${window.location.port}/websocket/getMessage`
          : `ws://${window.location.hostname}/websocket/getMessage`;
    }
    brokerUrl = `${brokerUrl}/${params}`;
    if (process.env.NODE_ENV !== 'production') {
      // brokerUrl = this.options.path || brokerUrl;
      brokerUrl = `wss://hashchatpre.one2.cc/websocket/getMessage/${params}`;
    }
    this.ws = new WebSocket(brokerUrl);
    // 连接成功的事件
    this.ws.onopen = async (): Promise<void> => {
      console.log('连接服务端成功');
      await this.reset();
      this.start();
      this.connected = true;
      // 重置重新连接的次数
      this.connectRetryCount = 0;
    };
    // 1.连接服务端失败
    // 2.当连接成功之后, 服务器关闭的情况(连接失败重连)
    this.ws.onclose = () => {
      console.log('连接服务端失败');
      this.connected = false;
      this.connectRetryCount += this.connectRetryCount;
      setTimeout(() => {
        this.connect();
      }, 500 * this.connectRetryCount);
    };
    // 得到服务端发送过来的数据
    // this.ws.onmessage = async (msg: any): Promise<void> => {
    //   console.log("msg :>> ", msg);
    //   await this.reset();
    //   this.start();
    //   if (msg.data === "success") return;
    //   const notice = JSON.parse(msg.data);
    //   console.log(notice);
    // };
  }

  // 回调函数的注册
  public registerCallBack(callBack: <T>() => T): void {
    console.log('回调函数的注册', callBack);
    this.callBackMapping = callBack;
  }

  // 取消某一个回调函数
  public unRegisterCallBack(callBack: <T>() => T): void {
    console.log('取消某一个回调函数', callBack);
    this.callBackMapping = null;
  }

  // 发送数据的方法
  public send(data: any): void {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0;
      this.ws?.send(data);
    } else {
      this.sendRetryCount += this.sendRetryCount;
      setTimeout(() => {
        this.send(data);
      }, this.sendRetryCount * 500);
    }
  }
}

export default new SocketService();
